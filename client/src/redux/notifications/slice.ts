import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { INotification, NotificationsState } from './types';
import { MySQLService } from '../../services/MySQLService';

const initialState: NotificationsState = {
    notificationsList: [],
    selectedNotificationID: null,
    isNewNotification: false,
    taskIDs: {
        notificationTaskIDStack: [],
        taskIDToAddToStack: null,
        taskIDFromStack: null,
    },
    commentCreatedByID: "",
}

const service = new MySQLService();

export const fetchNotifications = createAsyncThunk("Notifications / get all", async () => {
    try {
        const res = await service.getNotifications();
        return res.data;
    } catch(e: any) {
    throw new Error(e);
    }
})

const NotificationsSlice = createSlice({
    name: "Notifications",
    initialState,
    reducers: {
        addNotification(state, action: PayloadAction<INotification>) {
            state.notificationsList.push(action.payload);
        },

        setIsNewNotification(state, action: PayloadAction<boolean>) {
            state.isNewNotification = action.payload;
        },

        setNotificationLastTaskID(state, action: PayloadAction<number>) {
            state.taskIDs.taskIDFromStack = action.payload
        },

        setTaskIDAddToStack(state, action: PayloadAction<number>) {
            console.log("TaskIDToStack payload: ", action.payload)
            state.taskIDs.taskIDToAddToStack = action.payload;
        },

        setCommentCreatedByID(state, action: PayloadAction<string>) {
            state.commentCreatedByID = action.payload;
        },

        clearNotificationLastTaskID(state) {
            state.taskIDs.taskIDFromStack = null;
        },

        clearSubscribedTasksStack(state) {
            state.taskIDs.notificationTaskIDStack = []
        },

        addNewTaskIDToStack(state, action: PayloadAction<number>) {
            state.taskIDs.notificationTaskIDStack.push(action.payload);
        
        }

    },

    extraReducers(builder) {
        
        builder.addCase(fetchNotifications.pending, (state) => {
            state.notificationsList = []
        })

        builder.addCase(fetchNotifications.fulfilled, (state, action) => {
            state.notificationsList = action.payload;
        })

        builder.addCase(fetchNotifications.rejected, (state) => {
            state.notificationsList = []
        })
    },
})

export default NotificationsSlice.reducer;

export const {
    addNotification, addNewTaskIDToStack, setCommentCreatedByID, setIsNewNotification, setNotificationLastTaskID, setTaskIDAddToStack, 
    clearNotificationLastTaskID, clearSubscribedTasksStack} = NotificationsSlice.actions;