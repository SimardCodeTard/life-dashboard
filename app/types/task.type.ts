import { DateTime } from "luxon";
import { ObjectId } from "mongodb";
import { FormEventHandler } from "react";

export type TaskTypeDto = {
    title: string;
    completed: boolean;
    deadline: string | null;
    _id?: ObjectId;
    userId: ObjectId;
}

export type TaskType = {
    title: string,
    completed: boolean,
    deadline?: DateTime,
    _id?: ObjectId;
    userId: ObjectId;
}

export type NewTaskFormProps = {
    userId: ObjectId
    onSubmit: FormEventHandler<HTMLFormElement>,
    mode: 'new' | 'edit',
    taskToEdit?: TaskType,
}