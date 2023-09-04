import * as express from 'express';
import {db} from '../server'
import { RowDataPacket } from 'mysql2';

export const calendarEventsRouter = express.Router();

calendarEventsRouter.post("/calendar/events", (req, res) => {
    const calendarEvent = req.body;
    calendarEvent.assignedUser = JSON.stringify(calendarEvent.assignedUser)
    const q = 'INSERT into calendarEvents SET ?'
    
    db.query(q, [calendarEvent], (err, data) => {
        if (err) {
            console.error(err)
        } else {
            return res.json({data})
        }
    })
})

calendarEventsRouter.get("/calendar/events/:eventID", (req, res) => {
    const eventID = req.params.eventID;
    const q = 'SELECT * FROM calendarEvents WHERE eventID = ?'

    db.query(q, [eventID], (err, data: RowDataPacket[]) => {
        if (err) {
            console.error(err)
        } else {
            return res.json({data})
        }
    })
})

calendarEventsRouter.get("/calendar/events", (_req, res) => {
    const q = 'SELECT * FROM calendarEvents';

    db.query(q, (err, data) => {
        if (err) {
        console.error(err)
        } else {
        return res.json({data})
        }
    })
})

calendarEventsRouter.put("/calendar/events/:eventID", (req, res) => {
    const eventID = req.params.eventID;
    const updatedEvent = req.body;

    //* CONVERT OBJECTS TO JSON STRINGS *//
    const assignedUser = JSON.stringify(req.body.assignedUser);
    const allowedDepartments = JSON.stringify(req.body.allowedDepartments);
    const allowedRoles = JSON.stringify(req.body.allowedRoles);

    //* CONVERT DATES FOR MYSQL *//
    const currentStartDate = new Date(req.body.startDate);
    const formattedStartDate = currentStartDate.toISOString().slice(0, 19).replace("T",  " ");
    const currentEndDate = new Date(req.body.endDate);
    const formattedEndDatee = currentEndDate.toISOString().slice(0, 19).replace("T", " ")

    const eventToUpdate = {...updatedEvent, assignedUser, allowedDepartments, allowedRoles}
    eventToUpdate.startDate = formattedStartDate;
    eventToUpdate.endDate = formattedEndDatee;

    const q = 'UPDATE calendarevents SET ? WHERE eventID = ?';

    db.query(q, [eventToUpdate, eventID], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({data});
        }
    })
})

calendarEventsRouter.delete("/calendar/events/:eventID", (req, res) => {
    const eventID = req.params.eventID;
    const q = 'DELETE FROM calendarevents WHERE eventID = ?';

    db.query(q, [eventID], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({data});
        }
    })
})