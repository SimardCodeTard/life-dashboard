import { Task } from "@/app/types/task.type";
import TaskCheckbox from "../../shared/checkbox.component";
import DeleteIcon from '@mui/icons-material/Delete';
import { EditNote } from "@mui/icons-material";
import { clientTaskDataService } from "@/app/services/client/tasks-data-client.service";
import { DateTime } from "luxon";
import ModalComponent from "../../shared/modal.component";
import { ChangeEvent, FormEvent, useState } from "react";
import { Logger } from "@/app/services/logger.service";

export default function TaskItem ({task, setTasks, deleteTask, updateTask}: {task: Task, setTasks: (tasks: Task[]) => void, deleteTask: (task: Task) => void, updateTask: (task: Task, status: boolean) => void}) {

    const [editModalOpened, setEditModalOpen] = useState(false);
    const [taskTitle, setTaskTitle] = useState(task.title);
    const [taskDeadline, setTaskDeadline] = useState(task.deadline);

    const formatTaskDate = (date: string) => DateTime.fromFormat(date, 'yyyy\'-\'MM\'-\'dd');

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
        const newTaskTitle = (event.target as any)[0].value;
        const newTaskDeadline = (event.target as any)[1].value;
        updateTask({...task, title: newTaskTitle, deadline: newTaskDeadline}, task.completed)
        setEditModalOpen(false);
    }

    const taskTitleInputChange = (e: ChangeEvent<HTMLInputElement>) => setTaskTitle(e.currentTarget.value);

    const taskDeadlineInputChange = (e: ChangeEvent<HTMLInputElement>) => setTaskDeadline(formatTaskDate(e.currentTarget.value));

    const getRemainingTime = (deadline: DateTime): string => {
        const diff = deadline.diffNow();
        if(diff.as('days') > 0) {
            return `${Math.floor(diff.as('days'))} days`;
        } else {
            return '';
        }
    }

    return(
        <div className="flex flex-col task-item p-3">
            <div className=" flex space-x-2 items-center">
                <TaskCheckbox updateTaskStatus={(status) => updateTask(task, status)} completed={task.completed}></TaskCheckbox> 
                <p>{task.title}</p>
                <div className="text-sm text-[rgba(255,255,255,0.2)]">{task.deadline?.isValid && getRemainingTime(task.deadline)}</div>
                <span>
                    <EditNote onClick={() => setEditModalOpen(true)} 
                        className="cursor-pointer text-[rgba(255,255,255,0.2)] text-base hover:text-[rgba(255,255,255,0.6)]"></EditNote>
                    <DeleteIcon onClick={() => deleteTask(task)} className="cursor-pointer text-[rgba(255,255,255,0.2)] text-base hover:text-[rgba(255,255,255,0.6)]"></DeleteIcon>
                </span>
            </div>
            <p className={'text-sm' + ` ${deadlineIsPassed() ? 'text-red-500/75' : 'text-[rgb(var(--text-lighter-rgb))]'}`} 
              >{task.deadline && `Deadline: ${day}/${month}/${year}`}</p>
            
            <ModalComponent modalOpened={editModalOpened} setModalOpened={setEditModalOpen}>
                <form onSubmit={onTaskEditFormSubmit}>
                    <input autoFocus={true} value={taskTitle} onChange={taskTitleInputChange} className='h-6 w-5/6 mb-2 bg-[rgba(255,255,255,0.2)] rounded p-1' 
                        type="text" placeholder='Name'></input>
                    <input type="date" value={taskDeadline?.toISO() ?? ''} onChange={taskDeadlineInputChange} className="p-1 rounded bg-[rgba(255,255,255,0.2)]"></input>
                    <button className='h-6 w-5/6 mt-2 bg-[rgba(255,255,255,0.3)] rounded'>Save</button>
                </form>
            </ModalComponent>
        </div>
    )
}