'use client'
import { Task } from "@/app/types/task.type";
import TaskItem from "./task.component";
import { FormEvent, useEffect, useState } from "react";
import { clientTaskDataService } from "@/app/services/client/tasks-data-client.service";
import styles from '../../components.module.css';
import Loader from "../../shared/loader/loader.component";

export default function Tasks() {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const onNewTaskSubmit = (event: FormEvent) => {
        event.preventDefault();

        setIsLoading(true);

        const title = (event.target as any)[0].value;
        let deadline = (event.target as any)[1].value;
        
        if(new Date(deadline).toString() === 'Invalid Date') deadline = undefined;

        const completed = false;
        const newTask: Task = {title, deadline: deadline, completed};

        clientTaskDataService.saveTask(newTask)
        .then((res: any) => res.data.success && clientTaskDataService.fetchAllTasks().then(clientTaskDataService.mapTaskDtoToTaskList).then(setTasks)).then(() => setIsLoading(false)).catch(console.error);
       
        (event.target as any)[0].value = "";
        (event.target as any)[1].value = "";
    }

    useEffect(() => {
        setIsLoading(true);
        clientTaskDataService.fetchAllTasks().then(clientTaskDataService.mapTaskDtoToTaskList).then(setTasks).then(() => setIsLoading(false)).catch(console.error);
    }, [])

    return (
        <div className={["relative p-2 task-list", styles.taskList].join(' ')}>
            <h2 className="text-lg mt-2 mb-3">Tasks</h2>
            {tasks.map((task: Task, key: number) => {
                return <TaskItem setTasks={setTasks} task={task} key={key}></TaskItem>
            })}
            
            {isLoading && <Loader></Loader>}
            <form className="mt-2 flex flex-col shadow-xl" onSubmit={onNewTaskSubmit}>
                <span className="space-y-1">
                    <input type="text" className="p-1 rounded bg-[rgba(255,255,255,0.2)]" placeholder="New task"></input>
                    <input type="date" className="p-1 rounded bg-[rgba(255,255,255,0.2)]"></input>
                </span>
                <button type="submit" className="mt-2 p-1 rounded-sm bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(255,255,255,0.2)]">Save</button>
            </form>
        </div>
    );
}