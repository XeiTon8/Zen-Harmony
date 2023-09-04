import React from "react";
import { useSelector } from "react-redux";
import { selectProjects } from "../../redux/projects/selectors";
import { selectArchivedTasks } from "../../redux/tasks/selectors";
import "./reports.scss";

export const Reports = () => {
  const projects = useSelector(selectProjects);
  const lastProject = projects[projects.length - 1];
  const tasks = useSelector(selectArchivedTasks);
  const [currentProjectID, setCurrentProjectID] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (lastProject) {
      setCurrentProjectID(lastProject.projectID);
    }
  }, []);

  const renderFilteredTasksForProject = () => {
    const tasksToFilter = [...tasks];
    return tasksToFilter.filter((task) => task.projectID === currentProjectID).map((task) => {
        return (
          <tr className="reports__reports-row">
            <td className="reports__table-cell">{task.taskTitle}</td>
            <td className="reports__table-cell">
              {task.timeSpent ? task.timeSpent?.toString() : "No data"}
            </td>
            <td className="reports__table-cell">{task.costs}</td>
            <td className="reports__table-cell">
              {task.taskCreatedBy?.userName}
            </td>
            <td className="reports__table-cell">
              {task.dateFinished?.toString().substring(0, 10)}
            </td>
          </tr>
        );
      });
  };

  const filterByProjects = (e: React.ChangeEvent) => {
    const target = e.target as HTMLSelectElement;
    if (target.value === "Select project") {
      return;
    } else {
      const value = +target.value;
      const selectedProject = projects.find(
        (project) => project.projectID === value
      );
      const projectID = selectedProject!.projectID;
      setCurrentProjectID(projectID);
    }
  };

  const renderProjectsToSelect = () => {
    return projects.map((project) => {
      return (
        <option key={project.projectID} value={project.projectID!}>
          {project.projectName}
        </option>
      );
    });
  };

  const renderTotalSum = () => {
    const total = tasks.reduce((total, task) => total + task.costs!, 0);
    return total;
  };

  return (
    <div className="reports__container">
      <div className="reports__filters">
        <select onChange={filterByProjects}>
          <option>Select project</option>
          {renderProjectsToSelect()}
        </select>
      </div>
      <span className="reports__total-costs">
        Total costs: {renderTotalSum()} $
      </span>
      <div className="reports__table-wrapper">
        <table className="reports__reports-table">
          <thead>
            <th>Task</th>
            <th>Time spent</th>
            <th>Costs ($)</th>
            <th>Created by</th>
            <th>Date finished</th>
          </thead>
          <tbody>{renderFilteredTasksForProject()}</tbody>
        </table>
        {tasks.length <= 0 ? (
          <div className="no-data">No reports found.</div>
        ) : null}
      </div>
    </div>
  );
};
