import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MySQLService } from '../../services/MySQLService';
import { ITask, IComment, ILabel, fetchStatus, taskStatus, tasksState } from './types'
import { IUser } from '../users/types';
import { ITimer } from '../../context/generalContext';
import { RootState } from '../store';

interface SetUserTaskPayload {
  name: string;
  value?: string;
  dateValue?: Date | string | null;
}

interface MoveTaskPayload {
  taskId: number;
  targetId: number;
}

const initialState: tasksState = {
  allTasks: [],
  filteredTasks: [],
  archivedTasks: [],
  labels: [],
  userTask: {
    taskTitle: "",
    taskDescription: "",
    dateCreated: null,
    deadline: null,
    status: taskStatus["ToDo"],
    position: null,
    taskLabels: [],
    isArchived: false,
    projectID: null,
    assignedUsers: [],
    costs: null,
    comments: [],
    taskCreatedBy: null,
    timeSpent: null,
    dateFinished: null,

  },
  userComment: {
    taskID: null,
    commentID: null,
    commentText: "",
    commentCreatedBy: {
      userName: "",
      userEmail: "",
      userRole: "",
      userID: "",
    }
  },
  status: fetchStatus.LOADING,
  addNewTaskOpened: false,
  searchValue: "",
  taskSaved: false,
  taskDeleted: false,
  isFiltering: false,
  isDetailedTaskOpened: false,
  isNewComment: false,
  selectedDetailedTaskID: null,
}

const service = new MySQLService();

export const addCommentAsync = createAsyncThunk(
  'comments/addComment',
  async ({projectID, taskID, comment }: {projectID: number, taskID: number, comment: IComment }, { getState }) => {
    console.log("addCommentAsync running");    
    const state = getState() as RootState;
    const res = await service.addComment(state.User.currentUser.userID!, projectID!, taskID, comment);
    console.log(res);
    return res.commentID;
  }
);

export const deleteCommentAsync = createAsyncThunk(
  'comments/deleteComment',
  async ({ projectID, taskID, commentID }: { projectID: number, taskID: number, commentID: number }) => {
    return { projectID, taskID, commentID };
  }
);


export const fetchArchivedTasks = createAsyncThunk('tasks/fetch Archived', async (_) => {
  const res = await service.getAllArchivedTasks();
  return res.data;
})

export const fetchAllTaks = createAsyncThunk('tasks/ fetch All', async (_) => {
  try {
    const res = await service.getAllTasks();
    return res.data;


  } catch (e: any) {
    throw new Error(e);
  }
})

