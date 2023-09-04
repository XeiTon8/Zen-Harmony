import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { AppContext } from '../../../context/generalContext';
import { MySQLService } from '../../../services/MySQLService';

import { useSelector } from 'react-redux';
import { selectSelectedUserID, selectUser, selectUsers } from '../../../redux/users/selectors';
import { deleteUser, setIsUserCardOpened, setSelectedUserID } from '../../../redux/users/slice';
import { useAppDispatch } from '../../../redux/hooks';
import { IUser } from '../../../redux/users/types';

import { AddEmployee } from '../../../components/popups/addEmployee';
import { Overlay } from '../../../components/overlay';

import './team.scss'

export const Team = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const service = new MySQLService();
    const {popups} = React.useContext(AppContext)
    const users = useSelector(selectUsers);
    const currentUser = useSelector(selectUser);
    const selectedUserID = useSelector(selectSelectedUserID)

    const renderUsers = () => {
        return users?.map((user: IUser) => {
            return (
            <tr className="users-table__user-row">
                <td className="users-table__user-cell" onClick={() => openUserCard(user.userID!, user.userName)}><span>{user.userName}</span></td>
                <td className="users-table__user-cell"><span>{user.userEmail}</span></td>
                <td className="users-table__user-cell"><span>{user.department ? user.department : "No data"}</span></td>
                <td className="users-table__user-cell"><span>{user.position ? user.position : "No data"}</span></td>
                {currentUser.userRole?.includes("Owner") || user.userRole?.includes("Executive") ? 
                <td className="users-table__user-cell"><button className="button" onClick={() => deleteUserOnClick(user.userID!)}>Delete user</button></td> : null}
            </tr>
            )
    
        })
    }

    const deleteUserOnClick = async (userID: string) => {
        await service.deleteUser(userID);
        dispatch(deleteUser(userID))
    }

    const openUserCard = (userID: string, username: string) => {
        dispatch(setIsUserCardOpened(true));
        dispatch(setSelectedUserID(userID));
        navigate(`/users/${username}`)
        console.log(selectedUserID);

    }

    const openAddEmployee = () => {
        popups.setIsAddEmployee(true);
        popups.setIsOverlay(true);
    }


    return (
        <div className="team__container">
            <nav className="team__menu-and-nav">
            <Link to="/departments">Departments</Link>
            <Link to="/positions">Positions</Link>
            {currentUser.userRole?.includes("Owner") || currentUser.userRole?.includes("Executive") ? 
            <button className='button' onClick={() => openAddEmployee()}>Invite an employee</button> : null }
            </nav>
            <table className="team__users-table">
                <thead>
                    <th>User</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Position</th>
                    {currentUser.userRole?.includes("Owner") || currentUser.userRole?.includes("Executive") ? (<th>Actions</th>) : null}
                </thead>
                <tbody>
                {renderUsers()}
                </tbody>
            </table>
            {users!?.length <= 0 ? <div className="team__no-data no-data">No users found.</div> : null}
            
            <Overlay />
            <AddEmployee />
        </div>
    )
}