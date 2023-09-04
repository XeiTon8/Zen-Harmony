import React from 'react';
import { Link } from 'react-router-dom';
import { MySQLService } from '../../../../services/MySQLService';
import { AppContext } from '../../../../context/generalContext';

import { useAppDispatch } from '../../../../redux/hooks';
import { useSelector } from 'react-redux';
import { selectDepartmentByID, selectDepartmentID, selectDepartments } from '../../../../redux/users/departments/selectors';
import { selectUser, selectUsers } from '../../../../redux/users/selectors';
import { deleteUserDepartment, setSelectedDepartmentID } from '../../../../redux/users/departments/slice';

import { AddDepartment } from '../../../../components/popups/addDepartment';
import { Overlay } from '../../../../components/overlay';
import { DepartmentCard } from './departmentCard';

import './departments.scss'



export const Departments = () => {

    const service = new MySQLService();
    const {popups} = React.useContext(AppContext)
    const dispatch = useAppDispatch();
    const departments = useSelector(selectDepartments)
    const currentUser = useSelector(selectUser);
    const users = useSelector(selectUsers);
    const selectedDepartmentID = useSelector(selectDepartmentID)
    const selectedDepartment = useSelector(selectDepartmentByID(selectedDepartmentID!))

    const callAddDepartment = () => {
        popups.setIsAddDepartment(true);
        popups.setIsOverlay(true);
    }

    const deleteDepartment = async (id: number) => {
        try {
        await service.deleteDepartment(id);
        dispatch(deleteUserDepartment(id));
        } catch (e: any) {
            throw new Error(e);
        }
    }

    const openEditDepartment = async (id: number) => {
        dispatch(setSelectedDepartmentID(id));
        popups.setIsDepartmentCard(true);
        
    }

    const renderDepartments = () => {
        return departments.map((department) => {
            const departmentUsers = users!?.filter(user => user.department === department.departmentName);
            return (
                <tr className="departments__department-row">
                <td className="departments__department-cell">{department.departmentName}</td>
                <td className="departments__department-cell">{department.departmentDescription ? department.departmentDescription : "No description."}</td>
                <td className="departments__department-cell">{departmentUsers.length}</td>
                {currentUser.userRole?.includes("Owner") || currentUser.userRole?.includes("Executive") ?  (
                    <td>
                    <div className="departments__btns">
                        <button className="button" onClick={() => openEditDepartment(department.departmentID!)}>Edit</button>
                        <button className='button' onClick={() => deleteDepartment(department.departmentID!)}>Delete</button>
                    </div>
                </td>
                ): null}
                
            </tr>
            )
        })
    }

    return (
        <div className="departments__container">
            <nav className="departments__menu-n-nav">
                <Link to="/team">Team</Link>
                <Link to="/positions">Positions</Link>
                {currentUser.userRole?.includes("Owner") || currentUser.userRole?.includes("Executive") ? 
                <button onClick={() => callAddDepartment()} className="button">Add new department</button> : null}
            </nav>
            <table className="departments__departments-table">
            <thead>
                <th>Department</th>
                <th>Description</th>
                <th>Total users</th>
                {currentUser.userRole?.includes("Owner") || currentUser.userRole?.includes("Executive") ?  <th>Actions</th> : null}
            </thead>
            <tbody>
            {renderDepartments()}
            </tbody>
        </table>
        {departments!?.length <= 0 ? <div className="departments__no-data no-data">No departments found.</div> : null}
            <AddDepartment />
            <Overlay />
            <DepartmentCard 
            departmentID={selectedDepartment?.departmentID}
            departmentName={selectedDepartment?.departmentName!}
            departmentDescription={selectedDepartment?.departmentDescription!}
            />
        </div>
    )
}