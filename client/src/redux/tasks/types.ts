import { IUser } from "../users/types";

export interface ITask {
    taskID?: number | null;
    taskTitle: string;
    taskDescription: string;
    dateCreated: Date | string | null;
    deadline: Date | string | null;
    status: taskStatus;
    position: number | null;
    taskLabels: ILabel[];
    isArchived: boolean;
    projectID: number | null;
    assignedUsers?: IUser[];
    costs?: number | null;
    comments?: IComment[]
    openCard?: (id: number) => void;
    taskCreatedBy: IUser | null;
    timeSpent?: number | null;
    dateFinished?: Date | string | null;
}

export interface IComment {
    taskID?: number | null
    commentID?: number | null;
    commentText?: string;
    commentCreatedBy: IUser;
}

export enum taskStatus {
    ToDo = "To-Do",
    InProgress = "In Progress",
    OnCheck = "On-Check",
    Done = "Done",
    Archived = "Archived"
}


export enum fetchStatus {
    'LOADING',
    'SUCCESS',
    'ERROR'
}

export interface tasksState {
    allTasks: ITask[],
    filteredTasks: ITask[],
    archivedTasks: ITask[],
    labels: ILabel[],
    userTask: ITask,
    userComment: IComment,
    status: fetchStatus,
    addNewTaskOpened: boolean,
    searchValue: string,
    taskSaved: boolean,
    taskDeleted: boolean,
    isFiltering: boolean,
    isDetailedTaskOpened: boolean,
    isNewComment: boolean,
    selectedDetailedTaskID: number | null
}

export interface ILabel {
    labelName: string;
    labelID?: number;
}