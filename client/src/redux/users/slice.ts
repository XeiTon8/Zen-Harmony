import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { IUser, UsersState } from './types'
import { ITask } from '../tasks/types'
import { MySQLService } from '../../services/MySQLService'
import { RootState } from '../store'

const service = new MySQLService();


const initialState: UsersState = {
    currentUser: {
        userID: "",
        userEmail: "",
        userName: "",
        userRole: "",
        department: "",
        position: "",
        roleID: null,
        positionID: null,
        departmentID: null,
        subscribedTasks: [],
        users: [],
    },
    selectedUserID: "",
    isUserCardOpened: false,
    isLoggedIn: false,
}

export const getUser = createAsyncThunk('users/get User', async (userID: string, { getState }) => {
    try {
        const res = await service.getUser(userID);
        return res.data[0];
    } catch (e: any) {
        throw new Error(e)
    }
})

export const getUsers = createAsyncThunk("Get users", async (_) => {
    try {
        const res = await service.getUsers();
        return res.data;
    } catch (e: any) {
        throw new Error(e);
    }
})

export const subscribeToTaskAsync = createAsyncThunk(
    'user/subscribeToTask',
    async (tasks: ITask[], { getState }) => {
        const state = getState() as RootState;
        let userID = state.User.currentUser.userID;
        while (!userID) {
            const state = getState() as RootState;
            userID = state.User.currentUser.userID;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        await service.subscribeUserToTask(tasks, userID);
        const fetchedUser = await service.getUser(userID!);
        const userToUpdate = fetchedUser.data[0];
        return userToUpdate;
    }
);


const usersSlice = createSlice({
    name: "Users",
    initialState,
    reducers: {

        setUserData(state, action: PayloadAction<IUser>) {
            state.currentUser = action.payload;
        },

        updateUserData(state, action: PayloadAction<IUser>) {
            const updatedUser = action.payload;
            const userIndex = state.currentUser.users?.findIndex((user) => user.userID === updatedUser.userID);
            if (userIndex !== -1) {
                state.currentUser.users![userIndex!] = updatedUser;
            }

        },

        deleteUser(state, action: PayloadAction<string>) {
            const userID = action.payload
            state.currentUser.users = state.currentUser.users?.filter((user) => user.userID !== userID)
        },

        setSelectedUserID(state, action: PayloadAction<string>) {
            state.selectedUserID = action.payload;
        },

        setIsUserCardOpened(state, action: PayloadAction<boolean>) {
            state.isUserCardOpened = action.payload
        },

        setIsLoggedIn(state, action: PayloadAction<boolean>) {
            state.isLoggedIn = action.payload;
        },

        subscribeTask(state, action: PayloadAction<ITask>) {
            state.currentUser.subscribedTasks?.push(action.payload);
        },

        unSubscribeTask(state, action: PayloadAction<ITask>) {
        state.currentUser.subscribedTasks = state.currentUser.subscribedTasks?.filter((task) => task.taskID !== action.payload.taskID);
        }

    },


    extraReducers: (builder) => {
        builder.addCase(getUser.pending, (state) => {
            state.currentUser = {
                userEmail: "",
                userName: "",
                userRole: null,
                department: null,
                position: null,
                roleID: null,
                departmentID: null,
                positionID: null,
                userID: ""
            }
        }),

            builder.addCase(getUser.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.currentUser = action.payload;
            
            }),

            builder.addCase(getUser.rejected, (state, action) => {
                state.currentUser = {
                    userEmail: "",
                    userName: "",
                    userRole: null,
                    department: null,
                    position: null,
                    roleID: null,
                    departmentID: null,
                    positionID: null,
                    userID: ""
                }
                console.log(action.payload)
            }),

            builder.addCase(getUsers.pending, (state) => {
                state.currentUser.users = []
            }),

            builder.addCase(getUsers.fulfilled, (state, action: PayloadAction<IUser[]>) => {
                const users = action.payload;
                users.forEach((user) => {
                    if (user.users === null) {
                        user.users = [];
                    }
                })
                if (state.currentUser.userRole === 'Owner') {
                    const usersToSet = users.filter((user) => user.userRole !== "Owner");
                    state.currentUser.users = usersToSet;
                } else {
                    state.currentUser.users = users;
                }
            

                
            }),

            builder.addCase(getUsers.rejected, (state) => {
                state.currentUser.users = [];
            })

            builder.addCase(subscribeToTaskAsync.fulfilled, (state, action) => {
                state.currentUser = action.payload;
            })


    },
})

export const { setUserData, updateUserData, deleteUser, setSelectedUserID, setIsUserCardOpened, setIsLoggedIn, subscribeTask, unSubscribeTask} = usersSlice.actions;

export default usersSlice.reducer;