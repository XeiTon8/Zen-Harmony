import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { MySQLService } from "../../../services/MySQLService";
import { IDepartment } from "./types";



interface DepartmentsState {
    departmentsList: IDepartment[];
    selectedDepartmentID: number | null;
}

const service = new MySQLService();

const initialState: DepartmentsState = {
    departmentsList: [],
    selectedDepartmentID: null,
}

export const fetchDepartments = createAsyncThunk("positions/Get Positions", async (_) => {
    try {
        const res = await service.getDepartments();
        return res.data;

    } catch(e: any) {
        throw new Error(e)
    }
})

const departmentsSlice = createSlice({
    name: "Departments", 
    initialState, 
    reducers: {

        addDepartment(state, action: PayloadAction<IDepartment>) {
            const department = {...action.payload}
            state.departmentsList.push(department)
        },

        updateDepartment(state, action: PayloadAction<IDepartment>) {
            const updatedDepartment = action.payload;
            const departmentToUpdate = state.departmentsList.findIndex((department) => department.departmentID === updatedDepartment.departmentID);
            if (departmentToUpdate !== -1) {
                state.departmentsList[departmentToUpdate] = updatedDepartment;
            }
        },

        deleteUserDepartment(state, action: PayloadAction<number>) {
            state.departmentsList = state.departmentsList.filter((department) => department.departmentID !== action.payload);
        },

        setSelectedDepartmentID(state, action: PayloadAction<number>) {
            state.selectedDepartmentID = action.payload;
        }

    },

    extraReducers(builder) {
        builder.addCase(fetchDepartments.pending, (state) => {
            state.departmentsList = []
        }),

        builder.addCase(fetchDepartments.fulfilled, (state, action) => {
            state.departmentsList = action.payload;
        }),

        builder.addCase(fetchDepartments.rejected, (state) => {
            state.departmentsList = [];
        })
    },

})

export const {addDepartment, updateDepartment, deleteUserDepartment, setSelectedDepartmentID} = departmentsSlice.actions;

export default departmentsSlice.reducer;