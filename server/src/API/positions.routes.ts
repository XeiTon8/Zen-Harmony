import * as express from 'express';
import {db} from '../server'

export const positionsRouter = express.Router();

positionsRouter.post('/positions', (req, res) => {
    const position = req.body;
    const q = 'INSERT INTO positions set ?';

    db.query(q, [position], (err, data) => {
        if (err) {
            console.error(err)
        } else {
            return res.json({data})
        }
    })
})

positionsRouter.get("/positions", (_req, res) => {
    const q = 'SELECT * from positions';
    db.query(q, (err, data) => {
        if (err) {
            console.error(err)
        } else {
            return res.json({data})
        }
    })
})

positionsRouter.get("/positions/:positionID", (req, res) => {
    const id = req.params.positionID;
    const q = 'SELECT * FROM positions WHERE positionID = ?'
    db.query(q, [id], (err, data) => {
        if (err) {
            console.error(err)
        } else {
            return res.json({data})
        }
    })

})

positionsRouter.put("/positions/:positionID", (req, res) => {
    const position = req.body;
    const id = req.params.positionID;
    const q = 'UPDATE positions SET ? WHERE positionID = ?';

    db.query(q, [position, id], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({data});
        }
    })
})

positionsRouter.delete("/positions/:positionID", (req, res) => {
    const id = req.params.positionID;
    const q = 'DELETE FROM positions WHERE positionID = ?';

    db.query(q, [id], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({data})
        }
    })
})