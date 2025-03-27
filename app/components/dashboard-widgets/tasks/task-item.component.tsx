import { TaskType } from "@/app/types/task.type";
import TaskCheckbox from "./task-checkbox.component";
import DeleteIcon from '@mui/icons-material/Delete';
import { EditNote, Cancel } from "@mui/icons-material";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import Loader from "../../shared/loader/loader.component";
import EventEmitter from "@/app/lib/event-emitter";
import { EventKeysEnum, TaskEditEventsEnum } from "@/app/enums/events.enum";
import { Logger } from "@/app/services/logger.service";
import { ObjectId } from "mongodb";

import './tasks.scss';

export default function TaskItem (
    { 
        task,
        deleteTask,
        updateTask,
        onTaskEditIconClicked,
        taskItemEditEventEmitter}: 
    Readonly<{ 
        task: TaskType,
        deleteTask: (task: TaskType) => Promise<void>,
        updateTask: (task: TaskType, status: boolean) => Promise<void>,
        onTaskEditIconClicked: (task: TaskType) => void, 
        taskItemEditEventEmitter: EventEmitter}>
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
        const now = DateTime.now();
        const diff = getTimeDiffInDays(now, task.deadline);
        console.log('deadlineIsPassed', diff < 0)
        return diff < 0;
    }

    let [day, month, year]: string[] | undefined[] = task.deadline
        ? [task.deadline.day.toString(), task.deadline.month.toString(), task.deadline.year.toString()] 
        : [undefined, undefined, undefined];
        
    day = day?.padStart(2, "0")
    month = month?.padStart(2, "0")


    const onTaskDelete = (task: TaskType) => {
        setIsLoading(true);
        deleteTask(task)
        .then(() => setIsLoading(false));
    }

    const onTaskUpdate = (task: TaskType, completed: boolean) => {
        setIsLoading(true);
        updateTask(task, completed)
        .then(() => setIsLoading(false));
    }

    const getTimeDiffInDays = (a: DateTime, b: DateTime): number => b.set({hour: a.hour, minute: a.minute, second: a.second, millisecond: a.millisecond}).diff(a).as('days')

    const getTimeDiffLabel = (deadline: DateTime): string => {
        const now = DateTime.now();
        const diff = getTimeDiffInDays(now, deadline);
        console.log(deadline.toISODate(), diff)
        if(diff >= 0) {
            if(diff > 1) {
                return `${Math.floor(diff)} days`;
            }
            return `${Math.floor(diff)} day`;
        } else {
            if(diff <= - 2) {
                return `${Math.floor(diff) * - 1} days`;
            }
            return `${Math.floor(diff) * - 1} day`;
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
            return `(${getTimeDiffLabel(task.deadline)} late)`
        }

        return `(${getTimeDiffLabel(task.deadline)} remaining)`;
    }
    return(
        <div className={`task-item ${task.completed && 'completed-task'} ${isEditing && 'editing-task'}`}>
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
