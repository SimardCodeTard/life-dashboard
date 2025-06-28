import { DEFAULT_SETTINGS } from "@/app/data/default-settings";
import { SettingsStateType } from "@/app/types/store.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: { value: DEFAULT_SETTINGS } as SettingsStateType,
    reducers: {
        setTasks: (state, action: PayloadAction<SettingsStateType>) => {
            state.value = action.payload.value;
        }
    }
});

export const { setTasks } = tasksSlice.actions;

const tasksReducer = tasksSlice.reducer;

export default tasksReducer;