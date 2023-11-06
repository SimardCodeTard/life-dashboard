import { Task } from "@/app/types/task.type";
    import TaskCheckbox from "../../client/checkbox.component";

export default function TaskItem ({task}: {task: Task}) {

    let [day, month, year]: string[] | undefined[] = task.deadline 
        ? [task.deadline?.getDay().toString(), task.deadline.getMonth().toString(), task.deadline.getFullYear().toString()] 
        : [undefined, undefined, undefined];
        
    if (Number(day) < 10) {
        day = '0' + day;
    } if(Number(month) < 10) {
        month = '0' + month
    }

    return(
        <div className="flex flex-col task-item p-3">
            <div className=" flex space-x-2">
                <TaskCheckbox completed={task.completed}></TaskCheckbox> 
                <p>{task.title}</p>
            </div>
            <p className="text-[rgb(var(--text-lighter-rgb))] text-xs">{task.deadline && `Deadline: ${day}/${month}/${year}`}</p>
        </div>
    )
}