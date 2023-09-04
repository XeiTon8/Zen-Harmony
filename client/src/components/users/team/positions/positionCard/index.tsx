import React from 'react';
import { AppContext } from '../../../../../context/generalContext';
import { MySQLService } from '../../../../../services/MySQLService';

import { useAppDispatch } from '../../../../../redux/hooks';
import { updatePosition } from '../../../../../redux/users/positions/slice';
import { IPosition } from '../../../../../redux/users/positions/types';

import './positionCard.scss'

export const PositionCard: React.FC<IPosition> = ({positionID, positionName, positionDescription}) => {

    const dispatch = useAppDispatch();
    const {popups} = React.useContext(AppContext);
    const service = new MySQLService();

    const [updatedPosition, setUpdatedPosition] = React.useState<IPosition>({
        positionID: positionID,
        positionName: positionName,
        positionDescription: positionDescription,
    })

    React.useEffect(() => {
        setUpdatedPosition({
            positionID: positionID,
            positionName: positionName,
            positionDescription: positionDescription
        })
    }, [positionName, positionDescription, positionID])

    const handleUpdate = (e: React.ChangeEvent) => {
        const {name, value} = (e.target) as HTMLInputElement;
        setUpdatedPosition!((prev: IPosition) => ({
            ...prev,
            [name]: value
        }))

    }

    const sendUpdatedPosition = async (e: React.FormEvent, position: IPosition) => {
        e.preventDefault();
        try {
            await service.updatePosition(position.positionID!, position);
            const fetchedPosition = await service.getPositionByID(position.positionID!);
            const positionToAdd = fetchedPosition.data[0];
            dispatch(updatePosition(positionToAdd));
            popups.setIsPositionCard(false);
        } catch (error: any) {
            throw new Error(error);
        }
    }

    const closeForm = () => {
        popups.setIsPositionCard(false);
    }

    return (
        <div>
            <form  
            className={`position-card ${popups.isPositionCard ? "position-card--active" : "position-card--hidden"}`} 
            onSubmit={(e: React.FormEvent) => sendUpdatedPosition(e, updatedPosition)}>
                <div className="position-card__position-name">
                    <label htmlFor="">
                        <span>Name</span>
                        <input type="text" value={updatedPosition!.positionName} onChange={handleUpdate} name="positionName" id="" />
                    </label>
                </div>
                <div className="position-card__position-description">
                    <label htmlFor="">
                        <span>Description</span>
                        <input type="text" value={updatedPosition.positionDescription} onChange={handleUpdate} name="positionDescription" id="" />
                    </label>
                </div>
            
            
            <button type="submit" className="button">Confirm</button>
            <button type="button" className="button" onClick={() => closeForm()}>Cancel</button>
            </form>
        </div>
    )
}