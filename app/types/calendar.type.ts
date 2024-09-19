import { Moment } from "moment"
import { ObjectId } from "mongodb"

export type CalendarSourceType = {
    _id?: ObjectId,
    name: string,
    url: string,
}

export type CalendarEventType = {
    dtEnd: Moment, 
    dtStart: Moment,
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