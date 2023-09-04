import * as express from 'express';
import {db} from '../server'
import { RowDataPacket } from 'mysql2';

export const departmentsRouter = express.Router();

departmentsRouter.post("/departments", (req, res) => {
    const department = req.body;
    const q = 'INSERT into departments SET ?' 

    db.query(q, [department], (err, data) => {
    if (err) {
        console.error(err);
    } else {
        return res.json({data})
    }})
})


departmentsRouter.get("/departments", (_req, res) => {
    const q = 'SELECT * FROM departments'

    db.query(q, (err, data) => {
        if (err) {
            console.error(err)
        } else {
            return res.json({data})
        }
    })
})

departmentsRouter.get("/departments/:departmentID", (req, res) => {
    const departmentID = req.params.departmentID;
    const q = 'SELECT * FROM departments WHERE departmentID = ?';
    
    db.query(q, [departmentID], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({data})
        }
    })
})

departmentsRouter.put("/departments/:departmentID", (req, res) => {
    const departmentID = req.params.departmentID
    const department = req.body;
    const q = `UPDATE departments SET ? WHERE departmentID = ?`;

    db.query(q, [department, departmentID], (err, data) => {
        if (err) {
            console.error(err)
        } else {
            return res.json({data})
        }
    })
})

departmentsRouter.delete("/departments/:departmentID", (req, res) => {
    const departmentID = req.params.departmentID;
    const q = 'DELETE FROM departments WHERE departmentID = ?';

    db.query(q, [departmentID], (err, data) => {
        if (err) {
            console.error(err)
        } else {
            return res.json({data})
        }
    })
})