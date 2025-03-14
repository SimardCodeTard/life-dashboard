import { DateTime } from "luxon"
import { ObjectId } from "mongodb"
import { Dispatch, FormEventHandler, SetStateAction } from "react"

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
    onSubmit: FormEventHandler<HTMLFormElement>,
    mode: 'new' | 'edit',
    taskToEdit?: Task,
    setTaskToEdit: Dispatch<SetStateAction<Task | undefined>>
}