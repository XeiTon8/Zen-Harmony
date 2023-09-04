import { configureStore } from "@reduxjs/toolkit";
import userTasks from './tasks/slice';
import User from './users/slice'
import Projects from './projects/slice';
import Departments from './users/departments/slice'
import Positions from './users/positions/slice'
import CalendarEvents from './calendarEvents/slice'
import Customers from './customers/slice'
import Notifications from './notifications/slice'

export const store = configureStore({
    reducer: {
userTasks,
User,
Projects,
Departments,
Positions,
CalendarEvents,
Customers,
Notifications,
},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch