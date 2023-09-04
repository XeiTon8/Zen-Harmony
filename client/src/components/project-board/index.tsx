import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../../firebase.config';
import {onAuthStateChanged} from 'firebase/auth';

// Components
import { TaskCard } from '../tasks/taskCard';
import {AddTaskForm} from '../../components/popups/addTask';
import { Overlay } from '../overlay';

// Redux
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/hooks';
import { selectTasks, selectSearchValue, selectTaskSaved, selectFilteredTasks, selectIsFiltering, selectLabels} from '../../redux/tasks/selectors';
import { selectProjects } from '../../redux/projects/selectors';
import {  filterTasksByStatus, setIsFiltering, setSelectedTaskID, setIsDetailedTaskOpened, filterTasksByLabels, filterTasksByDate} from '../../redux/tasks/slice';
import { setSelectedProjectID } from '../../redux/projects/slice';
import { taskStatus } from '../../redux/tasks/types';

import './project-board.scss'

export const ProjectBoard = () => {

    const [loading, setLoading] = React.useState(true);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {projectID} = useParams();
    const projectIdToSet = parseInt(projectID!, 10);

    const {allTasks} = useSelector(selectTasks)
    const filteredTasks = useSelector(selectFilteredTasks);
    const isFiltering = useSelector(selectIsFiltering);
    const searchValue = useSelector(selectSearchValue)
    const labels = useSelector(selectLabels);
    const projects = useSelector(selectProjects);
    const isTaskSaved = useSelector(selectTaskSaved);

    const currentProject = projects.find((project) => project.projectID === Number(projectID))

  React.useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (loading) {
          dispatch(setSelectedProjectID(projectIdToSet))
          setLoading(false);
        }
      }
    })
      }, [loading])

      const mapTasks = () => {

        if (isFiltering) {
                return filteredTasks.filter((task) => task.taskTitle.toLowerCase().includes(searchValue.toLowerCase())).map((task, index) => {
                    return (
                        <TaskCard 
                        openCard={() => openDetailedCard(task.taskID!)}
                        taskID={task.taskID}
                        taskLabels={task.taskLabels}
                        taskTitle={task.taskTitle}
                        taskDescription={task.taskDescription}
                        dateCreated={task.dateCreated}
                        status={task.status}
                        position={task.position}
                        deadline={task.deadline}
                        isArchived={task.isArchived}
                        projectID={task.projectID}
                        assignedUsers={task.assignedUsers}
                        costs={task.costs}
                        taskCreatedBy={task.taskCreatedBy}
                        key={index}
                        />  
                )
          })} else {
                return allTasks.filter((task) => task.taskTitle.toLowerCase().includes(searchValue.toLowerCase()) && task.projectID === Number(projectID)).map((task, index) => {
                  return (
                    <TaskCard 
                    openCard={() => openDetailedCard(task.taskID!)}
                    taskID={task.taskID}
                    taskLabels={task.taskLabels}
                    taskTitle={task.taskTitle}
                    taskDescription={task.taskDescription}
                    dateCreated={task.dateCreated}
                    status={task.status}
                    position={task.position}
                    deadline={task.deadline}
                    isArchived={task.isArchived}
                    projectID={task.projectID}
                    assignedUsers={task.assignedUsers}
                    costs={task.costs}
                    taskCreatedBy={task.taskCreatedBy}
                    key={index}
                    />  
              )
            })} 
        }
      
      const mapLabels = () => {
        return labels.map((label) => {
          return (
            <option key={label.labelID} value={label.labelName}>{label.labelName}</option>
          )
        })
      }

      const handleSelectChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLSelectElement;
        if (target.value === 'All tasks') {
          dispatch(setIsFiltering(false));
          return true;
        } else {
          dispatch(setIsFiltering(true))
          dispatch(filterTasksByStatus(target.value as taskStatus))
        }
      }

      const openDetailedCard = (id: number) => {
        console.log(id);
        dispatch(setSelectedTaskID(id));
        dispatch(setIsDetailedTaskOpened(true));
        navigate(`/projects/${projectID}/tasks/${id}`)
      }

      const filterUserTasksByLabels = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {selectedIndex, options} = e.currentTarget;
        const selectedOption = options[selectedIndex];
        const value = selectedOption.value;
        const optGroupLabel = selectedOption.closest('optgroup')?.label;

        switch(optGroupLabel) {
          case 'Labels': {
            const labelToFilter = labels.find((label) => label.labelName === value)
            dispatch(filterTasksByLabels(labelToFilter?.labelID!))
          }

          case 'Date': {
            dispatch(filterTasksByDate(value))
          }

          case 'Tomorrow': {
            dispatch(filterTasksByDate(value))
          }
        }
      dispatch(setIsFiltering(true));

      }
    
      return (
  <>
  {loading ? 
  <p>Loading...</p>
  :
  <>
  
  <div className='tasks__container'>
  <div className={`action-popup ${isTaskSaved ? "task-popup--active" : "task-popup--hidden"}`}>✅ Task added</div>
    <h2>{currentProject?.projectName}</h2>
    <div className="tasks__title-and-filtering">
      <h3>Tasks</h3>
      <div className="tasks__tasks-filters">
      <select onChange={handleSelectChange}>
        <option value="All tasks">All tasks</option>
        {(Object.keys(taskStatus) as Array<keyof typeof taskStatus>).map((statusKey) => (
          <option key={statusKey} value={taskStatus[statusKey]} >
            {taskStatus[statusKey]}
          </option>
      ))}
      </select>
      <select onChange={filterUserTasksByLabels}>
        <option>Filter by</option>
          <optgroup label='Labels'>
          <option>All labels</option>
          {mapLabels()}
          </optgroup>

          <optgroup label='Date'>
            <option>All tasks</option>
            <option value='Today'>Tasks for today</option>
            <option value="This week">Tasks for week</option>
            <option value='Tomorrow'>Tasks for tomorrow</option>
          </optgroup> 
        </select>

      </div>
    </div>
      <div className="tasks__wrapper">
      {mapTasks()}
      </div>
    <AddTaskForm />
    <Overlay />
  </div>
  </>}

  </>
)
}