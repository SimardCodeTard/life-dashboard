import { ObjectId } from "mongodb"

export type Task = {
    title: string,
    completed: boolean,
    deadline?: string,
    _id?: ObjectId
}