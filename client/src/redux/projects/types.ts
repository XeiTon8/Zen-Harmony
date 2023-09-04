import { ICustomer } from "../customers/types";

export interface IProject {
    projectID: number | null,
    projectName: string,
    dateCreated: Date | null,
    userID?: string | null,
    customer?: ICustomer | null
}

export interface projectsState {
    projectsList: IProject[];
    selectedProjectID: number | null;
    searchProjectValue: string;
    isAddNewProjectOpened: boolean;
}