import * as express from 'express';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer'
import { RowDataPacket } from 'mysql2';
import {db} from '../server'
import { IUser } from '../types/user';


export const usersRouter = express.Router();

//* Create a user *//
usersRouter.post("/users", (req, res) => {
    const q = "INSERT into users SET ?";
    const user: IUser = req.body;

    const updatedTasks = JSON.stringify(user.subscribedTasks);
    user.subscribedTasks = updatedTasks;
    const updatedUsers = JSON.stringify(user.users);
    user.users = updatedUsers;

    db.query(q, [user], (err, data) => {
      console.log("User: ", user);
        if (err) {
            console.error(err);
        } else {
            return res.json({data})
        }
    })
})


//* Update a user *//
usersRouter.put("/users/:userID", (req, res) => {
  const id = req.params.userID;
  const userToUpdate: IUser = req.body;

  const updatedUsers = JSON.stringify(userToUpdate.users);
  const updatedSubscribedTasks = JSON.stringify(userToUpdate.subscribedTasks);
  const updatedBoss = JSON.stringify(userToUpdate.boss);

  userToUpdate.boss = updatedBoss;
  userToUpdate.users = updatedUsers;
  userToUpdate.subscribedTasks = updatedSubscribedTasks;

  const q = 'UPDATE users SET ? WHERE userID = ?';

  db.query(q, [userToUpdate, id ], (err, data) => {
    if (err) {
      console.error(err);
    } else {
      return res.json({data})
    }
  })
})

//* Subscribe a user to task *//
usersRouter.put("/users/:userID/subscribeToTask", (req, res) => {
  const id = req.params.userID;
  const tasks = req.body.subscribedTasks;
  const updatedTasks = JSON.stringify(req.body.subscribedTasks);
  tasks.subscribedTasks = updatedTasks;
  const q = 'UPDATE users SET subscribedTasks = ? WHERE userID = ?';
  console.log("Updated Tasks: ", tasks); // Debugging line

  db.query(q, [tasks.subscribedTasks, id ], (err, data) => {
    console.log("Tasks: ", updatedTasks);
    if (err) {
      console.error(err);
    } else {
      return res.json({data})
    }
  })
})


//* Delete a user *//

usersRouter.delete("/users/:userID", (req, res) => {
  const userID = req.params.userID;
  const q = 'DELETE FROM users WHERE userID = ?';

  db.query(q, [userID], (err, data) => {
    if (err) {
      console.error(err);
    } else {
      return res.json({data})
    }
  })
})

//*  Get all users*//

usersRouter.get("/users", (_req, res) => {
  const q = 'SELECT * from users';

  db.query(q, (err, data) => {
    if (err) {
      console.error(err);
    } else {
        return res.json({data})
    }
  })
})

usersRouter.get("/users/:userID", (req, res) => {
    const id = req.params.userID;
    const q = `
    SELECT * FROM users
    WHERE users.userID = ?
  `
    db.query(q, [id], (err, data: RowDataPacket[]) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({data});
        }
    })
})

//* Add emplpoyee */

usersRouter.post("/users/sendEmail", (req, res) => {
    const email = req.body.email;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port:465,
        secure: true,
        logger: true,
        debug: true,
        auth: {
          user: 'allesandrodorji@gmail.com',
          pass: 'eizccauzerczpzpw'
        }
      });
      const mailOptions = {
        from: 'allesandrodorji@gmail.com',
        to: `${email}`,
        subject: 'Test',
        text: `Follow to sign-up: http://localhost:3000/#/auth/employee`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          res.status(200);
          console.log('Email sent: ' + info.response);
        }
      });

})

//* Create employee - step one *//

usersRouter.post("/users/createUser", (req, res) => {
  const {userEmail, department, position} = req.body;
  const q = "INSERT into users(userEmail, department, position) VALUES(?, ?, ?)"

  db.query(q, [userEmail, department, position], (err, data) => {
    if (err) {
      console.error(err);
    } else {
      return res.json({data})
    }
  })
})


usersRouter.put("/users/auth/finishCreating", (req, res) => {
  const { userName, userEmail, userRole, userID, users }: IUser = req.body;
  const obj: IUser = {userName, userRole, userID, users, userEmail};
  const userUsers = JSON.stringify(req.body.users);
  obj.users = userUsers;
  let q = `UPDATE users SET userName = ?, userRole = ?, userID = ?, users = ? WHERE userEmail = ?`;

  db.query(q, [userName, userRole, userID, users, userEmail], (err, data) => {
    if (err) {
      console.error(err)
    } else {
    
      return res.json({data});
    }
  })
})

//* VERIFY FIREBASE TOKEN *//
usersRouter.post("/users/verify", async (req, res) => {
  const {token} = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    res.status(200).json({uid});
  } catch(e: any) {
    throw new Error(e);
  }
})