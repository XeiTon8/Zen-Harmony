import { IDepartment } from "../users/departments/types";
import { IPosition } from "../users/positions/types";
import { IUser } from "../users/types";

export interface ICalendarEvent {
    eventID?: number;
    eventName: string;
    eventDescription: string;
    eventType: CalendarEventTypes | null;
    startDate: Date | null | string;
    endDate: Date | null | string;
    assignedUser: IUser | null;
    allowedDepartments?: IDepartment[] | string;
    allowedRoles?: IPosition[] | string;
}

export interface IDay {
    day: number;
    month: number;
    dayID: number;
    events: ICalendarEvent[]
}

export enum CalendarEventTypes {
    VACATION = 'Vacation',
    MEETING = 'Meeting',
    BIRTHDAY = 'Birthday'
}

export interface CalendarEventState {
    calendarEventList: ICalendarEvent[];
    popupCalendarEvent: ICalendarEvent;
    isAddEventOpened: boolean;
    isCalendarEventEditOpened: boolean;
    isEventRecentlyAdded: boolean;
    selectedCalendarEventID: number | null;
}