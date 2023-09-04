import React from 'react';
import { AppContext } from '../../../context/generalContext';
import { MySQLService } from '../../../services/MySQLService';


import { useAppDispatch } from '../../../redux/hooks';
import { useSelector } from 'react-redux';
import { selectUsers } from '../../../redux/users/selectors';
import { 
    addCalendarEvent, 
    clearCalendarForm, 
    setCalendarEventAssignedUser, 
    setCalendarEventData, 
    setCalendarEventType, 
    setIsAddEventOpened, 
    setRecentlyAddedEvent } from '../../../redux/calendarEvents/slice';

import { selectCalendarEvent, selectIsAddNewEventOpened } from '../../../redux/calendarEvents/selectors';

import { CalendarEventTypes, ICalendarEvent } from '../../../redux/calendarEvents/types';
import { IRow } from '../../../components/calendar';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './addEvent.scss'

export const AddCalendarEvent: React.FC<{rows: IRow[], setCalendarRows: (val: any) => void, addSingleEventToDays: (val: ICalendarEvent) => void}> = ({addSingleEventToDays}) => {
    const dispatch = useAppDispatch();
    const service = new MySQLService();

    const users = useSelector(selectUsers)
    const selectedCalendarEvent = useSelector(selectCalendarEvent);
    const isPopupCalled = useSelector(selectIsAddNewEventOpened);

    const {popups} = React.useContext(AppContext);
    const handleCalendarEventData = (e: React.ChangeEvent) => {
        const {name, value} = e.target as HTMLInputElement;
        dispatch(setCalendarEventData({name, value}))
    }

    const handleStartDate = (date: Date) => {
        
        dispatch(setCalendarEventData({name: 'startDate', startDate: date.toString()}))
    }

    const handleEndDate = (date: Date) => {
        dispatch(setCalendarEventData({name: 'endDate', endDate: date.toString()}))
    }

    const handleEventType = (e: React.ChangeEvent) => {
        const select = e.target as HTMLSelectElement;
        const val = select.value;
        dispatch(setCalendarEventType(val as CalendarEventTypes))
    }

    const handleUserAssign = (e: React.ChangeEvent) => {
        const target = e.target as HTMLSelectElement;
        const selectedUser = users?.find((user) => user.userName === target.value);
        dispatch(setCalendarEventAssignedUser(selectedUser!))
    }

    const createCalendarEvent = async ( e: React.FormEvent, calendarEvent: ICalendarEvent) => {
        e.preventDefault();
        try {
            const eventWithUpdatedDate: ICalendarEvent= {
                ...calendarEvent,
                startDate: new Date(calendarEvent.startDate!).toISOString().slice(0, 19).replace("T", " "),
                endDate: new Date(calendarEvent.endDate!).toISOString().slice(0, 19).replace("T", " "),
                allowedDepartments: JSON.stringify(calendarEvent.allowedDepartments),
                allowedRoles: JSON.stringify(calendarEvent.allowedRoles)
            }
            const res = await service.createCalendarEvent(eventWithUpdatedDate);
            const fetchedEvent = await service.getCalendarEvent(res.data.insertId);
            console.log(fetchedEvent.data);
            const eventToAdd: ICalendarEvent = fetchedEvent.data[0];
            dispatch(addCalendarEvent(eventToAdd));
            addSingleEventToDays(eventToAdd);

            dispatch(setRecentlyAddedEvent(true));
            dispatch(setIsAddEventOpened(false));
            popups.setIsOverlay(false);
            setTimeout(() => {
            dispatch(setRecentlyAddedEvent(false));
            dispatch(clearCalendarForm())
            }, 300)
            
        } catch(e: any) {
            throw new Error(e)
        }
    }

    const renderUsersToAssign = () => {
        return users?.map((user) => {
            return (
                <option  key={user.userID} value={user.userName}>{user.userName}</option>
            )
        })
    }

    const closeForm = (e: React.FormEvent) => {
        e.preventDefault();
        popups.setIsOverlay(false);
        dispatch(setIsAddEventOpened(false));
        dispatch(clearCalendarForm())
    }

    return (

        <form className={`add-calendar-event-form add-calendar-event ${isPopupCalled ? 'add-event--active' : 'add-event--hidden'}`} onSubmit={(e: React.FormEvent) => createCalendarEvent(e, selectedCalendarEvent)}>
                    <label htmlFor="">
                        <input type="text" name="eventName" id=""  value={selectedCalendarEvent.eventName} onChange={handleCalendarEventData}  placeholder='Name'/>
                    </label>
                    <label htmlFor="">
                        <input type="text" name="eventDescription" id="" value={selectedCalendarEvent.eventDescription} onChange={handleCalendarEventData} placeholder='Description'/>
                    </label>
                    <select name="calendarEventType" id="" onChange={handleEventType}>
                        <option>Choose event type</option>
                        {(Object.keys(CalendarEventTypes) as Array<keyof typeof CalendarEventTypes>).map((eventType) => (
                            <option key={eventType} value={CalendarEventTypes[eventType]}>{CalendarEventTypes[eventType]}</option>
                        ))}
                    </select>
                    <select name="assignedUser" onChange={handleUserAssign}>
                        <option>Assign a user</option>
                        {renderUsersToAssign()}
                    </select>
                    <div className="add-calendar-event__select-deadline">
                        <div className="add-calendar-event__start-date">
                            <span>Start date</span>
                            <DatePicker  selected={new Date(selectedCalendarEvent.startDate!.toString())} onChange={handleStartDate} name='startDate'  dateFormat="MM/dd/yyyy" />
                        </div>
                        <div className="add-calendar-event__end-date">
                            <span>End date</span>
                            <DatePicker selected={new Date(selectedCalendarEvent.endDate!.toString())} onChange={handleEndDate} name='endDate'  dateFormat="MM/dd/yyyy" />
                        </div>
                    </div>
                    <button className="button" type="submit">Confirm</button>
                    <button className="button" onClick={(e: React.FormEvent) => closeForm(e)}>Cancel</button>
                </form>
                
    )
}