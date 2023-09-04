import React from 'react';
import { AppContext } from '../../../context/generalContext';
import { MySQLService } from '../../../services/MySQLService';

import { useAppDispatch } from '../../../redux/hooks';
import { useSelector } from 'react-redux';
import { selectSelectedProjectID } from '../../../redux/projects/selectors';
import { selectUser, selectUserID, selectUsers } from '../../../redux/users/selectors';
import { selectUserTask, selectLabels, selectAddTaskOpened } from '../../../redux/tasks/selectors';
import { setTaskSaved, addTask, setUserTask, setAddTaskOpened, setLabelToTask, deleteLabel, setUserToTask, clearTask} from '../../../redux/tasks/slice';
import { ITask } from '../../../redux/tasks/types';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './addTask.scss'

export const AddTaskForm = () => {

    const dispatch = useAppDispatch();
    const service = new MySQLService();
    const {popups} = React.useContext(AppContext)

    const userTask = useSelector(selectUserTask);
    const projectID = useSelector(selectSelectedProjectID);
    const userID = useSelector(selectUserID);
    const user = useSelector(selectUser)
    const users = useSelector(selectUsers)
    const labels = useSelector(selectLabels)
    const isAddNewOpened = useSelector(selectAddTaskOpened)
    
    const addNewTask = async (task: ITask) => {
        try {
          const date = new Date();
          const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

          const taskDeadline = new Date(task.deadline!);

          const updatedTask: ITask = {
            ...task,
            dateCreated: formattedDate,
            deadline: taskDeadline.toISOString().slice(0, 19).replace("T", " "),
            projectID: projectID,
            taskLabels: task.taskLabels,
            assignedUsers: task.assignedUsers,
            taskCreatedBy: user
          }
          const res = await service.addTask(userID!, projectID!, updatedTask);
          const fetchedTask = await service.getTaskByID(userID!, projectID!, res.data.insertId);
          const taskToAdd: ITask = fetchedTask.data;

          const localDateCreated = new Date(taskToAdd.dateCreated!);
          const localDeadline = new Date(taskToAdd.deadline!);
          
          const taskToAddWithLocalDate = {
            ...taskToAdd,
            dateCreated: localDateCreated.toLocaleString(`en-US`, {timeZone: userTimeZone}),
            deadline: localDeadline.toLocaleString('en-US', { timeZone: userTimeZone }),
          }

          dispatch(addTask(taskToAddWithLocalDate));

          dispatch(setAddTaskOpened(false));
          popups.setIsOverlay(false);
          dispatch(setTaskSaved(true));
          dispatch(clearTask())
          setTimeout(() => {
            dispatch(setTaskSaved(false));
          }, 3000)
            
        } catch(e: any) {
            throw new Error(e);
        }}
    
  const handleTask = (e: React.ChangeEvent) => {
        const {name, value} = e.target as HTMLInputElement;   
        dispatch(setUserTask({ name, value }));
        console.log(userTask);
      }

  const handleDate = (date: Date) => {
      dispatch(setUserTask({ name: 'deadline',  dateValue: date ? date.toString() : null }));
    }

  const setUserLabel = (e: React.ChangeEvent) => {
      const target = e.target as HTMLSelectElement;
      const selectedLabel = labels.find((label) => label.labelName === target.value)
      dispatch(setLabelToTask(selectedLabel!))
    }

  const assignUserToTask = (e: React.ChangeEvent) => {
      const target = e.target as HTMLSelectElement;
      const selectedUser = users?.find((user) => user.userName === target.value);
      dispatch(setUserToTask(selectedUser!))
    }

  const mapLabels = () => {
      return labels.map((label) => {
        return (
            <option value={label.labelName} key={label.labelID}>{label.labelName}</option>
        )
      })
    }

  const mapLabelsValues = () => {
      return userTask.taskLabels.map((label) => {
        return (
          <>
          <span>{label.labelName}</span>
          <button type="button" onClick={() => dispatch(deleteLabel(label.labelID!))}>Delete label</button>
          </>
        )
      })
    }

  const mapUsers = () => {
      return users?.map((user) => {
        return (
          <option key={user.userID} value={user.userName}>{user.userName}</option>
        )
      })
    }

  const closeAddTaskForm = () => {
      dispatch(setAddTaskOpened(false));
      popups.setIsOverlay(false);
    }

    return (
        <form className={`add-task__form ${isAddNewOpened ? "popup-Y-active" : "add-task__form--hidden"}`}>
          <label htmlFor='taskName'>Name</label>
            <input type="text" id='taskName' value={userTask.taskTitle || ''} onChange={handleTask} name="taskTitle" />
          <label htmlFor='taskDescription'>Description</label>
            <input type="text" id ="taskDescription" value={userTask.taskDescription || ''} onChange={handleTask} name="taskDescription" />
          <label htmlFor="taskLabel">Labels</label>
            {mapLabelsValues()}
          <select onChange={setUserLabel}>  
            <option>Select a label</option>
          {mapLabels()} 
          </select>
          <select  onChange={assignUserToTask}>
            <option>Assign a user</option>
            {mapUsers()}
          </select>
          <label>Deadline</label>
            <DatePicker
            selected={userTask.deadline ? new Date(userTask.deadline) : null}
            onChange={handleDate}
            dateFormat="MM/dd/yyyy"
            name='deadline'
            />
          <button className="button" type="button" onClick={() => addNewTask(userTask)}>Add task</button>
          <button className="button" type="button" onClick={() => closeAddTaskForm()}>Cancel</button>
      </form>
    )
}