import { Task } from "@/app/types/task.type";
import TaskCheckbox from "../../shared/checkbox.component";
import DeleteIcon from '@mui/icons-material/Delete';
import { EditNote } from "@mui/icons-material";
import { TasksDataClientService } from "@/app/services/client/tasks-data-client.service";
import { DateTime } from "luxon";
import ModalComponent from "../../shared/modal.component";
import { ChangeEvent, FormEvent, useState } from "react";

export default function TaskItem ({task, setTasks}: {task: Task, setTasks: (tasks: Task[]) => unknown}) {

    const [editModalOpened, setEditModalOpen] = useState(false);
    const [taskState, setTaskState] = useState(task);

    const deleteButtonClicked = () => {
        task._id && TasksDataClientService.deleteTaskById(task._id)
            .then((res) => res.data.success && TasksDataClientService.fetchAllTasks()
            .catch(console.error)
            .then((tasks) => tasks && setTasks(tasks)));
    }

    const updateTaskStatus = (status: boolean) => {
        task = {...taskState, completed: status};
        TasksDataClientService.updateTask(task);
        setTaskState(task);
    }

    const formatTaskDate = (date: string) => DateTime.fromFormat(date, 'yyyy\'-\'MM\'-\'dd');

    const deadlineIsPassed = (): boolean => {
        if(!taskState.deadline) return false;
        const taskDate = formatTaskDate(taskState.deadline);
        const today = DateTime.now();
        return today.toMillis() > taskDate.toMillis();
    }

    const deadlineDate = taskState.deadline ? formatTaskDate(taskState.deadline)  : undefined;

    let [day, month, year]: string[] | undefined[] = deadlineDate
        ? [deadlineDate.day.toString(), deadlineDate.month.toString(), deadlineDate.year.toString()] 
        : [undefined, undefined, undefined];
        
    if (Number(day) < 10) {
        day = '0' + day;
    } if(Number(month) < 10) {
        month = '0' + month
    }

    const onTaskEditFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        const newTaskName = (event.target as any)[0].value;
        task = { ...taskState, title: newTaskName };
        setTaskState(task);
        TasksDataClientService.updateTask(task);
        setEditModalOpen(false);
    }

    const taskTitleInputChange = (e: ChangeEvent<HTMLInputElement>) => setTaskState({...taskState, title: e.currentTarget.value});

    return(
        <div className="flex flex-col task-item p-3">
            <div className=" flex space-x-2 items-center">
                <TaskCheckbox updateTaskStatus={updateTaskStatus} completed={taskState.completed}></TaskCheckbox> 
                <p>{taskState.title}</p>
                <span>
                    <EditNote onClick={() => setEditModalOpen(true)} className="cursor-pointer text-[rgba(255,255,255,0.2)] text-base hover:text-[rgba(255,255,255,0.6)]"></EditNote>
                    <DeleteIcon onClick={deleteButtonClicked} className="cursor-pointer text-[rgba(255,255,255,0.2)] text-base hover:text-[rgba(255,255,255,0.6)]"></DeleteIcon>
                </span>
            </div>
            <p className={'text-sm' + ` ${deadlineIsPassed() ? 'text-red-500/75' : 'text-[rgb(var(--text-lighter-rgb))]'}`} >{taskState.deadline && `Deadline: ${day}/${month}/${year}`}</p>
            
            <ModalComponent modalOpened={editModalOpened} setModalOpened={setEditModalOpen}>
                <form onSubmit={onTaskEditFormSubmit}>
                    <input autoFocus={true} value={taskState.title} onChange={taskTitleInputChange} className='h-6 w-5/6 mb-2 bg-[rgba(255,255,255,0.2)] rounded p-1' type="text" placeholder='Name'></input>
                    <button className='h-6 w-5/6 mt-2 bg-[rgba(255,255,255,0.3)] rounded'>Save</button>
                </form>
            </ModalComponent>
        </div>
    )
}