import React from 'react';
import { MySQLService } from '../../../services/MySQLService';


import { useAppDispatch } from '../../../redux/hooks';
import { addLabel } from '../../../redux/tasks/slice';
import { ILabel } from '../../../redux/tasks/types';

import './addLabel.scss'

export const AddLabel = () => {
    const service = new MySQLService();
    const dispatch = useAppDispatch();

    const addUserLabel = async (label: ILabel) => {
        const res = await service.addLabel(label);
        const fetchedLabel = await service.getLabelByID(res.data.insertId);
        const labelToAdd = fetchedLabel.data[0];
        dispatch(addLabel(labelToAdd))
    }

    const [label, setLabel] = React.useState<ILabel>({
        labelName: ""
    })

    const handleLabel = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;

        setLabel((prev) => (
            {...prev,
            labelName: target.value}
        ))
    }
    
    return (
        <div className="labels__wrapper">
            <input type="text" name="" id="" value={label.labelName} onChange={handleLabel}/>
            <button  className="button" onClick={() => addUserLabel(label)}>Add label</button>
        </div>
        
    )
}