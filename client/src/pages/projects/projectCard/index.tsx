import React from 'react'
import { MySQLService } from '../../../services/MySQLService';

import { useAppDispatch } from '../../../redux/hooks';
import { useSelector } from 'react-redux';
import { selectCustomers } from '../../../redux/customers/selectors';
import { selectUserID } from '../../../redux/users/selectors';
import { updateUserProject,  deleteUserProject } from '../../../redux/projects/slice';

import { IProject } from '../../../redux/projects/types';

import './projectCard.scss'


interface projectCardProps extends IProject {
    isEditable: boolean;
    setIsEditable: (val: boolean) => void;
    isProjectCard: boolean;
    setIsProjectCard: (val: boolean) => void;
    updatedProject: IProject;
    setUpdatedProject: (val: any) => void;
}

export const ProjectCard: React.FC<projectCardProps> = ({projectName, projectID, dateCreated, customer, isEditable, setIsEditable, updatedProject, setUpdatedProject, isProjectCard, setIsProjectCard}) => {
    const dispatch = useAppDispatch();
    const service = new MySQLService();
    const customers = useSelector(selectCustomers);
    
    const deleteProject = async (projectID: number) => {
        try {
            await service.deleteProject(projectID);
            dispatch(deleteUserProject(projectID));
            setIsProjectCard(false);
        } catch(e) {
            console.error(e)
        }
    }

    const renderProjectCustomer = () => {
        return (
            <option>{customer?.customerName}</option>
        )
    }

    const closeCard = () => {
        setIsProjectCard(false);
        setIsEditable(false);
    }

    const openEditCard = (e: React.FormEvent) => {
        e.stopPropagation();
        setIsEditable(true);
    }

    const handleUpdate = (e: React.ChangeEvent) => {
        const {name, value} = (e.target) as HTMLInputElement;
        setUpdatedProject((prev: IProject) => ({
            ...prev,
            [name]: value
        }))
    }

    const updateProject =  async (e: React.FormEvent, projectID: number, project: IProject,) => {
        e.preventDefault();
        await service.updateProject(projectID, project);
        const fetchedProject = await service.getProjectByID(projectID);
        const projectToUpdate = fetchedProject.data[0]
        dispatch(updateUserProject(projectToUpdate));
        closeCard();
    }

    const handleProjectCustomer = (e: React.ChangeEvent) => {
        const target = e.target as HTMLOptionElement;
        const customerToSet = customers.find((customer) => customer.customerName === target.value);
        setUpdatedProject((prev: IProject) => ({
            ...prev,
            customer: customerToSet
        }))
    }
    
    const renderProjectCard = () => {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const newDateCreated = new Date(dateCreated!).toLocaleString('en-US', {timeZone: userTimeZone})
        return (
            <>
            {isEditable ? (
                <div>
                    <form className={`project-card ${isProjectCard ? 'project-card--active' : 'project-card--hidden'}`} onSubmit={(e: React.FormEvent) => updateProject(e, projectID!, updatedProject)}>
                        <label htmlFor="">Project name</label>
                        <input value={updatedProject.projectName} type="text" name="projectName" id="" onChange={handleUpdate} /> 
                        <label htmlFor="">Date created</label>
                        <input value={newDateCreated} type="text"  readOnly />
                        <select name="" id="" onChange={handleProjectCustomer}>
                            <option>Select assigned customer</option>
                            {customer ? renderProjectCustomer() : "No assigned customer"}
                        </select>
                        <button type="button" className="button" onClick={() => closeCard()}>Cancel</button>
                        <button type="submit" className="button">Confirm</button>
                    </form>
                </div>) : (
                <div>
                    <form className={`project-card ${isProjectCard ? 'project-card--active' : 'project-card--hidden'}`}>
                        <label htmlFor="">Project name</label>
                        <input value={projectName} type="text" name="" id="" readOnly /> 
                        <label htmlFor="">Date created</label>
                        <input value={newDateCreated} type="text" readOnly />
                        <label htmlFor='project-card__customer'>Assigned customer</label>
                        <input type="text" value={ customer ? customer?.customerName : "No data"} name="" id="project-card__customer" />
                        <button className="button" type="button" onClick={(e: React.FormEvent) => openEditCard(e)}>Edit</button>
                        <button className="button" type="button" onClick={() => deleteProject(projectID!)}>Delete</button>
                        <button className="button" type="button" onClick={() => closeCard()}>Close</button>
                    </form>
                </div>
            )}
            </>
        )
    }
return (
    <>
    {renderProjectCard()}
    </>
)
}