import React from 'react';
import { AppContext } from '../../../context/generalContext';
import { MySQLService } from '../../../services/MySQLService';


import { useAppDispatch } from '../../../redux/hooks';
import { useSelector } from 'react-redux';
import { selectIsAddProjectFormOpened } from '../../../redux/projects/selectors';
import { selectCustomers } from '../../../redux/customers/selectors';
import { selectUserID } from '../../../redux/users/selectors';
import { addProject, setIsAddNewProjectOpened } from '../../../redux/projects/slice';
import { IProject } from '../../../redux/projects/types';

import './add-project.scss'

export const AddProject = () => {

    const service = new MySQLService();
    const dispatch = useAppDispatch()
    const userID = useSelector(selectUserID);
    const isAddProjectOpened = useSelector(selectIsAddProjectFormOpened);
    const customers = useSelector(selectCustomers)
    const {popups} = React.useContext(AppContext)


    const [userProject, setUserProject] = React.useState<IProject>({
        userID: userID!,
        projectID: null,
        projectName: "",
        dateCreated: new Date(),
        customer: null,
    })

    const addNewProject = async (project: IProject) => {
        try {
            const date = new Date();
            const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
            const updatedProject = {
            ...project,
            dateCreated: formattedDate,
            }
            const res = await service.addProject(updatedProject);
            if (res) {
                const fetchedProject = await service.getProjectByID(res.data.insertId);
                const projectToAdd = fetchedProject.data[0];
                dispatch(addProject(projectToAdd))
                dispatch(setIsAddNewProjectOpened(false))
                popups.setIsOverlay(false);
                setUserProject({
                    userID: userID!,
                    projectName: "",
                    dateCreated: null,
                    projectID: null,
                    customer: null,
                })
            }
        } catch(e: any) {
            throw new Error(e);
        }
    }

    const setProjectName = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        setUserProject({
            ...userProject,
            projectName: target.value
        })
    }

    const closeForm = () => {
        dispatch(setIsAddNewProjectOpened(false));
        popups.setIsOverlay(false);
        setUserProject({
            userID: userID!,
            projectName: "",
            dateCreated: null,
            projectID: null,
            customer: null,
        })
    }

    const renderCustomersToSelect = () => {
        return customers.map((customer) => {
            return (
                <option value={customer.customerName}>{customer.customerName}</option>
            )
        })
    }

    const handleCustomer = (e: React.ChangeEvent) => {
        const target = e.target as HTMLOptionElement
        const customerToSet = customers.find((customer) => customer.customerName === target.value);
        setUserProject((prev) => ({
            ...prev,
            customer: customerToSet
        }))
    }

    return (
    <form action="" className={`add-project-form add-project ${isAddProjectOpened ? 'popup-Y-active' : 'add-project-form--hidden'}`}>
        <input  className="add-project__project-name" type="text" onChange={setProjectName} value={userProject.projectName} placeholder='Project name'/>
        <select onChange={handleCustomer}>
            <option>Select customer (optional)</option>
            {renderCustomersToSelect()}
        </select>
        <button className="button" type="button" onClick={() => addNewProject(userProject)}>Add project</button>
        <button className="button" type="button" onClick={() => closeForm()}>Cancel</button>
    </form>
    )
}