export enum EventKeysEnum {
    TASK_ITEM_EDIT= 'task-item-edit',
    CALENDAR_SOURCE_EDIT = 'calendar-source-edit',
    USER_UPDATE = 'user-update'
}

export enum TaskEditEventsEnum {
    TASK_ITEM_EDIT_START = 'task-item-edit-start',
    TASK_ITEM_EDIT_END = 'task-item-edit-end',
    TASK_ITEM_EDIT_TASK_REPLACED = 'task-item-edit-task-replaced',
}

export enum CalendarSourceEditEventsEnum {
    CALENDAR_SOURCE_EDIT_START = 'calendar-source-edit-start',
    CALENDAR_SOURCE_EDIT_END = 'calendar-source-edit-end',
    CALENDAR_SOURCE_EDIT_SOURCE_REPLACED = 'calendar-source-edit-source-replaced',
}