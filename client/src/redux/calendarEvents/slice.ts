import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICalendarEvent, CalendarEventState, CalendarEventTypes } from "./types";
import { MySQLService } from "../../services/MySQLService";
import { IUser } from "../users/types";

interface setCalendarEventPayload {
    name: string;
    value?: string;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
}

const service = new MySQLService();

const initialState: CalendarEventState = {
    calendarEventList: [],
    popupCalendarEvent: {
        eventName: "",
        eventDescription: "",
        startDate: new Date().toString(),
        endDate: new Date().toString(),
        eventType: null,
        assignedUser: null,
        allowedDepartments: [],
        allowedRoles: []
    },
    isAddEventOpened: false,
    isCalendarEventEditOpened: false,
    isEventRecentlyAdded: false,
    selectedCalendarEventID: null,
}

export const fetchCalendarEvents = createAsyncThunk('Calendar Events / fetch', async (_) => {
    try {
        const res = await service.getAllCalendarEvents();
        return res.data;
    } catch (e: any) {
        throw new Error(e)
    }
})

export const calendarEventSlice = createSlice({
    name: "Calendar Event",
    initialState,
    reducers: {
        addCalendarEvent(state, action: PayloadAction<ICalendarEvent>) {
            state.calendarEventList.push(action.payload);
        },

        updateCalendarEvent(state, action: PayloadAction<ICalendarEvent>) {
            const updatedEvent = action.payload;
            const eventIndex = state.calendarEventList.findIndex((event) => event.eventID === updatedEvent.eventID);
            if (eventIndex !== -1) {
                state.calendarEventList[eventIndex] = updatedEvent;
            }
        },

        deleteCalendarEvent(state, action: PayloadAction<number>) {
            state.calendarEventList.filter((event) => event.eventID !== action.payload);
        },

        setSelectedCalendarEventID(state, action: PayloadAction<number>) {
            state.selectedCalendarEventID = action.payload;
        },

        setCalendarEventData(state, action: PayloadAction<setCalendarEventPayload>) {
            const { name, value, startDate, endDate } = action.payload;

            if (name === 'startDate') {
                state.popupCalendarEvent = {
                    ...state.popupCalendarEvent,
                    startDate: startDate!

                }
            } else if (name === 'endDate') {
                state.popupCalendarEvent = {
                    ...state.popupCalendarEvent,
                    endDate: endDate!
                }
            } else {
                state.popupCalendarEvent = {
                    ...state.popupCalendarEvent,
                    [name]: value
                }
            }
        },

        setCalendarEventType(state, action: PayloadAction<CalendarEventTypes>) {
            state.popupCalendarEvent = {
                ...state.popupCalendarEvent,
                eventType: action.payload
            }
        },

        setCalendarEventAssignedUser(state, action: PayloadAction<IUser>) {
            state.popupCalendarEvent = {
                ...state.popupCalendarEvent,
                assignedUser: action.payload
            }
        },

        setRecentlyAddedEvent(state, action: PayloadAction<boolean>) {
            state.isEventRecentlyAdded = action.payload;
        },

        setIsAddEventOpened(state, action: PayloadAction<boolean>) {
            state.isAddEventOpened = action.payload;
        },

        clearCalendarForm(state) {
            state.popupCalendarEvent = {
                eventName: "",
                eventDescription: "",
                startDate: new Date().toString(),
                endDate: new Date().toString(),
                eventType: null,
                assignedUser: null,
                allowedDepartments: [],
                allowedRoles: []

            }
        },

    },

    extraReducers(builder) {
        builder.addCase(fetchCalendarEvents.pending, (state) => {
            state.calendarEventList = []
        }),

            builder.addCase(fetchCalendarEvents.fulfilled, (state, action) => {
                state.calendarEventList = action.payload;
            }),

            builder.addCase(fetchCalendarEvents.rejected, (state) => {
                state.calendarEventList = []
            })
    },
})

export const {
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    setCalendarEventData,
    setCalendarEventType,
    setCalendarEventAssignedUser,
    setRecentlyAddedEvent,
    setIsAddEventOpened,
    setSelectedCalendarEventID,
    clearCalendarForm
} = calendarEventSlice.actions;
export default calendarEventSlice.reducer;