import { ITask } from "../tasks/types";

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
    users?: IUser[] | null;
    boss?: IUser | null
    subscribedTasks?: ITask[]
    
}

export enum userRoles {
    OWNER = "Owner",
    EXECUTIVE = "Executive",
    EMPLOYEE = "Employee"
}

export interface UsersState {
    currentUser: IUser;
    selectedUserID: string;
    isUserCardOpened: boolean;
    isLoggedIn: boolean;
}
