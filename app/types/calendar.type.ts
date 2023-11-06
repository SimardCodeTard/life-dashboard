import { DateTime } from "luxon"

export type CalendarEventType = {
    dtEnd: DateTime, 
    dtStart: DateTime,
    location: string,
    summary: string,
}

export type CalendarEventTypeDTO = {
    dtEnd: string, 
    dtStart: string,
    location: string,
    summary: string,
}

export type GroupedEventMapKeyType = {
    day: number,
    month: number,
    year: number,   
}