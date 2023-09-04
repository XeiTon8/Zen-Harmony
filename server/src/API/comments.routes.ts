import * as express from 'express';
import WebSocket from 'ws';
import {db} from '../server'
import { wss } from '../server';
import { broadCastComments } from '../server';
import { IComment } from '../types/task';


export const commentsRouter = express.Router();

commentsRouter.post("/:userID/projects/:projectID/tasks/:taskID/comments", (req, res) => {
    const taskID = req.params.taskID;
    const commentText = req.body.commentText;
    const commentCreatedBy = JSON.stringify(req.body.commentCreatedBy);
    const q = `INSERT INTO comments (taskID, commentText, commentCreatedBy) VALUES (?, ?, ?)`;
  
    if (commentText) {
      db.query(q, [taskID, commentText, commentCreatedBy], (err, results: any) => {
        if (err) {
          console.log("Error adding comment:", err);
          return res.json({ error: err.message });
        }
        const commentID = results.insertId;
        if (commentID) {
          const newComment: IComment = {
            taskID: Number(taskID),
            commentText: commentText,
            commentCreatedBy: JSON.parse(commentCreatedBy),
            commentID: commentID,
          };

          const message = {
            action: "addComment",
            comment: newComment
          };

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(message));
            }
          })
  
          broadCastComments(newComment);
          console.log("New comment added successfully");
          return res.json({ commentID });
        } else {
          return res.json({ err });
        }
      })} else {
      console.error("Failed to add a comment");
    }
  });
  
  commentsRouter.get("/:userID/projects/:projectID/tasks/:taskID/comments/:commentID", (req, res) => {
    const taskID = req.params.taskID;
    const commentID = req.params.commentID;
    const q = `SELECT * FROM comments WHERE taskID = ? AND commentID = ?`;
  
    db.query(q, [taskID, commentID], (err, data) => {
      if (err) {
        console.error(err);
      }
      const jsonData = JSON.stringify(data);
      const commentData = JSON.parse(jsonData);
      const response = commentData[0];
  
      return res.json({ data: response });
    });
  });
  
  
  commentsRouter.put("/:userID/projects/:projectID/tasks/:taskID/comments/:commentID", (req, res) => {
    const {commentText, taskID, commentID, commentCreatedBy} = req.body;
    const q = 'UPDATE comments SET commentText = ? WHERE taskID = ? AND commentID = ?';
    
    db.query(q, [commentText, taskID, commentID], (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(taskID);
        console.log(commentID);
        const message = {
          action: "updateComment",
          commentID: commentID,
          taskID: taskID,
          commentText: commentText,
          createdBy: commentCreatedBy,
        }
        console.log(message);
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        })
        return res.json({ data });
      }
    });
  });
  
  
  commentsRouter.delete("/:userID/projects/:projectID/tasks/:taskID/comments/:commentID", (req, res) => {
    const taskID = req.params.taskID;
    const commentID = req.params.commentID;
    console.log("Deleting" + commentID, req.body);
    console.log(req.body)
    const q = `DELETE FROM comments WHERE commentID = ?`;
    db.query(q, [commentID], (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const message = {
          action: "deleteComment",
          taskID: taskID,
          commentID: commentID,
        };
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
        return res.json({data});
    }
    })
  })
  
  
  