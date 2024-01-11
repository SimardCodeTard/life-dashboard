import { DateTime } from "luxon"
import { ObjectId } from "mongodb"

export type TaskDto = {
    title: string,
    completed: boolean,
    deadline?: string,
    _id?: ObjectId
}

export type Task = {
    title: string,
    completed: boolean,
    deadline?: DateTime,
    _id?: ObjectId
}