import { Task } from "@/app/types/task.type";
import TaskCheckbox from "../checkbox.component";
import DeleteIcon from '@mui/icons-material/Delete';
import { TasksDataClientService } from "@/app/services/client/tasks-data-client.service";

export default function TaskItem ({task, setTasks}: {task: Task, setTasks: (tasks: Task[]) => unknown}) {

    let [day, month, year]: string[] | undefined[] = task.deadline 
        ? [task.deadline?.getDay().toString(), task.deadline.getMonth().toString(), task.deadline.getFullYear().toString()] 
        : [undefined, undefined, undefined];
        
    if (Number(day) < 10) {
        day = '0' + day;
    } if(Number(month) < 10) {
        month = '0' + month
    }

    const deleteButtonClicked = () => {
        task._id && TasksDataClientService.deleteTaskById(task._id)
            .then((res) => res.data.success && TasksDataClientService.fetchAllTasks()
            .catch(console.error)
            .then((tasks) => tasks && setTasks(tasks)));
    }

    const updateTaskStatus = (status: boolean) => {
        task = {...task, completed: status};
        TasksDataClientService.updateTask(task);
    }

    return(
        <div className="flex flex-col task-item p-3">
            <div className=" flex space-x-2 items-center">
                <TaskCheckbox updateTaskStatus={updateTaskStatus} completed={task.completed}></TaskCheckbox> 
                <p>{task.title}</p>
                <DeleteIcon onClick={deleteButtonClicked} className="cursor-pointer text-[rgba(255,255,255,0.2)] text-base hover:text-[rgba(255,255,255,0.6)]"></DeleteIcon>
            </div>
            <p className="text-[rgb(var(--text-lighter-rgb))] text-xs">{task.deadline && `Deadline: ${day}/${month}/${year}`}</p>
        </div>
    )
}