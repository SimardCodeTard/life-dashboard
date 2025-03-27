import { NewTaskFormProps, TaskType } from "@/app/types/task.type";
import { Save, AddTask } from "@mui/icons-material";

import './tasks.scss';
import { DateTime } from "luxon";
import { FormEvent, useEffect, useState } from "react";

export default function TaskForm({ userId, onSubmit, mode, taskToEdit }: Readonly<NewTaskFormProps>) {

    const getDefaultTask = (): TaskType => ({
        title: '',
        completed: false,
        deadline: undefined,
        userId: userId
    });

    const [task, setTask] =  useState<TaskType>(getDefaultTask());

    useEffect(() => {
        if(mode === 'edit' && taskToEdit) {
            setTask(taskToEdit);
        } else if (mode === 'new') {
            setTask(getDefaultTask());
        }
    }, [mode]);

    useEffect(() => {
        setTask(taskToEdit || getDefaultTask());
    }, [taskToEdit])


    const onSubmitWrapper = (e: FormEvent<HTMLFormElement>) => {
        setTask(getDefaultTask());
        onSubmit(e);
    }

    const onTaskTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        task && setTask({ ...task, title: e.target.value });
    }

    const onTaskDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        task && setTask({ ...task, deadline: DateTime.fromJSDate(new Date(e.target.value)) });
    }

    const formatTaskDateToInput = (date: DateTime) => date.toFormat('yyyy\'-\'MM\'-\'dd');

    return <form className="new-task-form" onSubmit={onSubmitWrapper}>
        <input className="task-name-field" type="text" placeholder={mode === 'new' ? 'Create new task...' : "Edit task..."} value={task?.title} onChange={onTaskTitleChange}></input>
        <input className="task-date-field" type="date" value={(task.deadline?.isValid ? formatTaskDateToInput(task.deadline) : '')} onChange={onTaskDeadlineChange}></input>
        <button type="submit">{mode === 'new' ? <AddTask/> : <Save/>}</button>
    </form>
}