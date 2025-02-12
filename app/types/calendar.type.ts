import { DateTime } from "luxon"
import { ObjectId } from "mongodb"

export type CalendarSourceType = {
    _id?: ObjectId,
    name: string,
    url: string,
    color: string,
    visible: boolean,
}

export type CalendarEventType = {
    dtEnd: DateTime, 
    dtStart: DateTime,
    location: string,
    summary: string,
}

export type CalendarSourceEventsFakeMapType = {
    source: CalendarSourceType,
    events: CalendarEventType[],
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