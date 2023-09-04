import React from 'react';
import _debounce from 'lodash/debounce';
import {MySQLService} from '../../../services/MySQLService';

// Redux
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux/hooks';
import { selectComment, selectIsNewComment } from '../../../redux/tasks/selectors';
import { selectUser, selectUserID } from '../../../redux/users/selectors';
import { addComment, removeComment, updateComment, setUserComment, addCommentAsync, deleteCommentAsync, setUserCommentUser, setIsNewComment } from '../../../redux/tasks/slice';
import { addNewTaskIDToStack, clearNotificationLastTaskID, setIsNewNotification, setTaskIDAddToStack, setNotificationLastTaskID, setCommentCreatedByID } from '../../../redux/notifications/slice';
import { IComment } from '../../../redux/tasks/types';

// Comments editor
import { EditorState, convertToRaw, convertFromRaw, ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertFromHTML, convertToHTML } from 'draft-convert';

// CSS
import './commentForm.scss'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; 
import { useWebSocket } from '../../../hooks/useSocket';
import { AppContext } from '../../../context/generalContext';

interface CommentsProps {
    userID: string | null
    taskID: number | null;
    projectID: number | null;
    comments: IComment[]
}

export const CommentsComponent: React.FC<CommentsProps> = ({userID, taskID, projectID, comments}) => {

    const {socketRef} = useWebSocket();
    const socket = socketRef.current;
    const dispatch = useAppDispatch();
    const delayedDispatchAddToStack = _debounce((taskID: number) => {
      dispatch(setTaskIDAddToStack(taskID));
    }, 500)
    const service = new MySQLService();
    const userComment = useSelector(selectComment);
    const user = useSelector(selectUser);
  
    let isCurrentUserComment = false;

    const [isCommentEditable, setIsCommentEditable] = React.useState(false);

    const [updatedComment, setUpdatedComment] = React.useState<IComment>({
        taskID: taskID,
        commentID: userComment.commentID,
        commentText: "",
        commentCreatedBy: user
      })

    const [comment, setComment] = React.useState("")
    const [updatedUserComment, setUpdatedUserComment] = React.useState("")
    const [editorState, setEditorState] = React.useState(
      () => EditorState.createEmpty(),
    );

    const [updatedEditorState, setUpdatedEditorState] = React.useState(
      () => EditorState.createEmpty()
    )

    React.useEffect(() => {
        if (socket) {
          socket.onmessage = async (event: MessageEvent) => {
              const receivedData = JSON.parse(event.data);
  
              if (receivedData.action === "addComment") {
                  const receivedComment: IComment = receivedData.comment;
                  console.log("Adding from webSocket")
                  if (!isCurrentUserComment && receivedComment) {
                    dispatch(addComment({taskID: receivedComment.taskID!, comment: receivedComment}));
                    dispatch(setCommentCreatedByID(receivedComment.commentCreatedBy.userID!));
                    delayedDispatchAddToStack(taskID!);
                    setTimeout(() => {
                      dispatch(setIsNewComment(true));
                    }, 500)
                    isCurrentUserComment = false;
                    
                  }
              } else if (receivedData.action === "deleteComment") {
                  const { taskID, commentID } = await receivedData;
                  console.log("Deleting")
                  console.log(receivedData);
                  if (receivedData) {
                    dispatch(removeComment({taskID: Number(taskID), commentID: Number(commentID)}))
                  
                  }
              } else if (receivedData.action === 'updateComment') {
                const comment: IComment = await receivedData;
                const commentToAdd: IComment = {
                  commentText: comment.commentText,
                  taskID: comment.taskID,
                  commentID: comment.commentID,
                  commentCreatedBy: comment.commentCreatedBy,
                }
                if (receivedData) {
                  dispatch(updateComment(commentToAdd));
                
                }
              }
          };
      }
      }, [socketRef])


    React.useEffect(() => {
        let html = convertToHTML(editorState.getCurrentContent());
        let string = String(html);
        setComment(string);
        dispatch(setUserComment(comment))
        dispatch(setUserCommentUser(user))
      }, [editorState])

  
      React.useEffect(() => {
        let html = convertToHTML(updatedEditorState.getCurrentContent());
        let commentString = String(html);
        setUpdatedUserComment(commentString)
        setUpdatedComment({...updatedComment, commentText: updatedUserComment})
      }, [updatedEditorState])


      const addNewComment = async (e: React.MouseEvent, taskID: number, comment: IComment) => {
        e.preventDefault();
        console.log("addNewComment function run")
        try {
              await dispatch(addCommentAsync({ projectID: projectID!, taskID: taskID!, comment: comment }));
        } catch(e: any) {
          throw new Error(e)
        }
      }

      const deleteComment = async (e: React.MouseEvent, taskID: number, commentID: number) => {
        e.preventDefault();
        console.log(comments);
        try {
          await service.deleteComment(userID!, projectID!, taskID, commentID);
          
            if (socket) {
              const deletionData = {
                  action: "deleteComment",
                  taskID: taskID,
                  commentID: commentID
              };
              socket.send(JSON.stringify(deletionData));
        }

          
          console.log(taskID, commentID);
          
        } catch(e: any) {
          throw new Error(e);
        }
      }

      const editComment = async (e: React.MouseEvent, taskID: number, commentID: number, comment: IComment) => {
            e.preventDefault();
            try {
              console.log("Comment to update:", comment, taskID, commentID)
              await service.updateComment(userID!, projectID!, taskID, commentID, comment);
              if (socket) {
                const updationData = {
                  action: "updateComment",
                  comment: comment,
                }
                socket.send(JSON.stringify(updationData));
              }
              setIsCommentEditable(false);

            } catch(e: any) {
              throw new Error(e);
            }
      }

      const openEditComment = (id: number, editedComment: IComment) => {
        setIsCommentEditable(true)
        const content = convertFromHTML(editedComment.commentText!);
        const updatedContent = EditorState.createWithContent(content);
        setUpdatedEditorState(updatedContent);
        setUpdatedComment({...editedComment,
          taskID: taskID,
        commentID: id})
      }

      const mapComments = () => {
        return comments?.map((comment) => {
          if (comment !== undefined) {
            return (
              <>
              <div className="comments__comment-item">
                <div className="comment-item__created-by">
                  <span> {comment.commentCreatedBy ? comment.commentCreatedBy.userName : null}</span>
                </div>
                <div className="comments__comment-text" dangerouslySetInnerHTML={{__html: comment.commentText! }}></div>
                {user.userID === comment.commentCreatedBy.userID ? (
                  <div className="comments__comments-btns">
                  <button className='button' onClick={(e: React.MouseEvent) => openEditComment(comment.commentID!, comment)}>Edit comment</button>
                  <button className='button' onClick={(e: React.MouseEvent) => deleteComment(e, taskID!, comment.commentID!)}>Delete comment</button>
                </div>
                ) : null}
                
              </div>
                    
              </>
                )
          } else {
            alert("Comment is undefined.");
            return;
          }
        
        })
        }

    return (
    <>
    {isCommentEditable ? 
      <div>
        <Editor editorState={updatedEditorState} onEditorStateChange={setUpdatedEditorState} wrapperClassName='comments__editor-wrapper' editorClassName='comments__editor' />
        <button className="button" onClick={(e: React.MouseEvent) => editComment(e, updatedComment.commentID!, taskID!, updatedComment)}>Confirm</button>
      </div>  : comments.length > 0 ? 
      <>
        {mapComments()}
        <div className="comments__add-form">
        <Editor 
        editorState={editorState} onEditorStateChange={setEditorState} wrapperClassName='comments__editor-wrapper' editorClassName='comments__editor' 
        /> 
        <button className="button" type="button" onClick={(e: React.MouseEvent<HTMLButtonElement>) => addNewComment(e, taskID!, userComment)}>Add new comment</button>
        </div>
      </> : 
      <>
        <div className="comments__wrapper">
        <p>
        No new comments.
        </p>
          <div className="comments__add-form">
            <div className="comments__editor-content-wrapper">
            <Editor editorState={editorState} onEditorStateChange={setEditorState} wrapperClassName='comments__editor-wrapper' editorClassName='comments__editor' /> 
            </div>
          <button  
          className="button" 
          type="button" 
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => addNewComment(e, taskID!, userComment)}>
          Add new comment</button>
          </div>
        </div>
      </>
}
    </>
    )
}




