import { Task, TaskDto } from "@/app/types/task.type";
import TaskCheckbox from "./task-checkbox.component";
import DeleteIcon from '@mui/icons-material/Delete';
import { EditNote } from "@mui/icons-material";
import { DateTime } from "luxon";
import ModalComponent from "../../shared/modal.component";
import { ChangeEvent, FormEvent, useState } from "react";
import { clientTaskDataService } from "@/app/services/client/tasks-data-client.service";

import './tasks.css';
import Loader from "../../shared/loader/loader.component";

export default function TaskItem ({task, deleteTask, updateTask}: 
    {task: Task, deleteTask: (task: TaskDto) => Promise<void>, updateTask: (task: TaskDto, status: boolean) => Promise<void>}
) {

    const [isLoading, setIsLoading] = useState(false);

    const formatTaskDateToInput = (date: DateTime) => date.toFormat('yyyy\'-\'MM\'-\'dd');

    const [editModalOpened, setEditModalOpen] = useState(false);
    const [taskTitle, setTaskTitle] = useState(task.title);
    const [taskDeadline, setTaskDeadline] = useState(task.deadline?.isValid ? formatTaskDateToInput(task.deadline as DateTime) : '');

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

    const onTaskEditFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        const newTaskTitle: string = (event.target as any)[0].value;
        const newTaskDeadline: string = (event.target as any)[1].value;
        onTaskUpdate({...task, title: newTaskTitle, deadline: newTaskDeadline}, task.completed)
        setEditModalOpen(false);
    }

    const taskTitleInputChange = (e: ChangeEvent<HTMLInputElement>) => setTaskTitle(e.currentTarget.value);

    const taskDeadlineInputChange = (e: ChangeEvent<HTMLInputElement>) => setTaskDeadline(e.currentTarget.value);

    const onTaskDelete = (task: TaskDto) => {
        setIsLoading(true);
        deleteTask(task).then(() => setIsLoading(false));
    }

    const onTaskUpdate = (task: TaskDto, completed: boolean) => {
        setIsLoading(true);
        updateTask(task, completed).then(() => setIsLoading(false));
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
            <div className="task-item-wrapper">
                <div className="task-item-content">
                    <TaskCheckbox updateTaskStatus={(status) => onTaskUpdate(clientTaskDataService.mapTaskToTaskDto(task), status)} completed={task.completed}></TaskCheckbox> 
                    <p>{task.title}</p>
                    <p className="subtitle task-remaining-time">{task.deadline?.isValid && (deadlineIsPassed() ? `(${getTimeDiffInDays(task.deadline)} late)` : `(${getTimeDiffInDays(task.deadline)} remaining)`)}</p>
                    <span className="actions-wrapper">
                        <EditNote onClick={() => setEditModalOpen(true)}></EditNote>
                        <DeleteIcon onClick={() => onTaskDelete(clientTaskDataService.mapTaskToTaskDto(task))}></DeleteIcon>
                    </span>
                </div>
                <p className={`task-deadline subtitle ${deadlineIsPassed() && 'passed-task-deadline'}`}>{task.deadline && `Deadline: ${day}/${month}/${year}`}</p>
            </div>
            {isLoading && <Loader></Loader>}
            <ModalComponent modalOpened={editModalOpened} setModalOpened={setEditModalOpen}>
                <form onSubmit={onTaskEditFormSubmit}>
                    <input autoFocus={true} value={taskTitle} onChange={taskTitleInputChange} type="text" placeholder='Name'></input>
                    <input type="date" value={taskDeadline} onChange={taskDeadlineInputChange} ></input>
                    <button>Save</button>
                </form>
            </ModalComponent>
        </div>
    )
}