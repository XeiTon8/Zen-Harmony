import React from 'react';
import { MySQLService } from '../../../services/MySQLService';
import { AppContext } from '../../../context/generalContext';

import { useAppDispatch } from '../../../redux/hooks';
import { useSelector } from 'react-redux';
import { selectUsers } from '../../../redux/users/selectors';
import { selectCalendarEventID } from '../../../redux/calendarEvents/selectors';
import { updateCalendarEvent } from '../../../redux/calendarEvents/slice';
import { IRow } from '..';
import { CalendarEventTypes, ICalendarEvent, IDay } from '../../../redux/calendarEvents/types';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './calendarEventCard.scss'

interface CalendarEventCardProps extends ICalendarEvent {
    days: IDay[]; 
    rows: IRow[];
    setDays: (val: any) => void;
    setCalendarRows: (val: any) => void;
}

export const CalendarEventCard: React.FC<CalendarEventCardProps> = (
{days, setDays, rows, setCalendarRows, eventName, eventType, eventDescription, startDate, endDate, assignedUser}) => {

    const dispatch = useAppDispatch();
    const service = new MySQLService();
    const {popups} = React.useContext(AppContext);
    
    const eventID = useSelector(selectCalendarEventID);
    const users = useSelector(selectUsers);

    const event: ICalendarEvent = {eventName, eventType, eventDescription, startDate, endDate, assignedUser, eventID: eventID!}

    const [isEditable, setIsEditable] = React.useState(false);
    const [updatedEvent, setUpdatedEvent] = React.useState<ICalendarEvent>({
        eventID: event!?.eventID,
        eventName: event!?.eventName,
        eventDescription: event!?.eventDescription,
        eventType: event!?.eventType,
        startDate: event!?.startDate,
        endDate: event!?.endDate,
        assignedUser: event!?.assignedUser

    });

    const openEditEvent = (event: ICalendarEvent) => {
        setIsEditable(true);
        setUpdatedEvent({...event})
    }

    const closeCard = () => {
        popups.setIsCalendarEventCard(false);
    }

    const handleEventUpdate = (e: React.ChangeEvent) => {
        const {name, value} = (e.target) as HTMLInputElement;
        setUpdatedEvent((prev) => ({
            ...prev,
            [name]: value
        }))
        console.log(eventID);
        console.log(updatedEvent);
    }

    const handleEventTypeUpdate = (e: React.ChangeEvent) => {
        const target = e.target as HTMLOptionElement;
        setUpdatedEvent((prev) => ({
            ...prev,
            eventType: target.value as CalendarEventTypes
        }))
    }

    const handleAssignedUserUpdate = (e: React.ChangeEvent) => {
        const target = e.target as HTMLOptionElement;
        const userToSet = users?.find((user) => user.userName === target.value);
            if (userToSet) {
                setUpdatedEvent((prev) => ({
                    ...prev,
                    assignedUser: userToSet
                }))
            } else {
                alert("No user found.")
            }}

    const handleStartDateUpdate = (date: Date) => {
        setUpdatedEvent((prev: ICalendarEvent) => ({
            ...prev,
            startDate: date.toString()
        }))
    }

    const handleEndDateUpdate = (date: Date) => {
        setUpdatedEvent((prev: ICalendarEvent) => ({
            ...prev,
            endDate: date.toString()
        }))
    }

    const updateEvent = async (e: React.FormEvent, event: ICalendarEvent, eventID: number) => {
        e.preventDefault();
        e.stopPropagation();
        try {
        await service.updateCalendarEvent(event, eventID);
        const fetchedEvent = await service.getCalendarEvent(eventID);
        const eventToAdd = fetchedEvent.data[0];
        dispatch(updateCalendarEvent(eventToAdd));

        const oldStartDate = new Date(event.startDate!);
        const oldEndDate = new Date(event.endDate!);
        const newStartDate = new Date(updatedEvent.startDate!);
        const newEndDate = new Date(updatedEvent.endDate!);

        const affectedDays: IDay[] = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        const newStartDateWithoutTime = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), newStartDate.getDate());
        const newEndDateWithoutTime = new Date(newEndDate.getFullYear(), newEndDate.getMonth(), newEndDate.getDate());

        const oldStartDateWithoutTime = new Date(oldStartDate.getFullYear(), oldStartDate.getMonth(), oldStartDate.getDate());
        const oldEndDateWithoutTime = new Date(oldEndDate.getFullYear(), oldEndDate.getMonth(), oldEndDate.getDate());
        
        for (const day of days) {
            const dayDate = new Date(currentYear, day.month, day.day);
            const dayDateWithoutTime = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());

            if ((dayDateWithoutTime >= newStartDateWithoutTime && dayDateWithoutTime <= newEndDateWithoutTime) ||
                (dayDateWithoutTime >= oldStartDateWithoutTime && dayDateWithoutTime <= oldEndDateWithoutTime)) {
                    affectedDays.push(day);
                }
        }

    const updatedDays = days.map(day => {
        const updatedEvents = day.events.filter(e => e.eventID !== eventID);
        if (affectedDays.includes(day)) {
            updatedEvents.push(updatedEvent); 
        }

        return { ...day, events: updatedEvents };
    });
        setDays((updatedDays));
        setIsEditable(false)
            
        } catch (e: any) {
            throw new Error(e);
        }}

    const cancelEditing = () => {
        setIsEditable(false);
    }

    const deleteEvent = async (eventID: number) => {
        await service.deleteCalendarEvent(eventID);
        const updatedRows = rows.map((week) => ({
            row: week.row.map((day) => ({
                ...day,
                events: day.events.filter((event) => event.eventID !== eventID)
            }))
        }));
    
        setCalendarRows(updatedRows);
        popups.setIsCalendarEventCard(false);
    }

    const renderUsersToSet = () => {
        return users?.map((user) => {
            return (
                <option value={user.userName}>{user.userName}</option>
            )
        })
    }

    return (
        <>
        { isEditable ? <>
        <div>
            <form 
            className={`calendar-event-card edit-card ${isEditable && popups.isCalendarEventCard ? 'calendar-event-card--active' : "calendar-event-card--hidden"}`} 
            onSubmit={(e: React.FormEvent) => updateEvent(e, updatedEvent, updatedEvent.eventID!)} >
                <div className="calendar-card__left-content">
                <span>Name</span>
                    <label htmlFor="">
                        <input type="text" value={updatedEvent.eventName} onChange={handleEventUpdate} name="eventName" />
                    </label>
                    <span>Description</span>
                    <label htmlFor="">
                        <input type="text" value={updatedEvent.eventDescription} onChange={handleEventUpdate} name="eventDescription"  />
                    </label>
                </div>
                <div className="calendar-card__right-content">
                    <span>Event type</span>
                    <select onChange={handleEventTypeUpdate}>
                        <option>Select event type</option>
                        {(Object.keys(CalendarEventTypes) as Array<keyof typeof CalendarEventTypes>).map((eventType) => (
                            <option key={eventType} value={CalendarEventTypes[eventType]}>{CalendarEventTypes[eventType]}</option>
                        ))}
                    </select>
                    <span>Assigned user</span>
                    <select onChange={handleAssignedUserUpdate}>
                        <option>Assign a user</option>
                        {renderUsersToSet()}
                    </select>
                </div>

                <div className="calendar-card__date-range date-range-editable">
                    <div className="calendar-card__start-date">
                        <span>Start date</span>
                        <DatePicker selected={new Date(updatedEvent.startDate!.toString())} onChange={handleStartDateUpdate} dateFormat="MM/dd/yyyy" />
                    </div>
                    <div className="calendar-card__end-date end-date-editable">
                        <span>End date</span>
                        <DatePicker selected={new Date(updatedEvent.endDate!.toString())} onChange={handleEndDateUpdate} dateFormat="MM/dd/yyyy" />
                    </div>
                </div>
                <div className="calendar-card__event-btn">
                <button className="button" type="submit">Confirm</button>
                <button className="button" type="button" onClick={() => cancelEditing()}>Cancel</button>
                </div>
            </form>
        </div>
        </> : 
        <>
        <div className={`calendar-event-card ${popups.isCalendarEventCard ? "calendar-event-card--active" : "calendar-event-card--hidden"}`}>
            <div className="calendar-card__left-content">
                <span>Event name</span>
                <label htmlFor="event__event-Name">
                    <input type="text" value={event?.eventName} id="event__event-Name" readOnly />
                </label>
                <span>Event description</span>
                <label htmlFor="event__event-Description">
                    <input type="text" value={event.eventDescription} id="event__event-Description" readOnly placeholder='Description'/>
                </label>
            </div>
            <div className="calendar-card__right-content">
                <span>Event type</span>
                <label htmlFor="event__event-Type">
                    <input type="text" value={event.eventType!} id="event__event-Type" readOnly placeholder='Event type' />
                </label>
                <span>Assigned user</span>
                <label htmlFor="event__assigned-User">
                    <input type="text" value={event.assignedUser?.userName}  id="event__assigned-User" readOnly />
                </label>
            </div>
            <div className="calendar-card__date-range ">
                <div className="calendar-card__start-date">
                    <span>Start date</span>
                    <label htmlFor="event__event-startDate">
                        <input type="text" value={new Date(event.startDate!).toLocaleString().substring(0, 10)} id="event__event-startDate" />
                    </label>  
                </div>
                <div className="calendar-card__end-date">
                    <span>Finish date</span>
                    <label htmlFor="event__event-endDate">
                        <input type="text" value={new Date(event.endDate!).toLocaleString().substring(0, 10)} id="event__event-endDate" />
                    </label>
                </div>
                
            </div>
        
        <div className="calendar-card__event-btn">
            <button className="button" onClick={() => deleteEvent(eventID!)}>Delete</button>
            <button className="button" onClick={() => openEditEvent(event!)}>Edit</button>
            <button className="button" onClick={() => closeCard()}>Close</button>
            </div>
        </div>
        </>
    }

        </>
    )
}