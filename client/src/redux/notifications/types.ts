export interface INotification {
    notificationID?: number | null;
    userID: string | null;
    projectID: number | null;
    taskID: number | null;
    notificationTaskTitle: string | null;
    notificationContent: string;
    notificationCreateDate: Date | string | null;
    notificationExpireDate: Date | string | null;
    isRead: boolean;
}

export interface NotificationsState {
    notificationsList: INotification[];
    selectedNotificationID: number | null;
    isNewNotification: boolean;
    commentCreatedByID: string;
    taskIDs: {
        notificationTaskIDStack: number[];
        taskIDToAddToStack: number | null;
        taskIDFromStack: number | null;
    }
}
