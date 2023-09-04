import React from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../../context/generalContext';

import { useAppDispatch } from '../../redux/hooks';
import { useSelector } from 'react-redux';
import { selectCalendarEventByID, selectCalendarEventID, selectCalendarEvents, selectRecentlyAddedEvent } from '../../redux/calendarEvents/selectors';
import { fetchCalendarEvents, setIsAddEventOpened, setSelectedCalendarEventID } from '../../redux/calendarEvents/slice';
import { IDay } from '../../redux/calendarEvents/types';
import { CalendarEventTypes, ICalendarEvent } from '../../redux/calendarEvents/types';

import { Overlay } from '../overlay';
import { AddCalendarEvent } from '../popups/addEvent';
import { CalendarEventCard } from './calendarEventCard';


import './calendar.scss'

export interface IRow {
  row: IDay[]
}

export const CalendarComponent = () => {
    const dispatch = useAppDispatch();
    const calendarEvents = useSelector(selectCalendarEvents);
    const selectedEventID = useSelector(selectCalendarEventID);
    const selectedEvent = useSelector(selectCalendarEventByID(selectedEventID!));

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const currentDate = new Date();
    const [currentMonth, setCurrentMonth] = React.useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = React.useState(currentDate.getFullYear());

    const [calendarRows, setCalendarRows] = React.useState<IRow[] | null>(null)
    const [days, setDays] = React.useState<IDay[]>([])


    const {popups} = React.useContext(AppContext)
    const [done, setDone] = React.useState(false);

    // Get days for rows
    React.useEffect(() => {
      const daysArr = getDaysArray();
      setDays(daysArr);
      console.log("Days set");

    }, [currentMonth, currentYear]);
    
    // Create rows
    React.useEffect(() => {
      if (days && days.length > 0) {
        const rows: IRow[] = renderRows();
        if (rows.length > 0 ) {
          setCalendarRows(rows);
          console.log("Rows set: ", rows);
        }
          
      }
    }, [days]);

    // Fetch events from backend
    React.useEffect(() => {
      const fetchEvents =  async() => {
        await dispatch(fetchCalendarEvents());
        setDone(true);
      }
      
      fetchEvents();
    }, []);
    
    // Set events to days
    React.useEffect(() => {
      if (done) {
        setEventsToDays(days);
      }
    }, [done, days]);


    const addSingleEventToDays = (event: ICalendarEvent) => {
      if (calendarRows !== null) {
        const rowsCopy = [...calendarRows];
        if (event.startDate !== null && event.endDate !== null) {
            let startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);

            while (startDate.toISOString() <= endDate.toISOString()) {
                const day = startDate.getDate();
                const month = startDate.getMonth() + 1;
                rowsCopy.forEach((week) => {
                    week.row.forEach((dayItem) => {
                        if (dayItem.day === day && dayItem.month + 1 === month) {
                            const updatedEvents = [...dayItem.events, event];
                            dayItem.events = updatedEvents;
                        }
                    });
                });
                startDate.setDate(startDate.getDate() + 1); 
            }
        }
        setCalendarRows([...rowsCopy])
      }
  }

  const setEventsToDays = async (updatedDays: any) => {
    if (updatedDays !== null && calendarRows !== null) {
      const updatedCalendarRows = [...calendarRows];
      updatedCalendarRows.forEach((week) => {
        week.row.forEach((dayItem) => {
          dayItem.events = [];
        });
      });
  
      calendarEvents.forEach((event) => {
        const { startDate, endDate } = event;
        let currentDate = new Date(startDate!);
        const newEndDate = new Date(endDate!);
  
        while (currentDate <= newEndDate) {
          const day = currentDate.getDate();
          const month = currentDate.getMonth();
          if (month === currentMonth) {
            updatedCalendarRows.forEach((week) => {
              week.row.forEach((dayItem) => {
                if (dayItem.day === day && dayItem.month === month) {
                  if (!dayItem.events.some((e) => e.eventID === event.eventID)) {
                    const updatedEvents = [...dayItem.events, event];
                    dayItem.events = updatedEvents;
                  }
                }
              });
            });
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
  
      setCalendarRows(updatedCalendarRows);
    }
  };

  const getDaysArray = () => {
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const daysInPrevMonth = getDaysInMonth(currentMonth - 1, currentYear);
    const daysInCurrMonth = getDaysInMonth(currentMonth, currentYear);
    const daysArray = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      daysArray.push({
        day: daysInPrevMonth - i,
        month: currentMonth - 1,
        dayID: i,
        events: []
      });
    }

    for (let i = 1; i <= daysInCurrMonth; i++) {
      daysArray.push({
        day: i,
        month: currentMonth,
        dayID: i,
        events: []
      });
    }

    let nextMonthDay = 1;
    while (daysArray.length % 7 !== 0) {
      daysArray.push({
        day: nextMonthDay,
        month: currentMonth + 1,
        dayID: nextMonthDay,
        events: []
      });
      nextMonthDay++;
    }
  return [...daysArray];
  };

  const renderRows = () => {
    const rows: IRow[] | null = [];
    let row = [];
    for (let i = 0; i < days.length; i++) {
      row.push(days[i]);
      if ((i + 1) % 7 === 0) {
        rows.push({row: row});
        row = [];
      }
    }
  return rows
  }
  
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((prevYear) => prevYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((prevYear) => prevYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  
  };

  const getDaysInMonth = (month: any, year: any) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: any, year: any) => {
    return new Date(year, month, 0).getDay();
  };

  const getMonthName = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[currentMonth];
  };

  const renderDaysOfWeek = () => {
        return daysOfWeek.map((day) => {
            return (
                <th className="calendar__days-of-week">{day}</th>
            )
        }) 
    }

  const renderMonthName = () => {
      const currentMonthName = getMonthName();
      return (
        <span>{currentMonthName}</span>
      )
    }

  const callCalendarPopup = (month: any, day: any) => {
        dispatch(setIsAddEventOpened(true));
        popups.setIsOverlay(true);
    }

  const getEventClass = (events: ICalendarEvent[]): string => {
      const eventTypes = events.map((event) => event.eventType);

      if (eventTypes.includes(CalendarEventTypes['VACATION'])) {
          return 'vacation-event';
      } else if (eventTypes.includes(CalendarEventTypes['MEETING'])) {
          return 'meeting-event';
      } else if (eventTypes.includes(CalendarEventTypes['BIRTHDAY'])) {
          return 'birthday-event';
      }
      return '';
  };
  
  const openCalendarEventCard = (eventID: number, dayID: number) => {
    dispatch(setSelectedCalendarEventID(eventID));
    popups.setIsCalendarEventCard(true);
  }

  const renderCalendar = () => {
    if (calendarRows !== null) {
      return calendarRows.map((week: IRow, weekIndex: number) => {
        return (
          <tr key={weekIndex}>
          {week.row.map((dayItem: IDay, dayIndex: number) => (
            <td className="calendar__day" key={dayIndex} onClick={() => callCalendarPopup(dayItem.month, dayItem.day)} >
              {dayItem.month === currentMonth ? (
                <div>{dayItem.day}

                    {dayItem.events.map((event) => {

                        const eventClasses = getEventClass([event]);
                        const currentDay = new Date();
                        currentDay.setDate(dayItem.day);

                        const currentDateDay = currentDay.getDate();
                        const eventDate = new Date(event.startDate!);
                        
                        const dateToCompare = eventDate.getDate()

                        if (currentDateDay === dateToCompare) {
                          return (
                            <div  onClick={(e) => {e.stopPropagation(); openCalendarEventCard(event.eventID!, dayItem.dayID);}} className={`calendar__day-event ${eventClasses}`}>
                              <p>{event.eventName}</p>
                              <p>{event.assignedUser?.userName}</p>
                            </div>
                          )
                        } else {
                          return (
                            <>
                            <div className={`calendar__day-event ${eventClasses}`}></div>
                            </>
                          )
                        } 
                      })}
                </div>
              ) : (
                <div className={`calendar__day-event ${getEventClass(dayItem.events)}`} >{dayItem.day}</div>
              )}
            </td>
          ))}
        </tr>
        )
      })
    }
  }
    return (
        <div className="calendar__container">
          <div className="calendar__content-wrapper">
            <div className="calendar__current-date">
            <button className="button" onClick={() => handlePrevMonth()}>Previous</button>
              {renderMonthName()}
            <button className="button" onClick={() => handleNextMonth()}>Next</button>
            </div>
          <table className="calendar__table">
                <thead>
                    {renderDaysOfWeek()}
                </thead>
                <tbody>
                  {renderCalendar()}
                </tbody>
            </table>
          </div>
        
          <Overlay />
          {calendarRows !== null && (
            <>
              <AddCalendarEvent rows={calendarRows}  setCalendarRows={setCalendarRows} addSingleEventToDays={addSingleEventToDays}/>
              <CalendarEventCard 
              rows={calendarRows} 
              days={days}
              setDays={setDays}
              setCalendarRows={setCalendarRows}
              eventName={selectedEvent?.eventName!}
              eventDescription={selectedEvent?.eventDescription!}
              eventType={selectedEvent?.eventType!}
              eventID={selectedEvent?.eventID}
              startDate={selectedEvent?.startDate!}
              endDate={selectedEvent?.endDate!}
              assignedUser={selectedEvent?.assignedUser!} 
              />
            </>
          )}
        </div>
          
    )
}