import * as express from 'express';
import {db} from '../server'
import { RowDataPacket } from 'mysql2';
import { ITask } from '../types/task';

export const tasksRouter = express.Router();


// GET ALL
tasksRouter.get("/tasks/all", (_req, res) => {
  const q = `SELECT appTasks.*, comments.commentText AS commentText, comments.commentID AS commentID, comments.commentCreatedBy AS commentCreatedBy
  FROM appTasks 
  LEFT JOIN comments ON appTasks.taskID = comments.taskID
  WHERE appTasks.isArchived NOT IN (true)
  `

  db.query(q, (err, data: RowDataPacket[]) => {
    if (err) {
      console.error(err);
    } else {
      const tasksWithComments = data.reduce((result: any[], taskFromDB) => {
        const { taskID, taskCreatedBy, commentText, commentID, commentCreatedBy, ...taskData } = taskFromDB;
        const task = result.find((taskToFind: any) => taskToFind.taskID === taskID);
        if (task) {
          task.comments.push({ commentID, commentText, commentCreatedBy });
        } else {
          const taskObj = {
            taskID,
            ...taskData,
            taskCreatedBy,
            comments: commentText ? [{ commentID, commentText, commentCreatedBy }] : []
          };
          result.push(taskObj);
        }
      
        return result;
      }, []);
      return res.json({ data: tasksWithComments });
    }
  })
})

// GET BY ID
tasksRouter.get("/:userID/projects/:projectID/tasks/:taskID", (req, res) => {
  const projectID = req.params.projectID;
  const id = req.params.taskID;
  const q = `SELECT appTasks.* FROM appTasks
  LEFT JOIN comments ON appTasks.taskID = comments.taskID
  WHERE appTasks.taskID = ? AND appTasks.projectID = ?
  `;
  db.query(q, [id, projectID], (err, data: RowDataPacket[]) => {
    if (err) {
      console.error(err);
    } else {
      const task = data[0];
      const comments = data.map((row) => ({
        commentText: row.commentText,
        commentID: row.commentID,
      })).filter((comment => comment.commentText));
      
      const taskLabels = task.taskLabels;
      const taskWithComments = {
        ...task,
        taskLabels,
        comments,
      };
      
      return res.json({ data: taskWithComments });
    }
  });
});

// GET ALL FROM ARCHIVE 
tasksRouter.get("/tasks/archived", (req, res) => {

  const q = `
    SELECT appTasks.*
    FROM appTasks
    LEFT JOIN comments ON appTasks.taskID = comments.taskID
    WHERE appTasks.isArchived = '1'
  `;

  db.query(q, (err, data: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      return res.json({ error: err.message });
    }
    // Group comments by taskID
    const tasksWithComments = data.reduce((acc: any[], row) => {
      const { taskID, commentText, commentID, ...taskData } = row;
      const task = acc.find((t: any) => t.taskID === taskID);

      if (task) {
        task.comments.push({commentID, commentText});
      } else {
        acc.push({ taskID, ...taskData, comments: commentText ? [{commentID, commentText}] : [] });
      }

      return acc;
    }, []);

    return res.json({ data: tasksWithComments });
  });
});

// GET FROM ARCHIVE 
tasksRouter.get("/:userID/projects/:projectID/tasks/:taskID/archive", (req, res) => {
  const projectID = req.params.projectID;
  const id = req.params.taskID;
  const q = `
    SELECT appTasks.* FROM appTasks
    LEFT JOIN comments ON appTasks.taskID = comments.taskID
    WHERE appTasks.taskID = ? AND appTasks.projectID = ? AND appTasks.isArchived = 1`;

  db.query(q, [id, projectID], (err, data: RowDataPacket[]) => {
    if (err) {
      console.error(err);
    } else {
      const task = data[0];
      const comments = data.map((row) => ({
        commentText: row.commentText,
        commentID: row.commentID,
      })).filter((comment => comment.commentText));

    const taskLabels = task.taskLabels;
    const taskWithComments = {
        ...task,
        taskLabels,
        comments,
      };
      
      return res.json({ data: taskWithComments });
    }
  });
});

