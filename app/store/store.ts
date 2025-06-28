import { createSlice, configureStore, createStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { TaskType } from '../types/task.type'
import tasksReducer from './tasks/tasks-slice';
import tasksSlice from './tasks/tasks-slice';

export const store = configureStore({
    reducer: tasksReducer,
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>