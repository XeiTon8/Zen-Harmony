import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { MySQLService } from "../../../services/MySQLService";
import { IPosition } from "./types";

interface PositionsState {
    positionsList: IPosition[];
    selectedPositionID: number | null;
}

const service = new MySQLService();

const initialState: PositionsState = {
    positionsList: [],
    selectedPositionID: null,
}

export const fetchPositions = createAsyncThunk("positions/Fetch positions", async (_) => {
    try {
        const res = await service.getPositions();
        return res.data;

    } catch (e: any) {
        throw new Error(e)
    }
})

const positionsSlice = createSlice({
    name: "Positions",
    initialState,
    reducers: {
        addPosition(state, action: PayloadAction<IPosition>) {
            state.positionsList.push(action.payload)
        },

        updatePosition(state, action: PayloadAction<IPosition>) {
            const updatedPosition = action.payload;
            const positionToUpdate = state.positionsList.findIndex((position) => position.positionID === updatedPosition.positionID);
            if (positionToUpdate !== -1) {
                state.positionsList[positionToUpdate] = updatedPosition
            }
        },

        deleteUserPosition(state, action: PayloadAction<number>) {
            state.positionsList = state.positionsList.filter((position) => position.positionID !== action.payload)
        },

        setSelectedPositionID(state, action: PayloadAction<number>) {
            state.selectedPositionID = action.payload
        }
    },

    extraReducers(builder) {
        builder.addCase(fetchPositions.pending, (state) => {
            state.positionsList = [];
        }),

            builder.addCase(fetchPositions.fulfilled, (state, action) => {
                state.positionsList = action.payload;
            }),

            builder.addCase(fetchPositions.rejected, (state) => {
                state.positionsList = []
            })
    },
})

export const { addPosition, updatePosition, deleteUserPosition, setSelectedPositionID } = positionsSlice.actions;

export default positionsSlice.reducer;