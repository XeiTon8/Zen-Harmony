import React from 'react';
import { AppContext } from '../../../../../context/generalContext';
import { MySQLService } from '../../../../../services/MySQLService';

import { useAppDispatch } from '../../../../../redux/hooks';
import { updateDepartment } from '../../../../../redux/users/departments/slice';
import { IDepartment } from '../../../../../redux/users/departments/types';


import './departmentCard.scss';


export const DepartmentCard: React.FC<IDepartment> = ({departmentID, departmentName, departmentDescription}) => {
    const dispatch = useAppDispatch();
    const {popups} = React.useContext(AppContext);
    const service = new MySQLService();
    const [updatedDepartment, setUpdatedDepartment] = React.useState<IDepartment>({
        departmentID: departmentID,
        departmentDescription: departmentDescription!,
        departmentName: departmentName!,
    })

    React.useEffect(() => {
        setUpdatedDepartment({
            departmentID: departmentID,
            departmentDescription: departmentDescription,
            departmentName: departmentName,
        })
    }, [departmentID, departmentName, departmentDescription])

    const handleUpdate = (e: React.ChangeEvent) => {
        const {name, value} = (e.target) as HTMLInputElement;
        setUpdatedDepartment!((prev: IDepartment) => ({
            ...prev,
            [name]: value
        }))

        console.log(updatedDepartment);
    }

    const sendUpdatedDepartment = async (e: React.FormEvent, department: IDepartment) => {
        e.preventDefault();
        try {
            await service.updateDepartment(department.departmentID!, department);
            const fetchedDepartment = await service.getDepartmentByID(department.departmentID!);
            const departmentToAdd = fetchedDepartment.data[0];
            dispatch(updateDepartment(departmentToAdd));
            popups.setIsDepartmentCard(false);
        } catch (error: any) {
            throw new Error(error);
        }
    }

    const closeForm = () => {
        popups.setIsDepartmentCard(false);
    }

return (
    <div>
        <form  
        className={`department-card ${popups.isDepartmentCard ? "department-card--active" : "department-card--hidden"}`} 
        onSubmit={(e: React.FormEvent) => sendUpdatedDepartment(e, updatedDepartment!)}>
            <div className="department-card__department-name">
                <label htmlFor="">
                <span>Name</span>
                <input type="text" value={updatedDepartment!.departmentName} onChange={handleUpdate} name="departmentName" id="" />
        </label>
            </div>
            <div className="department-card__department-description">
                <label htmlFor="">
                <span>Description</span>
                <input type="text" value={updatedDepartment!.departmentDescription} onChange={handleUpdate} name="departmentDescription" id="" />
        </label>
            </div>
        
        
        <button type="submit" className="button">Confirm</button>
        <button type="button" className="button" onClick={() => closeForm()}>Cancel</button>
        </form>
    </div>
)

}