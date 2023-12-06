import { Task } from "@/app/types/task.type";
import TaskCheckbox from "../../shared/checkbox.component";
import DeleteIcon from '@mui/icons-material/Delete';
import { TasksDataClientService } from "@/app/services/client/tasks-data-client.service";
import { DateTime } from "luxon";
import { Logger } from "@/app/services/logger.service";

export default function TaskItem ({task, setTasks}: {task: Task, setTasks: (tasks: Task[]) => unknown}) {

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

    const formatTaskDate = (date: string) => DateTime.fromFormat(date, 'yyyy\'-\'MM\'-\'dd');

    const deadlineIsPassed = (): boolean => {
        if(!task.deadline) return false;
        const taskDate = formatTaskDate(task.deadline);
        const today = DateTime.now();
        return today.toMillis() > taskDate.toMillis();
    }

    const deadlineDate = task.deadline ? formatTaskDate(task.deadline)  : undefined;

    let [day, month, year]: string[] | undefined[] = deadlineDate
        ? [deadlineDate.day.toString(), deadlineDate.month.toString(), deadlineDate.year.toString()] 
        : [undefined, undefined, undefined];
        
    if (Number(day) < 10) {
        day = '0' + day;
    } if(Number(month) < 10) {
        month = '0' + month
    }

    return(
        <div className="flex flex-col task-item p-3">
            <div className=" flex space-x-2 items-center">
                <TaskCheckbox updateTaskStatus={updateTaskStatus} completed={task.completed}></TaskCheckbox> 
                <p>{task.title}</p>
                <DeleteIcon onClick={deleteButtonClicked} className="cursor-pointer text-[rgba(255,255,255,0.2)] text-base hover:text-[rgba(255,255,255,0.6)]"></DeleteIcon>
            </div>
            <p className={'text-sm' + ` ${deadlineIsPassed() ? 'text-red-500/75' : 'text-[rgb(var(--text-lighter-rgb))]'}`} >{task.deadline && `Deadline: ${day}/${month}/${year}`}</p>
        </div>
    )
}