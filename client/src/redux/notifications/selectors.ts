import { RootState } from "../store";

export const selectNotifications = (state: RootState) => state.Notifications.notificationsList;

export const selectTaskIDFromStack = (state: RootState) => state.Notifications.taskIDs.taskIDFromStack;

export const selectIsNewNotification = (state: RootState) => state.Notifications.isNewNotification;

export const selectNotificationTaskIDStack = (state: RootState) => state.Notifications.taskIDs.notificationTaskIDStack;

export const selectTaskIDAddToStack = (state: RootState) => state.Notifications.taskIDs.taskIDToAddToStack;

export const selectCommentCreatedBy = (state: RootState) => state.Notifications.commentCreatedByID;