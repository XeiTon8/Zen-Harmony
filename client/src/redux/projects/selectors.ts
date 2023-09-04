import { RootState } from "../store";
import { IProject } from "./types";


export const selectProjects = (state: RootState) => state.Projects.projectsList;

export const selectProjectByID = (projectId: number) => (state: RootState) => state.Projects.projectsList.find((project: IProject) => project.projectID === projectId)

export const selectSelectedProjectID = (state: RootState) => state.Projects.selectedProjectID;

export const selectSearchProjectValue = (state: RootState) => state.Projects.searchProjectValue;

export const selectIsAddProjectFormOpened = (state: RootState) => state.Projects.isAddNewProjectOpened;