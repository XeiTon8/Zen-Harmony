import { RootState } from "../../../redux/store";

export const selectDepartments = (state: RootState) => state.Departments.departmentsList;

export const selectDepartmentID = (state: RootState) => state.Departments.selectedDepartmentID;

export const selectDepartmentByID = (id: number) => (state: RootState) => state.Departments.departmentsList.find((department) => department.departmentID === id);