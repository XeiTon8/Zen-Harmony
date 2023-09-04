import React from 'react';
import { MySQLService } from '../../../services/MySQLService';
import { AppContext, ITimer } from '../../../context/generalContext';

import { useAppDispatch } from '../../../redux/hooks';
import { useSelector } from 'react-redux';
import { selectTaskByID } from '../../../redux/tasks/selectors';
import { setPassedTime } from '../../../redux/tasks/slice';

import './timerPopup.scss'

interface TimerPopupProps {
    isCalled: boolean;
}
export const TimerPopup: React.FC<TimerPopupProps> = ({isCalled}) => {
    const {popups, setTimer, timer} = React.useContext(AppContext);
    const task = useSelector(selectTaskByID(timer.timerTaskID))
    const dispatch = useAppDispatch();
    const service = new MySQLService();

    const closePopup = () => {
        popups.setIsTimerPopup(false);
        const cleanedTimer: ITimer = {
            ...timer,
            running: false,
            startTime: null,
            passedTime: 0
        }
        setTimer(cleanedTimer);
    }

    const saveTimer = async () => {
        popups.setIsTimerPopup(false);
        const passedTimer: ITimer = {
            ...timer,
            running: false
        }
        const cleanedTimer: ITimer = {
            ...timer,
            running: false,
            startTime: null,
            passedTime: 0
        }
        setTimer((cleanedTimer))
        await service.updateTaskTimeSpent(task!?.projectID!, timer.timerTaskID!, timer.passedTime)
        dispatch(setPassedTime(passedTimer))
        
    }
    return (
        <div className={` timer-popup ${isCalled ? 'timer-popup-active' : 'timer-popup-hidden'}`}>
            <button className="button" onClick={() => closePopup()}>Cancel and remove timer</button>
            <button className="button" onClick={() => saveTimer()}>Save time</button>
        </div>
    )
}