// CREATE
tasksRouter.post("/:userID/projects/:projectID/tasks", (req, res) => {
    console.log("Inserting new task:", req.body);
    const q = `insert 
    into appTasks(taskTitle, taskDescription, dateCreated, deadline, position, taskLabels, isArchived, projectID, assignedUsers, costs, taskCreatedBy, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const updatedAssignedUsers = JSON.stringify(req.body.assignedUsers);
    const updatedTaskLabels = JSON.stringify(req.body.taskLabels);
    const updatedCreatedBy = JSON.stringify(req.body.taskCreatedBy);

    //! Excluded comments, they go to another table !//
    const values = [
      req.body.taskTitle,
      req.body.taskDescription,
      req.body.dateCreated,
      req.body.deadline,
      req.body.position,
      updatedTaskLabels,
      req.body.isArchived,
      req.body.projectID,
      updatedAssignedUsers,
      req.body.costs,
      updatedCreatedBy,
      req.body.status,
    ];

    console.log("insert:", values);

    db.query(q, values, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log("New task inserted successfully:", data);
        return res.json({ data });
      }
    });
  });

// UPDATE
tasksRouter.put("/projects/:projectID/tasks/:taskID", (req, res) => {
  const projectID = req.params.projectID;
  const id = req.params.taskID;
  const updatedTask = req.body;

  const taskCreatedBy = JSON.stringify(req.body.taskCreatedBy);
  const { comments, ...taskToUpdate } = updatedTask;
  
  const q = 'UPDATE appTasks SET ? WHERE taskID = ? AND projectID = ?';


  const currentDateCreated = new Date(req.body.dateCreated);
  const currentDeadline = new Date(req.body.deadline);
  const formattedDateCreated = currentDateCreated.toISOString().slice(0, 19).replace("T", " ");
  const formattedDeadline = currentDeadline.toISOString().slice(0, 19).replace("T", " ");
  taskToUpdate.dateCreated = formattedDateCreated;
  taskToUpdate.deadline = formattedDeadline;
  taskToUpdate.taskCreatedBy = taskCreatedBy;
  

  db.query(q, [taskToUpdate, id, projectID], (err, data: RowDataPacket[]) => {
    if (err) {
      console.error(err);
    } else {
      return res.json({data})
    }
  })
});

//* UPDATE TIMER *//
tasksRouter.put("/projects/:projectID/tasks/:taskID/updateTimeSpent", (req, res) => {
  const taskID = req.params.taskID;
  const projectID = req.params.projectID
  const timeSpent = req.body.timeSpent;
  const q = 'UPDATE appTasks SET timeSpent = ? WHERE taskID = ? AND projectID = ?';

  db.query(q, [timeSpent, taskID, projectID], (err, data) => {
    if (err) {
      console.error(err)
    } else {
      console.log("Time spent: ", timeSpent);
      console.log(q);
      return res.json({data})
    }
  })
})

//* ADD TO ARCHIVE *//
tasksRouter.put("/projects/:projectID/tasks/:taskID/archive", (req, res) => {
  const updatedTask: ITask = req.body;

  const updatedAssignedUsers = JSON.stringify(req.body.taskLabels);
  const updatedTaskLabels = JSON.stringify(req.body.taskLabels);
  const updatedCreatedBy = JSON.stringify(req.body.taskCreatedBy);

  const {comments, ...taskToArchive} = updatedTask;
  const taskToAdd: ITask = {...taskToArchive, 
    assignedUsers: updatedAssignedUsers, 
    taskLabels: updatedTaskLabels, 
    taskCreatedBy: updatedCreatedBy
  }

    const currentDateCreated = new Date(updatedTask.dateCreated!);
    const currentDeadline = new Date(updatedTask.deadline!);
    const currentDateFinished = new Date(updatedTask.dateFinished!);


    const formattedDateCreated = currentDateCreated.toISOString().slice(0, 19).replace("T", " ");
    const formattedDeadline = currentDeadline.toISOString().slice(0, 19).replace("T", " ");
    const formattedDateArchived = currentDateFinished.toISOString().slice(0, 19).replace("T", " ");

    taskToAdd.dateCreated = formattedDateCreated;
    taskToAdd.deadline = formattedDeadline;
    taskToAdd.dateFinished = formattedDateArchived;

    const projectID = req.params.projectID;
    const id = req.params.taskID;
    const q = `UPDATE appTasks SET ? WHERE taskID = ? AND projectID = ?`;

    db.query(q, [ taskToAdd, id, projectID ], (error, data) => {
    console.log("Inserting object: ", taskToAdd)
    if (error) {
      console.error(error);
      } else {
      return res.json({data})
    }
  })

})

// DELETE
tasksRouter.delete("/:userID/projects/:projectID/tasks/:taskID", (req, res) => {
    const projectID = req.params.projectID;
    const id = req.params.taskID;
    const q = `DELETE FROM appTasks WHERE taskID = ? AND projectID = ?`;

    db.query(q, [id, projectID], (err, data) => {
    if (err) {
      console.error(err);
    } else {
        return res.json({data: data});
    }
    })
})

