import { RootState } from "../../../redux/store";

export const selectPositions = (state: RootState) => state.Positions.positionsList;

export const selectPositionID = (state: RootState) => state.Positions.selectedPositionID;

export const selectPositionByID = (id: number) => (state: RootState) => state.Positions.positionsList.find((position) => position.positionID === id);