import * as express from 'express';
import {db} from '../server'
import { INotification } from '../types/notification';

export const notificationsRouter = express.Router();

notificationsRouter.post("/notifications", (req, res) => {
    const notification: INotification = req.body;
    const formattedDateStart = new Date(notification.notificationCreateDate!).toISOString().slice(0, 19).replace("T", " ");
    const formattedDateEnd = new Date(notification.notificationExpireDate!).toISOString().slice(0, 19).replace("T", " ");
    notification.notificationCreateDate = formattedDateStart;
    notification.notificationExpireDate = formattedDateEnd;
    const q = 'INSERT INTO notifications SET ?';

    db.query(q, [notification], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({data})
        }
    })
})

notificationsRouter.get("/notifications", (_req, res) => {
    const q = 'SELECT * FROM notifications';

    db.query(q, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({data});
        }
    })
})

notificationsRouter.get("/notifications/:notificationID", (req, res) => {
    const notificationID = req.params.notificationID;
    const q = 'SELECT * FROM notifications WHERE notificationID = ?';

    db.query(q, [notificationID], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({data});
        }
    })
})

notificationsRouter.delete("/notifications/:notificationID", (req, res) => {
    const notificationID = req.params.notificationID;
    const q = 'DELETE FROM notifications WHERE notificationID = ?';

    db.query(q, [notificationID], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({data})
        }
    })
})