import React from 'react'

// Redux
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/hooks';
import { selectProjects, selectSelectedProjectID, selectProjectByID } from '../../redux/projects/selectors';
import { setSelectedProjectID } from '../../redux/projects/slice';
import { IProject } from '../../redux/projects/types';

// Components
import { ProjectCard } from './projectCard';
import { AddProject } from '../../components/popups/addProject';
import { Overlay } from '../../components/overlay';

import './projects.scss'

export const Projects = () => {
    const dispatch = useAppDispatch();
    const projects = useSelector(selectProjects);
    const selectedProjectID = useSelector(selectSelectedProjectID);
    const selectedProject = useSelector(selectProjectByID(selectedProjectID!));
    const [isProjectCard, setIsProjectCard] = React.useState(false);
    const [isEditable, setIsEditable] = React.useState(false);
    const [updatedProject, setUpdatedProject] = React.useState<IProject>({
        projectID: selectedProject?.projectID!,
        projectName: selectedProject?.projectName!,
        dateCreated: selectedProject?.dateCreated!,
        customer: selectedProject?.customer,
        userID: selectedProject?.userID!
    })

    const renderProjects = () => {
        return projects.map((project) => {
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const newDate = new Date(project.dateCreated!);
            return (
                <tr className="projects__table-row">
                    <td className="projects__table-cell project-name-cell" onClick={() => openProjectCard(project.projectID!)}><span>{project.projectName}</span></td>
                    <td className="projects__table-cell">{newDate.toLocaleString('en-US', {timeZone: userTimeZone})}</td>
                    <td className="projects__table-cell">{project.customer ?  project.customer?.customerName : "No data"}</td>
                </tr>
            )
        })
    }

    const openProjectCard = (id: number) => {
        dispatch(setSelectedProjectID(id));
        setIsProjectCard(true);
        setUpdatedProject({...selectedProject!});
    }

    React.useEffect(() => {
        setUpdatedProject({...selectedProject!})
    }, [selectedProject])

    return (
        <div className="projects__container">
            <table className="projects__projects-table">
            <thead>
                <th>Name</th>
                <th>Date created</th>
                <th>Customer</th>
            </thead>
            <tbody>
                {renderProjects()}
            </tbody>
            </table>
            {projects.length <= 0 ? <div className="no-data">No projects found.</div> : null}
            <ProjectCard
            isEditable={isEditable}
            setIsEditable={setIsEditable}
            isProjectCard={isProjectCard}
            setIsProjectCard={setIsProjectCard}
            updatedProject={updatedProject}
            setUpdatedProject={setUpdatedProject}
            projectName={selectedProject?.projectName!}
            projectID={selectedProject?.projectID!}
            dateCreated={selectedProject?.dateCreated!}
            userID={selectedProject?.userID!}
            customer={selectedProject?.customer}
            />
            <AddProject />
            <Overlay />
        </div>
    )
}