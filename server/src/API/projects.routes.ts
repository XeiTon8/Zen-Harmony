import * as express from 'express';
import {db} from '../server'

export const projectsRouter = express.Router();

projectsRouter.post('/projects', (req, res) => {
const {projectName, dateCreated, customer} = req.body;
const q = 'INSERT INTO projects SET ? ';

const newCustomer = JSON.stringify(customer);
const projectToAdd = {projectName, dateCreated, customer}
projectToAdd.customer = newCustomer;

db.query(q, [projectToAdd], (err, data) => {
  if (err) {
    console.error(err);
  }  else {
    return res.json({data})
  }
})
})

projectsRouter.get('/projects', (req, res) => {
  const q = 'SELECT * FROM projects'

  db.query(q, (err, data) => {
    if (err) {
      console.error(err);
    } else {
        return res.json({data})
    }
})
})

projectsRouter.get('/projects/:projectID', (req, res) => {
  const projectID = req.params.projectID;
  const q = 'SELECT * FROM projects WHERE projectID = ?'

  db.query(q, [projectID], (err, data) => {
    if (err) {
        console.error(err);
    } else {
        return res.json({data})
    }
})
})

projectsRouter.put('/projects/:projectID', (req, res) => {
  const projectID = req.params.projectID;
  const updatedProject = req.body;

  const newDateCreated = new Date(updatedProject.dateCreated);
  const formattedDate = newDateCreated.toISOString().slice(0, 19).replace('T', ' ');
  updatedProject.dateCreated = formattedDate;
  
  const customerString = JSON.stringify(updatedProject.customer);
  updatedProject.customer = customerString;
  
  const q = 'UPDATE projects SET ? WHERE projectID = ?';

  db.query(q, [updatedProject, projectID], (err, data) => {
    if (err) {
    console.error(err);
    } else {
      return res.json({data})
    }
  })
})

projectsRouter.delete('/projects/:projectID', (req, res) => {
  const projectID = req.params.projectID;
  const q = 'DELETE FROM projects WHERE projectID = ?';

  db.query(q, [projectID], (err, data) => {
    if (err) {
      console.error(err);
    } else {
      return res.json({data})
    }
  })
})