import * as express from 'express';
import {db} from '../server'

export const labelsRouter = express.Router();

labelsRouter.get("/labels", (_req, res) => {
const q = 'SELECT * from labels';

db.query(q, (err, data) => {
    if (err) {
        console.error(err)
    } else {
        return res.json({data})
    }
})
})

labelsRouter.post("/labels", (req, res) => {
    const label = req.body;
    const q = 'INSERT INTO labels SET ?';

    db.query(q, [label], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({data})
        }
    })

    
})

labelsRouter.get("/labels/:labelID", (req, res) => {
    const id = req.params.labelID;
    const q = 'SELECT * FROM labels WHERE labelID = ?';

    db.query(q, [id], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Labels: ", data)
            return res.json({data})
        }
    })
})

labelsRouter.put("/labels/:labelID", (req, res) => {
    const id = req.params.labelID;
    const label = req.body;
    const q = 'UPDATE labels SET ? WHERE labelID = ?';

    db.query(q, [label, id], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({data})
        }
    })
})

labelsRouter.delete("/labels/:labelID", (req, res) => {
    const id = req.params.labelID;
    const q = 'DELETE FROM labels WHERE labelID = ?';

    db.query(q, [id], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({data})
        }
    })
})