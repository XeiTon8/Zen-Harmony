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