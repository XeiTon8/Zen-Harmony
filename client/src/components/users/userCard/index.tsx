import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/hooks';
import { setIsUserCardOpened, updateUserData } from '../../../redux/users/slice';
import { useSelector } from 'react-redux';
import { selectUser, selectUserByID, selectUsers } from '../../../redux/users/selectors';
import { IUser, userRoles } from '../../../redux/users/types';
import { MySQLService } from '../../../services/MySQLService';
import { selectDepartments } from '../../../redux/users/departments/selectors';
import { selectPositions } from '../../../redux/users/positions/selectors';



export const UserCard: React.FC<IUser> = ({userName, userEmail, userRole, department, position, boss,  userID}) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const service = new MySQLService();
    const user = useSelector(selectUserByID(userID!));
    const currentUser = useSelector(selectUser);
    const departments = useSelector(selectDepartments);
    const positions = useSelector(selectPositions);
    const users = useSelector(selectUsers);

    const [userToUpdate, setUserToUpdate] = React.useState<IUser>({
        userEmail: user!?.userEmail,
        userName: user!?.userName,
        userRole: user!?.userRole,
        department: user!?.department,
        position: user!?.position,
        boss: user!?.boss,
    })   

    const [isUserCardEditable, setIsUserCardEditable] = React.useState(false);

    const closeUserCard = () => {
        dispatch(setIsUserCardOpened(false))
        navigate('/team')
    }

    const editUserCard = (e: React.MouseEvent, user: IUser) => {
        e.preventDefault();
        e.stopPropagation();
        setUserToUpdate(user);
        setIsUserCardEditable(true);
    }

    const handleUpdateUser = (e: React.ChangeEvent) => {
        const {name, value} = e.target as HTMLInputElement;
        setUserToUpdate((prev) => ({
            ...prev,
            [name]: value
        }))

        console.log(userToUpdate)
    }

    const handleRoleUpdate = (e: React.ChangeEvent) => {
        const selectedRoleValue = (e.target as HTMLOptionElement).value;
        setUserToUpdate((prev) => ({
            ...prev,
            userRole: selectedRoleValue
        }))

        console.log(userToUpdate)
    }

    const handleDepartmentUpdate = (e: React.ChangeEvent) => {
        const target = (e.target) as HTMLOptionElement;
        setUserToUpdate((prev) => ({
            ...prev,
            department: target.value
        }))
    }

    const handlePositionUpdate = (e: React.ChangeEvent) => {
        const target = (e.target) as HTMLOptionElement;
        setUserToUpdate((prev) => ({
            ...prev,
            position: target.value
        }))
    }

    const handleBossUpdate = (e: React.ChangeEvent) => {
        const target = (e.target) as HTMLOptionElement;
        const bossToSet = users?.find((user) => user.userName === target.value);
        setUserToUpdate((prev) => ({
            ...prev,
            boss: bossToSet
        }))
    }

    const confirmUserUpdate = async (e: React.FormEvent, user: IUser, userID: string) => {
        try {
        e.preventDefault();
        console.log(user);
        await service.updateUser(user, userID);
        const updatedUser = await service.getUser(userID);
        const userData = updatedUser.data[0];
        dispatch(updateUserData(userData))
        setIsUserCardEditable(false)

        } catch(e) {
            console.error(e)
        }
    }

    const mapRoleSelect = () => {
        return (
            <select onChange={handleRoleUpdate}>
                {(Object.keys(userRoles) as Array<keyof typeof userRoles>).map((userRole) => (
                <option key={userRole} value={userRoles[userRole]}>{userRoles[userRole]}</option>
                ))}
            </select>
        )
    }

    const mapDepartments = () => {
        return departments.map((department) => {
            return (
                <option value={department.departmentName}>{department.departmentName}</option>
            )
        })
    }

    const mapPositions = () => {
        return positions.map((position) => {
            return (
                <option value={position.positionName}>{position.positionName}</option>
            )
        })
    }

    const mapUsers = () => {
        return users?.map((user) => {
            return (
                <option value={user.userName}>{user.userName}</option>
            )
        })
    }

    
    return (

        <div className="user-card__container">
            {isUserCardEditable ? (<>
                <form method='post' className="profile__user-form user-form" onSubmit={(e: React.FormEvent) => confirmUserUpdate(e, userToUpdate, userID!)}> 
                    <div className="user-form__content-wrapper">
                        <div className="user-form__left-wrapper">
                            <label htmlFor="user-form__username--editable">Username</label>
                            <input value={userToUpdate.userName} placeholder='Username'  id='user-form__username--editable' name="userName" readOnly/>
                            <label htmlFor="user-form__email--editable">Email</label>
                            <input value={userToUpdate.userEmail} placeholder='Email' id="user-form__email--editable" name="userEmail" readOnly />
                            <label htmlFor="user-form__user-role--editable">Role</label>
                            {mapRoleSelect()}
                        </div>
                        <div className="user-form__right-wrapper">
                            <label htmlFor="user-form__chief--editable">Chief</label>
                            <input value={userToUpdate.boss?.userName} placeholder='Chief' id="user-form__chief--editable" onChange={handleUpdateUser} name="boss" readOnly />
                            <select onChange={handleBossUpdate}>
                                <option>Assign a chief</option>
                                {mapUsers()}
                            </select>
                            <label htmlFor="user-form__department--editable">Department</label>
                            <select id="user-form__department--editable" onChange={handleDepartmentUpdate}>
                                <option>Select department</option>
                                {mapDepartments()}
                            </select>
                            <label htmlFor="user-form__position--editable">Position</label>
                            <select id="user-form__position--editable" onChange={handlePositionUpdate}>
                                <option>Select position</option>
                                {mapPositions()}
                            </select>
                        </div>
                        <button className="button" type="submit">Confirm</button>
                        <button className="button" type="button" onClick={() => setIsUserCardEditable(false)}>Cancel</button>
                    </div> 
            </form>
            </>) : (
            <>
            <form className="profile__user-form user-form">
                    <div className="user-form__content-wrapper"> 
                        <div className="user-form__left-wrapper">
                            <label htmlFor="user-form__username">Username</label>
                            <input value={userName} placeholder='Username' id="user-form__username" readOnly />
                            <label htmlFor="user-form__email">Email</label>
                            <input value={userEmail} placeholder='Email' id="user-form__email" readOnly />
                            <label htmlFor="user-form__user-role">Role</label>
                            <input value={userRole!} placeholder='Role'  id="user-form__user-role" readOnly/>
                        </div>
                        <div className="user-form__right-wrapper">
                            <label htmlFor="user-form__chief">Chief</label>
                            <input value={boss?.userName!} placeholder='Chief' id="user-form__chief" readOnly />
                            <label htmlFor="user-form__department">Department</label>
                            <input value={department!} placeholder="Department" id="user-form__department" readOnly />
                            <label htmlFor="user-form__position">Position</label>
                            <input value={position!} placeholder="Position" id="user-form__position" readOnly  />
                        </div> 
                        {currentUser?.userRole?.includes("Owner") || currentUser?.userRole?.includes("Executive") ? <button className="button" onClick={(e: React.MouseEvent) => editUserCard(e, user!)}>Edit</button> : null}
                        <button className="button" onClick={() => closeUserCard()}>Close</button>
                    </div>
            </form>
            </>
        )}
        
        </div>
    )
}