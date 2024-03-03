import { DateTime } from "luxon"
import { ObjectId } from "mongodb"
import { FormEventHandler } from "react"

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

export type NewTaskFormProps = {
    onNewTaskSubmit: FormEventHandler<HTMLFormElement>,
}