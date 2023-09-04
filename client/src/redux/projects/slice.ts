import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProject, projectsState } from './types';
import { MySQLService } from '../../services/MySQLService';

const service = new MySQLService();

export const fetchProjects = createAsyncThunk('Projects / fetch Projects', async () => {
    try {
        const res = await service.getProjects();
        return res.data;


    } catch (e) {
        console.error(e)
    }
})

const initialState: projectsState = {
    projectsList: [],
    selectedProjectID: null,
    searchProjectValue: "",
    isAddNewProjectOpened: false,
}

const projectsSlice = createSlice({
    name: 'Projects',
    initialState,
    reducers: {
        addProject(state, action: PayloadAction<IProject>) {
            state.projectsList.push(action.payload);

        },

        deleteUserProject(state, action: PayloadAction<number>) {
            state.projectsList = state.projectsList.filter((project: IProject) => project.projectID !== action.payload)
        },

        updateUserProject(state, action: PayloadAction<IProject>) {
            const updatedProject = action.payload;
            const projectIndex = state.projectsList.findIndex((project) => project.projectID === updatedProject.projectID);
            if (projectIndex !== 1) {
                state.projectsList[projectIndex] = updatedProject;
            }

        },

        setSelectedProjectID(state, action: PayloadAction<number>) {
            state.selectedProjectID = action.payload;
        },

        updateSearchProjectValue(state, action: PayloadAction<string>) {
            state.searchProjectValue = action.payload;
        },

        setIsAddNewProjectOpened(state, action: PayloadAction<boolean>) {
            state.isAddNewProjectOpened = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder.addCase(fetchProjects.pending, (state) => {
            state.projectsList = []
        }),

            builder.addCase(fetchProjects.fulfilled, (state, action) => {
                state.projectsList = action.payload;
            }),

            builder.addCase(fetchProjects.rejected, (state) => {
                state.projectsList = []
            })
    }


})

export const { addProject, deleteUserProject, updateUserProject, setSelectedProjectID, setIsAddNewProjectOpened, updateSearchProjectValue } = projectsSlice.actions;

export default projectsSlice.reducer;