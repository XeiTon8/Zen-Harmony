import { ITask } from "./task";
export interface IUser {
    userID?: string;
    userEmail: string;
    userName: string;
    userRole: string | null;
    department?: string | null;
    position?: string | null;
    roleID?: number | null;
    departmentID?: number | null;
    positionID?: number | null;
    users?: IUser[] | null | string;
    boss?: IUser | null | string;
    subscribedTasks?: ITask[] | string;
    
}
