import { Task } from "@/app/types/task.type";
import TaskCheckbox from "./task-checkbox.component";
import DeleteIcon from '@mui/icons-material/Delete';
import { EditNote, SetMealOutlined } from "@mui/icons-material";
import { Cancel } from "@mui/icons-material";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

import './tasks.scss';
import Loader from "../../shared/loader/loader.component";
import EventEmitter from "@/app/lib/event-emitter";
import { EventKeysEnum, LoadEventsEnum } from "@/app/enums/events.enum";
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
        const onNewTaskItemEditEvent = (value: LoadEventsEnum, taskId: ObjectId) => {
            Logger.debug('TaskItem: onNewLocalLoadEvent ' + value);
            if(value === LoadEventsEnum.TASK_ITEM_EDIT_START && taskId === task._id) {
                setIsLoading(true);
            } else if (
                (value === LoadEventsEnum.TASK_ITEM_EDIT_END 
                || value === LoadEventsEnum.TASK_ITEM_EDIT_TASK_REPLACED) 
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
        
    if (Number(day) < 10) {
        day = '0' + day;
    } if(Number(month) < 10) {
        month = '0' + month
    }


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

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        onTaskEditIconClicked(task);
    }
    
    const getTimeDiffInDays = (deadline: DateTime): string => {
        const diff = deadline.diffNow();
        if(diff.as('days') > 0) {
            return `${Math.floor(diff.as('days'))} days`;
        } else {
            return `${Math.floor(diff.as('days')) * - 1} days`;
        }
    }

    return(
        <div className={`task-item ${task.completed && 'completed-task'}`}>
            <TaskCheckbox updateTaskStatus={(status) => onTaskUpdate(task, status)} completed={task.completed}></TaskCheckbox> 
            <div className='task-item-content'>
                <p className="task-item-title">{task.title}</p>
                <div className={`task-deadline subtitle`}>
                    <p>{task.deadline && `Deadline: ${day}/${month}/${year}`}</p>
                    <p className={deadlineIsPassed() ? 'passed-task-deadline' : ''}>{!task.completed && task.deadline?.isValid ? (deadlineIsPassed() ? `(${getTimeDiffInDays(task.deadline)} late)` : `(${getTimeDiffInDays(task.deadline)} remaining)`) : ''}</p> 
                </div>
            </div>
            <span className="actions-wrapper">
                {isEditing 
                    ? <Cancel onClick={() => toggleEditMode()}/> 
                    : <EditNote onClick={() => toggleEditMode()}></EditNote>
                }
                <DeleteIcon onClick={() => onTaskDelete(task)}></DeleteIcon>
            </span>
            {isLoading && <Loader></Loader>}
        </div>
    )
}