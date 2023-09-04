import React from 'react';
import { MySQLService } from '../../../services/MySQLService';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux/hooks';
import { selectUser } from '../../../redux/users/selectors';
import { selectDepartments } from '../../../redux/users/departments/selectors';
import { selectPositions } from '../../../redux/users/positions/selectors';
import { setUserData } from '../../../redux/users/slice';
import { IUser } from '../../../redux/users/types';

import './profile.scss'

export const Profile = () => {

    const service = new MySQLService();
    const dispatch = useAppDispatch();
    const user = useSelector(selectUser);
    const departments = useSelector(selectDepartments);
    const positions = useSelector(selectPositions);
    const [isUserEditable, setIsUserEditable] = React.useState(false);
    const [userToUpdate, setUserToUpdate] = React.useState<IUser>({
        userName: user.userName,
        userEmail: user.userEmail,
        userRole: user.userRole,
        department: user.department,
        position: user.position,
        boss: user.boss,
    })

    
    const setUserDataToUpdate = (e: React.ChangeEvent) => {
        const {name, value} = (e.target) as HTMLInputElement;
        setUserToUpdate((prev) => ({
            ...prev,
            [name]: value
        }))
        console.log(userToUpdate);
    }


    const sendUpdatedUser = async (e: React.FormEvent, user: IUser) => {
        try {
        e.preventDefault();
        await service.updateUser(user, user.userID!);
        const res = await service.getUser(user.userID!);
        const newUser = res.data[0];
        dispatch(setUserData(newUser));
        setIsUserEditable(false);
            
        } catch (error: any) {
            throw new Error(error);
        }}

        const openUserEdit = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsUserEditable(true);
            setUserToUpdate({...user})
        }

        const closeUserEdit = () => {
            setIsUserEditable(false);
        }

        const renderPositionsToSelect = () => {
            return positions.map((position) => {
                return (
                    <option value={position.positionName}>{position.positionName}</option>
                )
            })}

        const renderDepartmentsToSelect = () => {
            return departments.map((department) => {
                return (
                    <option value={department.departmentName}>{department.departmentName}</option>
                )
            })}

            const handleDepartmentChange = (e: React.ChangeEvent) => {
                const target = e.target as HTMLOptionElement;
                setUserToUpdate((prev) => ({
                    ...prev,
                    department: target.value
                }))
            }

            const handlePositionChange = (e: React.ChangeEvent) => {
                const target = e.target as HTMLOptionElement;
                setUserToUpdate((prev) => ({
                    ...prev,
                    position: target.value
                }))
            }
    
return (
    <div className='profile__container'>
            {isUserEditable ? (
                <form method='post' className="profile__user-form user-form" onSubmit={(e: React.FormEvent) => sendUpdatedUser(e, userToUpdate)}> 
                    <div className="user-form__content-wrapper">
                        <div className="user-form__left-wrapper">
                            <label htmlFor="user-form__username--editable">Username</label>
                            <input value={userToUpdate.userName} placeholder='Username'  id='user-form__username--editable'  onChange={setUserDataToUpdate} name="userName" />
                            <label htmlFor="user-form__email--editable">Email</label>
                            <input value={userToUpdate.userEmail} placeholder='Email' id="user-form__email--editable" onChange={setUserDataToUpdate} name="userEmail" />
                            <label htmlFor="user-form__user-role--editable">Role</label>
                            <input value={userToUpdate.userRole!} placeholder='Role' id="user-form__user-role--editable" onChange={setUserDataToUpdate} name="userRole" readOnly />
                        </div>
                        <div className="user-form__right-wrapper">
                            <label htmlFor="user-form__chief--editable">Chief</label>
                            <input value={userToUpdate.boss?.userName} placeholder='Chief' id="user-form__chief--editable" onChange={setUserDataToUpdate} name="boss" readOnly />
                            <label htmlFor="user-form__department--editable">Department</label>
                            <select id="user-form__department--editable" onChange={handleDepartmentChange}>
                            <option>Select department</option>
                            {renderDepartmentsToSelect()}
                            </select>
                            <label htmlFor="user-form__position--editable">Position</label>
                            <select id="user-form__position--editable" onChange={handlePositionChange}>
                                <option>Select position</option>
                                {renderPositionsToSelect()}
                            </select>
                        </div>
                        <button className="button" type="submit">Confirm</button>
                        <button className="button" type="button" onClick={() => closeUserEdit()}>Cancel</button>
                    </div> 
            </form>
            ) : (
                <form className="profile__user-form user-form">
                    <div className="user-form__content-wrapper"> 
                        <div className="user-form__left-wrapper">
                            <label htmlFor="user-form__username">Username</label>
                            <input value={user.userName} placeholder='Username' id="user-form__username" readOnly />
                            <label htmlFor="user-form__email">Email</label>
                            <input value={user.userEmail} placeholder='Email' id="user-form__email" readOnly />
                            <label htmlFor="user-form__user-role">Role</label>
                            <input value={user.userRole!} placeholder='Role'  id="user-form__user-role" readOnly/>
                        </div>
                        <div className="user-form__right-wrapper">
                            <label htmlFor="user-form__chief">Chief</label>
                            <input value={user.boss?.userName!} placeholder='Chief' id="user-form__chief" readOnly />
                            <label htmlFor="user-form__department">Department</label>
                            <input value={user.department!} placeholder="Department" id="user-form__department" readOnly />
                            <label htmlFor="user-form__position">Position</label>
                            <input value={user.position!} placeholder="Position" id="user-form__position" readOnly  />
                        </div> 
                        <button className="button profile-button" type="button" onClick={(e: React.MouseEvent) => openUserEdit(e)}>Edit</button>
                    </div>
            </form>
            )}
    </div>
    

)}