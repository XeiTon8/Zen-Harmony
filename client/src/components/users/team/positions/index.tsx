import React from 'react';
import { Link } from 'react-router-dom';
import { MySQLService } from '../../../../services/MySQLService';
import { AppContext } from '../../../../context/generalContext';

import { AddPosition } from '../../../../components/popups/addPosition';
import { Overlay } from '../../../../components/overlay';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../redux/hooks';
import { selectPositionByID, selectPositionID, selectPositions } from '../../../../redux/users/positions/selectors';
import { selectUser, selectUsers } from '../../../../redux/users/selectors';

import './positions.scss'
import { deleteUserPosition, setSelectedPositionID } from '../../../../redux/users/positions/slice';
import { PositionCard } from './positionCard';

export const Positions = () => {

    const positions = useSelector(selectPositions);
    const users = useSelector(selectUsers);
    const dispatch = useAppDispatch();
    const service = new MySQLService();
    const {popups} = React.useContext(AppContext)
    const selectedPositionID = useSelector(selectPositionID)
    const selectedPosition = useSelector(selectPositionByID(selectedPositionID!))
    const currentUser = useSelector(selectUser);

    const callAddPosition = () => {
        popups.setIsAddPosition(true);
        popups.setIsOverlay(true);
    }

    const renderPositions = () => {
        const positionsPerUserTotal: { [position: string]: number } = {};

        if (users) {
            users.forEach((user) => {
                if (!positionsPerUserTotal[user.position!]) {
                    positionsPerUserTotal[user.position!] = 1;
                } else {
                    positionsPerUserTotal[user.position!]++;
                }
            });
        }

        const deletePosition = async (id: number) => {
            try {
            await service.deletePosition(id);
            dispatch(deleteUserPosition(id));
            } catch (e: any) {
                throw new Error(e);
            }
        }
    
        const openEditPosition = async (id: number) => {
            dispatch(setSelectedPositionID(id));
            popups.setIsPositionCard(true);
            
        }

        return positions.map((position) => {
            const userCount = positionsPerUserTotal[position.positionName]
            return (
                <tr className="positions__position-row">
                    <td className="positions__position-cell">{position.positionName}</td>
                    <td className="positions__position-cell">{position.positionDescription ? position.positionDescription : "No description."}</td>
                    <td className="positions__position-cell">{userCount || 0}</td>
                    {currentUser.userRole?.includes("Owner") || currentUser.userRole?.includes("Executive") ? (
                    <td>
                        <div className="positions__btns">
                            <button className="button" onClick={() => openEditPosition(position.positionID!)}>Edit</button>
                            <button className='button' onClick={() => deletePosition(position.positionID!)}>Delete</button>
                        </div>
                    </td>
                    ) : null}
                </tr>
            )
        })
    }


    return (
        <div className="positions__container">
            <nav className="positions__menu-n-nav">
                <Link to="/team">Team</Link>
                <Link to="/departments">Departments</Link>
                <button className="button" onClick={() => callAddPosition()}>Add new position</button>
            </nav>
            <table className="positions__positions-table">
            <thead>
                <th>Position</th>
                <th>Description</th>
                <th>Number of users</th>
                {currentUser.userRole?.includes("Owner") || currentUser.userRole?.includes("Executive") ? <th>Actions</th> : null}
            </thead>
            <tbody>
            {renderPositions()}
            </tbody>
            </table>
            {positions!?.length <= 0 ? <div className="positions__no-data no-data">No positions found.</div> : null}
            <AddPosition />
            <Overlay />
            <PositionCard
            positionID={selectedPosition?.positionID}
            positionName={selectedPosition?.positionName!}
            positionDescription={selectedPosition?.positionDescription!} 
            />
        </div>
    )
}