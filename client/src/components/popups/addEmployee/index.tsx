import React from 'react';
import { AppContext } from '../../../context/generalContext';
import { MySQLService } from '../../../services/MySQLService';

import { useSelector } from 'react-redux';
import { selectDepartments } from '../../../redux/users/departments/selectors';
import { selectPositions } from '../../../redux/users/positions/selectors';
import { IDepartment } from '../../../redux/users/departments/types';
import { IPosition } from '../../../redux/users/positions/types';

import './addEmployee.scss'

interface IInviteToSend {
    userEmail: string;
    department?: string;
    position?: string;
}


export const AddEmployee = () => {

    const service = new MySQLService();
    const departments = useSelector(selectDepartments);
    const positions = useSelector(selectPositions);

    const {popups} = React.useContext(AppContext)
    const [employeeEmail, setEmployeeEmail] = React.useState("");
    const [inviteToSend, setInviteToSend] = React.useState<IInviteToSend>({
        userEmail: "",
        department: "",
        position: ""
    })

    const handleEmail = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        setEmployeeEmail(target.value);
        setInviteToSend((prev) => ({
            ...prev,
            userEmail: target.value
        }))
    }

    const handleDepartment = (e: React.MouseEvent) => {
        const target = e.target as HTMLSelectElement;
        setInviteToSend({
            ...inviteToSend,
            department: target.value
        })
    }

    const handlePosition = (e: React.MouseEvent) => {
        const target = e.target as HTMLSelectElement;

        setInviteToSend({
            ...inviteToSend,
            position: target.value
        })
    }

    const sendInvite = async (inviteToSend: any) => {
        const emailToSend = {
            email: employeeEmail
        }
        await service.setEmployeeAccount(inviteToSend)
        await service.sendInviteEmail(emailToSend);
        popups.setIsAddEmployee(false);
        popups.setIsOverlay(false);
        
    }

    const renderDepartments = () => {
        return departments.map((department: IDepartment) => {
            return (
            <option value={department.departmentName}>{department.departmentName}</option>   
            )
        })
    }

    const renderPositions = () => {
        return positions.map((position: IPosition) => {
            return (
            <option value={position.positionName}>{position.positionName}</option>
            )
})}

    const closeForm = () => {
        popups.setIsAddEmployee(false);
        popups.setIsOverlay(false);
    }

    return (
        <div>
            <form className={`profile__add-employee ${popups.isAddEmployee ? "add-employee--active" : "add-employee--hidden"}`} action="post">
                <label htmlFor='employeeEmail'>Email</label>
                <input type="text" name="" id="employeeEmail"  value={employeeEmail} onChange={handleEmail} placeholder='Email' />
                <p>Department</p>
                <select onClick={handleDepartment}>
                    <option>Assign a department</option>
                    {renderDepartments()}
                </select>
                <p>Position</p>
                <select onClick={handlePosition}>
                    <option>Assign a position</option>
                    {renderPositions()}
                </select>
                <button className='button' type="button" onClick={() => sendInvite(inviteToSend)}>Send invite</button>
                <button className='button' type="button" onClick ={() => closeForm()}>Cancel</button>
            </form>
    </div>
    )
}