import { IUser } from "./user";

export interface ITask {
    taskID?: number | null;
    taskTitle: string;
    taskDescription: string;
    dateCreated: Date | string | null;
    deadline: Date | string | null;
    status: taskStatus;
    position: number | null;
    taskLabels: ILabel[] | string;
    isArchived: boolean;
    projectID: number | null;
    assignedUsers?: IUser[] | string;
    costs?: number | null;
    comments?: IComment[]
    openCard?: (id: number) => void;
    taskCreatedBy: IUser | null | string;
    timeSpent?: number | null;
    dateFinished?: Date | string | null;
}

export enum taskStatus {
    ToDo = "To-Do",
    InProgress = "In Progress",
    OnCheck = "On-Check",
    Done = "Done",
    Archived = "Archived"
}

export interface IComment {
    taskID?: number | null
    commentID?: number | null;
    commentText?: string;
    commentCreatedBy: IUser | string;
}

export interface ILabel {
    labelName: string;
    labelID?: number;
}