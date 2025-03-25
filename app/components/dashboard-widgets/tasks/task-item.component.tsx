import { Task } from "@/app/types/task.type";
import TaskCheckbox from "./task-checkbox.component";
import DeleteIcon from '@mui/icons-material/Delete';
import { EditNote } from "@mui/icons-material";
import { Cancel } from "@mui/icons-material";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

import './tasks.scss';
import Loader from "../../shared/loader/loader.component";
import EventEmitter from "@/app/lib/event-emitter";
import { EventKeysEnum, TaskEditEventsEnum } from "@/app/enums/events.enum";
import { Logger } from "@/app/services/logger.service";
import { ObjectId } from "mongodb";

export default function TaskItem (
    { 
        task,
        deleteTask,
        updateTask,
        onTaskEditIconClicked,
        taskItemEditEventEmitter}: 
    { 
        task: Task,
        deleteTask: (task: Task) => Promise<void>,
        updateTask: (task: Task, status: boolean) => Promise<void>,
        onTaskEditIconClicked: (task: Task) => void, 
        taskItemEditEventEmitter: EventEmitter}
) {

    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const onNewTaskItemEditEvent = (value: TaskEditEventsEnum, taskId: ObjectId) => {
            Logger.debug('TaskItem: onNewLocalLoadEvent ' + value);
            if(value === TaskEditEventsEnum.TASK_ITEM_EDIT_START && taskId === task._id) {
                setIsLoading(true);
                setIsEditing(true);
            } else if (
                (value === TaskEditEventsEnum.TASK_ITEM_EDIT_END 
                || value === TaskEditEventsEnum.TASK_ITEM_EDIT_TASK_REPLACED) 
                && taskId === task._id)
            {
                setIsLoading(false);
                setIsEditing(false);
            }
        }

        taskItemEditEventEmitter.on(EventKeysEnum.TASK_ITEM_EDIT, onNewTaskItemEditEvent);

        return () => {
            taskItemEditEventEmitter.off(EventKeysEnum.TASK_ITEM_EDIT, onNewTaskItemEditEvent);
        }
    }, []);

    const deadlineIsPassed = (): boolean => {
        if(!task.deadline) return false;
        return DateTime.now().toMillis() > task.deadline.toMillis();
    }

    let [day, month, year]: string[] | undefined[] = task.deadline
        ? [task.deadline.day.toString(), task.deadline.month.toString(), task.deadline.year.toString()] 
        : [undefined, undefined, undefined];
        
    day = day?.padStart(2, "0")
    month = month?.padStart(2, "0")


    const onTaskDelete = (task: Task) => {
        setIsLoading(true);
        deleteTask(task)
        .then(() => setIsLoading(false));
    }

    const onTaskUpdate = (task: Task, completed: boolean) => {
        setIsLoading(true);
        updateTask(task, completed)
        .then(() => setIsLoading(false));
    }

    const getTimeDiffInDays = (deadline: DateTime): string => {
        const diff = deadline.diffNow();
        if(diff.as('days') > 0) {
            return `${Math.floor(diff.as('days'))} days`;
        } else {
            return `${Math.floor(diff.as('days')) * - 1} days`;
        }
    }

    const onTaskEditCancel = () => {
        setIsEditing(false);
        onTaskEditIconClicked(task);
    }

    const onTaskEdit = () => {
        setIsEditing(true);
        onTaskEditIconClicked(task);
    }

    const getDeadlineDiff = () => {
        if(task.completed || !task.deadline?.isValid) {
            return ''
        } 

        if(deadlineIsPassed()) {
            return `(${getTimeDiffInDays(task.deadline)} late)`
        }

        return `(${getTimeDiffInDays(task.deadline)} remaining)`;
    }
    return(
        <div className={`task-item ${task.completed && 'completed-task'}`}>
            <TaskCheckbox disabled={isLoading || isEditing} updateTaskStatus={(status) => onTaskUpdate(task, status)} completed={task.completed}></TaskCheckbox> 
            <div className='task-item-content'>
                <p className="task-item-title">{task.title}</p>
                <div className={`task-deadline subtitle`}>
                    <p>{task.deadline && `Deadline: ${day}/${month}/${year}`}</p>
                    <p className={deadlineIsPassed() ? 'passed-task-deadline' : ''}>{getDeadlineDiff()}</p> 
                </div>
            </div>
            <span className="actions-wrapper">
                {isEditing 
                    ? <Cancel onClick={() => onTaskEditCancel()}/> 
                    : <EditNote onClick={() => onTaskEdit()}></EditNote>
                }
                <DeleteIcon onClick={() => onTaskDelete(task)}></DeleteIcon>
            </span>
            {isLoading && <Loader></Loader>}
        </div>
    )
}