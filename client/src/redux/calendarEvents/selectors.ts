import { RootState } from "../store"

export const selectCalendarEvent = (state: RootState) => state.CalendarEvents.popupCalendarEvent;

export const selectCalendarEventByID = (id: number) => (state: RootState) => state.CalendarEvents.calendarEventList.find((event) => event.eventID === id);

export const selectCalendarEventID = (state: RootState) => state.CalendarEvents.selectedCalendarEventID;

export const selectCalendarEvents = (state: RootState) => state.CalendarEvents.calendarEventList;

export const selectRecentlyAddedEvent = (state: RootState) => state.CalendarEvents.isEventRecentlyAdded;

export const selectIsAddEventEditOpened = (state: RootState) => state.CalendarEvents.isCalendarEventEditOpened;

export const selectIsAddNewEventOpened = (state: RootState) => state.CalendarEvents.isAddEventOpened;

