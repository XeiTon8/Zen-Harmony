import React from 'react';
import { AppContext } from '../../../context/generalContext';
import { MySQLService } from '../../../services/MySQLService';


import { useAppDispatch } from '../../../redux/hooks';
import { addPosition } from '../../../redux/users/positions/slice';
import { IPosition } from '../../../redux/users/positions/types';

import './addPosition.scss'

export const AddPosition = () => {

    const service = new MySQLService();
    const dispatch = useAppDispatch();
    const {popups} = React.useContext(AppContext);
    const [position, setPosition] = React.useState<any>({
        positionName: "",
        positionDescription: "",
    })

    const handleRole = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        const {name, value} = target;
        setPosition({
        ...position,
        [name]: value
        })
    }

    const addUserPosition = async (position: IPosition) => {
        try {
            const res = await service.createPosition(position);
            const fetchedPosition = await service.getPositionByID(res.data.insertId);
            const positionToAdd: IPosition = fetchedPosition.data[0];
            dispatch(addPosition(positionToAdd));
            popups.setIsAddPosition(false);
            popups.setIsOverlay(false);
        } catch(e: any) {
            alert("Failed to add position.")
            throw new Error(e)
        }
    }

    const closeForm = () => {
        popups.setIsAddPosition(false);
        popups.setIsOverlay(false);
    }

    return (
        <form action="post" className={`${popups.isAddPosition ? 'add-position--active' : 'add-position--hidden'} add-position`}>
            <div className="add-position__wrapper">
                <h2>Position</h2>
                <label htmlFor="">Position name</label>
                <input value={position.positionName} name="positionName" onChange={handleRole} />
                <label htmlFor="">Position description</label>
                <input value={position.positionDescription} name="positionDescription" onChange={handleRole} />
                <button type="button" className="button" onClick={() => addUserPosition(position)}>Add position</button>
                <button type="button" className="button" onClick={() => closeForm()}>Cancel</button>
            </div>
        </form>
    )
}