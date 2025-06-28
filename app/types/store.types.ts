import { GeneralSettings } from "./settings.type";
import { TaskType } from "./task.type"

export type TasksStateType = {
    value: TaskType [];
}

export type SettingsStateType = {
    value: {
        general: GeneralSettings,   
    }
} 