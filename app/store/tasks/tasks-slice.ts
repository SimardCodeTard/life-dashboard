import { TasksStateType } from "@/app/types/store.types";
import { TaskType } from "@/app/types/task.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: { value: [] } as TasksStateType,
    reducers: {
        setTasks: (state, action: PayloadAction<TaskType[]>) => {
            state.value = action.payload;
        }
    }
});

export const { setTasks } = tasksSlice.actions;

const tasksReducer = tasksSlice.reducer;

export default tasksReducer;