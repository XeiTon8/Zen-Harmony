import { RootState } from "../store";

export const selectUserID = (state: RootState) => state.User.currentUser.userID;

export const selectUser = (state: RootState) => state.User.currentUser;

export const selectUsers = (state: RootState) => state.User.currentUser.users;

export const selectUserByID = (userID: string) => (state: RootState) => state.User.currentUser.users?.find((user) => user.userID === userID)

export const selectSelectedUserID = (state: RootState) => state.User.selectedUserID;

export const selectIsUserCardOpened = (state: RootState) => state.User.isUserCardOpened;

export const selectIsLoggedIn = (state: RootState) => state.User.isLoggedIn;

export const selectSubscribedTasks = (state: RootState) => state.User.currentUser.subscribedTasks;