export const fetchLabels = createAsyncThunk('tasks/fetch Labels', async (_) => {
  try {
    const res = await service.getLabels();
    return res.data;
  } catch (e: any) {
    throw new Error(e.message)
  }

})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<ITask>) {
      const newTask = { ...action.payload };
      state.allTasks.push(newTask);

      const newTaskIndex = state.allTasks.length - 1;
      state.allTasks = state.allTasks.map((task, index) => {
        if (index === newTaskIndex) {
          return {
            ...task,
            position: newTaskIndex,
          };
        } else if (index >= newTaskIndex) {
          return {
            ...task,
            position: task.position! + 1,
          };
        } else {
          return task;
        }
      });

      return state;
    },

    removeTask(state, action: PayloadAction<number>) {
      state.allTasks = state.allTasks.filter((task: ITask) => task.taskID !== action.payload);

    },

    updateTask(state, action: PayloadAction<ITask>) {
      const updatedTask = action.payload;
      const taskIndex = state.allTasks.findIndex((task) => task.taskID === updatedTask.taskID);
      if (taskIndex !== -1) {
        state.allTasks[taskIndex] = updatedTask;
      }
    },

    clearTask(state) {
      state.userTask = {
        taskTitle: "",
        taskDescription: "",
        dateCreated: null,
        deadline: null,
        status: taskStatus["ToDo"],
        position: null,
        taskLabels: [],
        isArchived: false,
        projectID: null,
        assignedUsers: [],
        costs: null,
        comments: [],
        taskCreatedBy: null,
        timeSpent: null,
        dateFinished: null,
      }
    },
    addComment(state, action: PayloadAction<{ taskID: number, comment: IComment }>) {
      try {
        const { taskID, comment } = action.payload;
        console.log(state.allTasks);
        console.log(state);
        if (state.allTasks) {
          const task = state.allTasks.find((task) => task.taskID === Number(taskID));
          console.log(task);
          if (task) {
            task.comments = task.comments ? [...task.comments, comment] : [comment]
          }
        } 
      } catch(e: any) {
        console.error(e);
      }
    },

    removeComment(state, action: PayloadAction<{ taskID: number, commentID: number }>) {
      console.log(action.payload);
      const task = state.allTasks.find((task) => task.taskID === action.payload.taskID);
      console.log(task);
      if (task) {
        console.log(task);
        task.comments = task.comments?.filter((comment) => comment.commentID !== action.payload.commentID)
      }
    },

    updateComment(state, action: PayloadAction<IComment>) {
      const { taskID, commentID, commentText } = action.payload;
      const task = state.allTasks.find((t) => t.taskID === taskID);
      if (task) {
        const comment = task.comments!.find((commentToFind) => commentToFind.commentID === commentID);
        if (comment) {
          comment.commentText = commentText;
        }
      }
    },

    setUserComment(state, action: PayloadAction<string>) {
      state.userComment = {
        ...state.userComment,
        commentText: action.payload,
      }
    },

    setUserCommentUser(state, action: PayloadAction<IUser>) {
      state.userComment = {
        ...state.userComment,
        commentCreatedBy: action.payload,
      }
    },

    setIsNewComment(state, action: PayloadAction<boolean>) {
      state.isNewComment = action.payload
    },

    updateSearchValue(state, action: PayloadAction<string>) {
      state.searchValue = action.payload;
    },

    setTaskSaved(state, action: PayloadAction<boolean>) {
      state.taskSaved = action.payload;
    },

    setTaskDeleted(state, action: PayloadAction<boolean>) {
      state.taskDeleted = action.payload;
    },

    setUserTask(state, action: PayloadAction<SetUserTaskPayload>) {
      const { name, value, dateValue } = action.payload;
      if (name === 'deadline') {
        state.userTask = {
          ...state.userTask,
          deadline: dateValue!
        };
      } else {
        state.userTask = {
          ...state.userTask,
          [name]: value,
        };
      }
    },

    setPassedTime(state, action: PayloadAction<ITimer>) {
      const { timerTaskID, passedTime } = action.payload;
      const task = state.allTasks.find((task) => task.taskID === timerTaskID);
      if (task) {
        task.timeSpent = passedTime;
      }
    },

    setAddTaskOpened(state, action: PayloadAction<boolean>) {
      state.addNewTaskOpened = action.payload;
    },

    setUserStatus(state, action: PayloadAction<taskStatus>) {
      state.userTask = {
        ...state.userTask,
        status: action.payload
      }
    },

    moveTask(state, action: PayloadAction<MoveTaskPayload>) {
      const { taskId, targetId } = action.payload;
      const { allTasks } = state;
      const taskIndex = allTasks.findIndex((userTask) => userTask.taskID === taskId);
      const targetIndex = allTasks.findIndex((userTask) => userTask.taskID === targetId);

      if (taskIndex !== -1 && targetIndex !== -1) {
        const taskPosition = allTasks[taskIndex].position;
        const targetPosition = allTasks[targetIndex].position;

        state.allTasks = allTasks.map((userTask) => {
          if (userTask.taskID === taskId) {
            return { ...userTask, position: targetPosition };
          } else if (userTask.taskID === targetId) {
            return { ...userTask, position: taskPosition };
          }
          return userTask;
        });
        state.allTasks.sort((a, b) => a.position! - b.position!);
      }

    },

    filterTasksByStatus(state, action: PayloadAction<taskStatus>) {
      state.filteredTasks = state.allTasks.filter((task) => task.status === action.payload);
    },

    filterTasksByLabels(state, action: PayloadAction<number>) {
      const labelID = action.payload;
      state.filteredTasks = state.allTasks.filter((task) =>
        task.taskLabels.some((label) => label.labelID === labelID)
      );
    },

    filterTasksByDate(state, action: PayloadAction<string>) {
      const optionValue = action.payload;
      const taskDeadline = new Date();
      taskDeadline.setHours(0, 0, 0, 0);

      if (optionValue.includes("Today")) {
        const todayTasks = state.allTasks.filter((task) => {
          const taskDate = new Date(task.deadline!);
          return (
            taskDate.getFullYear() == taskDeadline.getFullYear() &&
            taskDate.getDate() == taskDeadline.getDate() &&
            taskDate.getMonth() == taskDeadline.getMonth()
          )
        });
        state.filteredTasks = todayTasks;
      } else if (optionValue.includes("This week")) {
        const currentWeek = taskDeadline.getDate();
        const endOfWeek = new Date(taskDeadline.getTime());
        endOfWeek.setDate(currentWeek + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        state.filteredTasks = state.allTasks.filter((task) => {
          const taskDate = new Date(task.deadline!);
          return taskDate >= taskDeadline && taskDate <= endOfWeek

        });
      } else if (optionValue.includes("Tomorrow")) {
        const currentWeek = taskDeadline.getDate();
        const tomorrowDay = new Date(taskDeadline.getTime());
        tomorrowDay.setDate(currentWeek + 1);
        tomorrowDay.setHours(23, 59, 59, 999);

        state.filteredTasks = state.allTasks.filter((task) => {
          const date = new Date(task.deadline!);
          return date >= taskDeadline && date <= tomorrowDay;
        })
      }
    },

    setIsFiltering(state, action: PayloadAction<boolean>) {
      state.isFiltering = action.payload;
    },

    setSelectedTaskID(state, action: PayloadAction<number>) {
      state.selectedDetailedTaskID = action.payload;
    },

    setIsDetailedTaskOpened(state, action: PayloadAction<boolean>) {
      state.isDetailedTaskOpened = action.payload;
    },

    finishTask(state, action: PayloadAction<ITask>) {
      state.archivedTasks.push(action.payload);
    },

    addLabel(state, action: PayloadAction<ILabel>) {
      state.labels.push(action.payload);
    },

    deleteLabel(state, action: PayloadAction<number>) {
      const labelIndex = state.userTask.taskLabels.findIndex((label) => label.labelID === action.payload)
      if (labelIndex !== -1) {
        state.userTask.taskLabels = state.userTask.taskLabels.filter((label) => label.labelID !== action.payload)
      }
    },

    setLabelToTask(state, action: PayloadAction<ILabel>) {
      state.userTask.taskLabels.push(action.payload);
    },

    setUserToTask(state, action: PayloadAction<IUser>) {
      state.userTask.assignedUsers?.push(action.payload);
    }

  },
  extraReducers: (builder) => {

    builder.addCase(fetchLabels.pending, (state) => {
      state.labels = [];
    })

    builder.addCase(fetchLabels.fulfilled, (state, action) => {
      state.labels = action.payload;
    })

    builder.addCase(fetchLabels.rejected, (state) => {
      state.labels = []
    })

    builder.addCase(fetchArchivedTasks.pending, (state) => {
      state.archivedTasks = []
    })

    builder.addCase(fetchArchivedTasks.fulfilled, (state, action) => {
      state.archivedTasks = action.payload;
    })

    builder.addCase(fetchArchivedTasks.rejected, (state) => {
      state.archivedTasks = []
    })

    builder.addCase(fetchAllTaks.pending, (state) => {
      state.allTasks = [];
    })

    builder.addCase(fetchAllTaks.fulfilled, (state, action) => {
      state.allTasks = action.payload;
      const tasksWithPositions = state.allTasks.map((task, index) => ({
        ...task,
        position: index,
      }));
      state.allTasks = tasksWithPositions;
    })

    builder.addCase(fetchAllTaks.rejected, (state) => {
      state.allTasks = []
    })

    builder.addCase(addCommentAsync.fulfilled, (state, action) => {
      console.log(action.payload);
      return {
        ...state,
        
      }
    })

    builder.addCase(deleteCommentAsync.fulfilled, (state, action) => {
      const task = state.allTasks.find((task) => task.taskID === action.payload.taskID);
      console.log(task);
      if (task) {
        console.log(task);
        task.comments = task.comments?.filter((comment) => comment.commentID !== action.payload.commentID)
      }
    })
  }
})

export const {
  addTask,
  removeTask,
  updateTask,
  clearTask,
  addComment,
  removeComment,
  updateComment,
  updateSearchValue,
  setTaskSaved,
  setTaskDeleted,
  setUserStatus,
  setUserTask,
  setUserComment,
  setUserCommentUser,
  setIsNewComment,
  setAddTaskOpened,
  setPassedTime,
  moveTask,
  filterTasksByStatus,
  filterTasksByLabels,
  filterTasksByDate,
  setIsFiltering,
  setSelectedTaskID,
  setIsDetailedTaskOpened,
  finishTask,
  addLabel,
  deleteLabel,
  setLabelToTask,
  setUserToTask } = tasksSlice.actions;

export default tasksSlice.reducer;