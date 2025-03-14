import { NewTaskFormProps, Task } from "@/app/types/task.type";
import { Save } from "@mui/icons-material";
import { Add } from "@mui/icons-material";

import './tasks.scss';
import { DateTime } from "luxon";
import { FormEvent, useEffect, useState } from "react";
import { get } from "http";

export default function TaskForm({ onSubmit, mode, taskToEdit }: NewTaskFormProps) {

    const getDefaultTask = () => ({
        title: '',
        completed: false,
        deadline: undefined
    });

    useEffect(() => {
        if(mode === 'edit' && taskToEdit) {
            setTask(taskToEdit);
        } else if (mode === 'new') {
            setTask(getDefaultTask());
        }
    }, [mode]);

    const [task, setTask] =  useState<Task>(getDefaultTask());

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
        <input className="task-name-field" type="text" placeholder="Edit task title..." value={task?.title} onChange={onTaskTitleChange}></input>
        <input type="date" value={(task?.deadline && task.deadline.isValid ? formatTaskDateToInput(task.deadline) : '')} onChange={onTaskDeadlineChange}></input>
        <button type="submit">{mode === 'new' ? <Add/> : <Save/>}</button>
    </form>
}