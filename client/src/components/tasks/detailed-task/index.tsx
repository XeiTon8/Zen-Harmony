import React from 'react';

import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/generalContext';
import { MySQLService } from '../../../services/MySQLService';

import { CommentsComponent } from '../commentForm';

// Redux
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux/hooks';

import { selectUserTask } from '../../../redux/tasks/selectors';
import { selectUserID, selectUser, selectUsers, selectSubscribedTasks  } from '../../../redux/users/selectors';

import { setTaskDeleted, setTaskSaved, finishTask } from '../../../redux/tasks/slice';
import { removeTask, updateTask } from '../../../redux/tasks/slice';
import { setUserData, subscribeToTaskAsync } from '../../../redux/users/slice';

import { taskStatus } from '../../../redux/tasks/types';
import { ITask } from '../../../redux/tasks/types';

import './task.scss'

export const DetailedTask: React.FC<ITask> = (
  {taskTitle, taskDescription, taskID, dateCreated, status, position, taskLabels, deadline, comments, isArchived, projectID, assignedUsers, costs, taskCreatedBy, timeSpent}) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const userTask = useSelector(selectUserTask);
    const userID = useSelector(selectUserID);
    const user = useSelector(selectUser);
    const users = useSelector(selectUsers);
    const subscribedTasks = useSelector(selectSubscribedTasks);

    const {timer} = React.useContext(AppContext)
    const isTaskOpened = false;

    const task: ITask = {taskTitle, taskDescription, taskID, dateCreated, status, position, taskLabels, deadline, comments, isArchived, projectID, assignedUsers, costs, taskCreatedBy, timeSpent}
    const [isEditable, setIsEditable] = React.useState(false);

    const service = new MySQLService();

    const [updatedTask, setUpdatedTask] = React.useState<ITask>({
        taskTitle: "",
        taskDescription: "",
        dateCreated: userTask.dateCreated,
        status: userTask.status,
        position: userTask.position,
        taskLabels: userTask.taskLabels,
        deadline: userTask.deadline,
        isArchived: userTask.isArchived,
        projectID: userTask.projectID,
        comments: userTask.comments,
        assignedUsers: userTask.assignedUsers,
        costs: userTask.costs,
        taskCreatedBy: userTask.taskCreatedBy,
      });
      
    const deleteTask =  async (e: React.MouseEvent, id: number) => {
        e.preventDefault();
          try {
              await service.deleteTask(userID!, projectID!, id);
              dispatch(removeTask(id));
              dispatch(setTaskDeleted(true))

              navigate("/")
              unsubscribeUserFromTask(task);

              setTimeout(() => {
                dispatch(setTaskDeleted(false))
                  }, 3000)
          } catch(e) {
              console.error(e)
      }}
      
    const editTask = async (id: number, task: ITask) => {
        try {
          setUpdatedTask({taskID: taskID, ...task})
          const taskToUpdate = {...task,
          assignedUsers: JSON.stringify(task.assignedUsers),
          taskLabels: JSON.stringify(task.taskLabels)
        }

          await service.updateTask( projectID!, id, taskToUpdate);
          const fetchedUpdRes = await service.getTaskByID(userID!, projectID!, id);
          const updData = fetchedUpdRes.data;

          dispatch(updateTask(updData))
          dispatch(setTaskSaved(true))
          setIsEditable(false);

          setTimeout(() => {
            dispatch(setTaskSaved(false));
              }, 3000)
        } catch(e) {
          console.error(e)
        }
      }
      
    const openEditTask = (id: number, editedTask: ITask) => {
        setIsEditable(!isEditable)
        setUpdatedTask({taskID: taskID, ...editedTask})
      }

    const finishUserTask = async ( taskToArchive: ITask, e: any, id: number) => {
        try {
          e.preventDefault();
          const taskToSend: ITask = {
            ...taskToArchive,
            isArchived: true,
            timeSpent: timer.passedTime,
            dateFinished: new Date(),
            deadline: new Date(taskToArchive.deadline!),
            costs: taskToArchive.costs,

          }
        
          await service.archiveTask(taskToSend, projectID!, id);
          const fetchedArchivedTask = await service.getTaskFromArchive(userID!, projectID!, id);
          const taskToAdd = fetchedArchivedTask.data

          dispatch(finishTask(taskToAdd));
          unsubscribeUserFromTask(task);
          dispatch(removeTask(id))
        } catch (e: any) {
          throw new Error(e)
        }
      };
  
    const handleUpdateTask = (e: React.ChangeEvent) => {
            const { name, value } = e.target as HTMLInputElement;
            if (name) {
              setUpdatedTask((prevTask) => ({
                ...prevTask,
                [name]: value,
              }));
            } else {
              console.log("Error");
      }}

    const handleTaskStatus = (e: React.ChangeEvent) => {
        const selectedValue = (e.target as HTMLOptionElement).value;
        setUpdatedTask((prevTask) => ({
          ...prevTask,
          status: selectedValue as taskStatus
        }))
        
      };

    const handleTaskAssignedUsers = (e: React.ChangeEvent) => {
        const selectedValue = (e.target as HTMLSelectElement).value;
        const userToAdd = users?.find((user) => user.userName === selectedValue);
        console.log(userToAdd);
  
        setUpdatedTask((prev) => ({
          ...prev,
          assignedUsers: [...prev.assignedUsers!, userToAdd!]
        }))
        console.log(updatedTask);
      }

    const mapStatusSelect = () => {
          return (
          <>
            {(Object.keys(taskStatus) as Array<keyof typeof taskStatus>).map((statusKey) => (
              <option key={statusKey} value={taskStatus[statusKey]} >
                {taskStatus[statusKey]}
              </option>
            ))}
          </>
      )}

    const mapUsersSelect = () => {
          return users?.map((user) => {
            return (
              <option value={user.userName}>{user.userName}</option>
            )
          })}

    const formatTime = (time: number): string => {
      const hours = Math.floor(time / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((time % 3600000) / 60000).toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const subscribeToTask = async (task: ITask) => {
      if (user.subscribedTasks && user.subscribedTasks.length > 0) {
        const taskArray: ITask[] = [...user.subscribedTasks!];
        taskArray.push(task);
        try {
          await dispatch(subscribeToTaskAsync(taskArray));
        
      } catch (error: any) {
        throw new Error(error);
      }
      } else {
        const taskArray: ITask[] = [];
        taskArray.push(task);
        try {
          await dispatch(subscribeToTaskAsync(taskArray));
        
      } catch (error: any) {
        throw new Error(error);
      }
      }
      
    };

    const unsubscribeUserFromTask =  async (task: ITask) => {
      try {
        const userToUpdate = {...user}
        const taskArrayToFilter = [...subscribedTasks!];
        const tasksToSet = taskArrayToFilter.filter((task) => task.taskID !== taskID);
        userToUpdate.subscribedTasks = tasksToSet;
        await service.updateUser(userToUpdate, userID!);
        const updatedUser = await service.getUser(user.userID!);
        const userToSet = updatedUser.data[0];
        dispatch(setUserData(userToSet));
      } catch (error: any) {
        throw new Error(error)
      }
    }

    return (      
      <>
          {userTask ? isEditable ? (
          <div className="detailed-task__container">
            <div className="detailed-task__edit-wrapper">
              <input  type="text" value={updatedTask.taskTitle || ''} onChange={handleUpdateTask} name="taskTitle" className={`detailed-task__edit-input detailed-task-card ${isTaskOpened ? 'visible' : 'hidden'}`}/>
              <textarea className="detailed-task__edit-input" value={updatedTask.taskDescription || ''} onChange={handleUpdateTask} name="taskDescription" />
              <div className="detailed-task__selects-wrapper">
                <select onChange={handleTaskStatus}>
                <option>Set task status</option>
                {mapStatusSelect()}
                </select>
                <select onChange={handleTaskAssignedUsers}>
                  <option>Assign users to the team</option>
                  {mapUsersSelect()}
                </select>
              </div>
              <input  className="detailed-task__edit-input" type="number" name="costs" id="" placeholder='Costs' onChange={handleUpdateTask} value={updatedTask.costs!} />
              <button className="button" type="button" onClick={() => editTask(taskID!, updatedTask)}>Confirm</button>
            </div>
          </div>
        
        ) : (
        <>
        <div className="detailed-task__container">
          <div className="task">
        <div className="detailed-task__values">
          <h3>{taskTitle}</h3>
          <div className="detailed-task__info">
            <span>{status}</span>
            <span>{assignedUsers ? assignedUsers?.length > 0 ? assignedUsers![0].userName : "No user assigned" : "No users were assigned"}</span>
            <span>Created at: {new Date(dateCreated!).toLocaleString()}</span>
            <span>Deadline: {new Date(deadline!).toLocaleString()}</span>
            <span> {costs  ? `$ ${costs}` : "0 $"}</span>
            <span>{formatTime(timeSpent!)}</span>
          </div>
          <div className="detailed-task__description">{taskDescription || 'No description'}</div>

          <div className="detailed-task__comments">
            <h3 className='detailed-task__comments-title'>Comments</h3>
            <CommentsComponent userID={userID!} taskID={taskID!} projectID={projectID} comments={comments!} />
          </div>
        </div>
        <div className="detailed-task__buttons">
          <button className='button' onClick={() => openEditTask(taskID!, task)}>Edit</button>
          {subscribedTasks?.find((task) => task.taskID === taskID) ?  
          <button className="button" onClick={() => unsubscribeUserFromTask(task)}>Unsubscribe</button> 
          :
          <button className="button" onClick={() => subscribeToTask(task)}>Subscribe</button>}
          <button className='button' onClick={(e: React.MouseEvent) => deleteTask(e, taskID!)}>Delete</button>
          <button className='button' onClick={(e: React.MouseEvent) => finishUserTask(task, e, taskID!)}>Close</button>
        </div>
          </div>
        </div>
        </>
      ): null} 
    </>
    )
}