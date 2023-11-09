import { ObjectId } from "mongodb"

export type Task = {
    title: string,
    completed: boolean,
    deadline?: Date
    _id?: ObjectId
}