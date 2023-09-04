import React from 'react';
import { AppContext } from '../../../context/generalContext';
import { MySQLService } from '../../../services/MySQLService';

import { useAppDispatch } from '../../../redux/hooks';
import { addDepartment } from '../../../redux/users/departments/slice';
import { IDepartment } from '../../../redux/users/departments/types';

import './addDepartment.scss';

export const AddDepartment = () => {

    const service = new MySQLService();
    const dispatch = useAppDispatch();
    const {popups} = React.useContext(AppContext)
    
    const [department, setDepartment] = React.useState<any>({
        departmentName: "",
        departmentDescription: "",
    })

    const handleDepartment = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        const {name, value} = target;

        setDepartment({
        ...department,
        [name]: value
    })
    }

    const addUserDepartment = async (department: IDepartment) => {
        try {
            const res = await service.createDepartment(department);
            const fetchedDepartment = await service.getDepartmentByID(res.data.insertId);
            const departmentToAdd: IDepartment = fetchedDepartment.data[0]
            dispatch(addDepartment(departmentToAdd));
            popups.setIsAddDepartment(false);
            popups.setIsOverlay(false);
        } catch(e: any) {
            alert("Failed to add a department.")
            throw new Error(e)
        }
    }

    const closeForm = () => {
        popups.setIsAddDepartment(false);
        popups.setIsOverlay(false);
    }

        return (
            <form className={`add-department ${popups.isAddDepartment ? "add-department--active" : "add-department--hidden"} `} action="post" >
                <div className="add-department__wrapper">
                    <h2>Department</h2>
                    <label htmlFor="">Department name</label>
                    <input value={department.departmentName} name="departmentName" onChange={handleDepartment} />
                    <label htmlFor="">Department description</label>
                    <input value={department.departmentDescription}  name="departmentDescription" onChange={handleDepartment} />
                    <button type="button"  className="button" onClick={() => addUserDepartment(department)}>Add department</button>
                    <button type="button" className="button" onClick={() => closeForm()}>Cancel</button>
                </div>
            </form>
        )

}