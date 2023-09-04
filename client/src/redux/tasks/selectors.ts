import { RootState } from "../store";

export const selectTasks = (state: RootState) => state.userTasks;

export const selectFilteredTasks = (state: RootState) => state.userTasks.filteredTasks;

export const selectArchivedTasks = (state: RootState) => state.userTasks.archivedTasks;

export const selectTaskByID = (id: any) => (state: RootState) => state.userTasks.allTasks.find((task: any) => task.taskID == id);

export const selectSelectedTaskID = (state: RootState) => state.userTasks.selectedDetailedTaskID;

export const selectComment = (state: RootState) => state.userTasks.userComment

export const selectSearchValue = (state: RootState) => state.userTasks.searchValue;

export const selectTaskSaved = (state: RootState) => state.userTasks.taskSaved;

export const selectTaskDeleted = (state: RootState) => state.userTasks.taskDeleted;

export const selectAddTaskOpened = (state: RootState) => state.userTasks.addNewTaskOpened;

export const selectIsDetailedTaskOpened = (state: RootState) => state.userTasks.isDetailedTaskOpened;

export const selectIsFiltering = (state: RootState) => state.userTasks.isFiltering;

export const selectUserTask = (state: RootState) => state.userTasks.userTask;

export const selectLabels = (state: RootState) => state.userTasks.labels;

export const selectIsNewComment = (state: RootState) => state.userTasks.isNewComment;