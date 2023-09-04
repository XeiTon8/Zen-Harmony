import React from "react";
import { useNavigate } from "react-router-dom";
import { MySQLService } from "../../services/MySQLService";

// Redux
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { selectSelectedProjectID, selectProjects, selectSearchProjectValue } from "../../redux/projects/selectors";
import { selectUserID } from "../../redux/users/selectors";
import { selectUser } from "../../redux/users/selectors";
import { selectSelectedTaskID, selectTaskDeleted, selectTasks } from "../../redux/tasks/selectors";

import { fetchProjects, setSelectedProjectID } from "../../redux/projects/slice";
import { fetchAllTaks, fetchArchivedTasks, fetchLabels, setSelectedTaskID } from "../../redux/tasks/slice";

// Components
import { AddProject } from "../popups/addProject";
import { Overlay } from "../overlay";

import "./dashboard.scss";

export const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const searchProjectValue = useSelector(selectSearchProjectValue);
  const userId = useSelector(selectUserID);
  const projects = useSelector(selectProjects);
  const tasks = useSelector(selectTasks);
  const isTaskDeleted = useSelector(selectTaskDeleted);

  const openProject = (userID: string, projectID: number) => {
    try {
      dispatch(setSelectedProjectID(projectID));
      navigate(`/${userID}/projects/${projectID}/tasks`);
    } catch (e: any) {
      throw new Error(e);
    }
  };

  const openProjectTask = (taskID: number, projectID: number) => {
    dispatch(setSelectedTaskID(taskID));
    navigate(`/projects/${projectID}/tasks/${taskID}`);
  };

  const renderProjects = () => {
    const filteredProjects = projects.filter((project) => project.projectName.toLowerCase().includes(searchProjectValue.toLowerCase()));
    const lastFourProjects = filteredProjects.sort((a, b) => new Date(b.dateCreated!).getTime()! - new Date(a.dateCreated!).getTime()).slice(0, 4);
    
    return lastFourProjects.map((project) => (
      <div className="project-item" key={project.projectID}>
          <h3 className="project-item__project-name" onClick={() => openProject(userId!, project.projectID!)}>
            {project.projectName}
          </h3>
          <span>Tasks</span>
          {tasks.allTasks.length > 0 ?  
          <div className="project-item__last-tasks">
            {tasks.allTasks.filter((task) => task.projectID === project.projectID).reverse().slice(0, 5).map((task) => {
              return (
                <div key={task.taskID}>
                  <span onClick={() => openProjectTask(task.taskID!, project.projectID!)}>{task.taskTitle}</span>
                  <span>Date created: {new Date(task.dateCreated!).toString().substring(0, 10)}</span>
                  <span>Deadline: {new Date(task.deadline!).toString().substring(0, 10)}</span>
                </div>
              )
            })
            }
          </div> : <span>No new tasks.</span>
          }
      </div>
    ));
  };

  return (
    <>
      {userId ? (
        <div className="dashboard__container">
          <div className={`action-popup ${isTaskDeleted ? "task-popup--active" : "task-popup--hidden"}`}>❎ Task deleted</div>
          <Overlay />
          <AddProject />
          <div className="projects__wrapper">
            <div className="projects__content">
              {projects.length > 0 ? (renderProjects()) : (<div className="no-data">No projects found.</div>)}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};
