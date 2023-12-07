'use client'

import { Task } from "@/app/types/task.type";
import TaskItem from "./task.component";
import { FormEvent, useEffect, useState } from "react";
import { TasksDataClientService } from "@/app/services/client/tasks-data-client.service";
import styles from '../../components.module.css';

export default function Tasks() {

    const [tasks, setTasks] = useState<Task[]>([]);

    const onNewTaskSubmit = (event: FormEvent) => {
        event.preventDefault();

        const title = (event.target as any)[0].value;
        let deadline = (event.target as any)[1].value;
        
        if(new Date(deadline).toString() === 'Invalid Date') deadline = undefined;

        const completed = false;
        const newTask: Task = {title, deadline: deadline, completed};

        TasksDataClientService.saveTask(newTask)
        .then((res: any) => res.data.success && TasksDataClientService.fetchAllTasks().then(setTasks));
       
        (event.target as any)[0].value = "";
        (event.target as any)[1].value = "";
    }

    useEffect(() => {
        TasksDataClientService.fetchAllTasks().then(setTasks).catch(console.error);
    }, [])

    return (
        <div className={["p-2 task-list", styles.taskList].join(' ')}>
            <h2 className="text-xl mt-2 mb-2">Tasks</h2>
            {tasks.map((task: Task, key: number) => {
                return <TaskItem setTasks={setTasks} task={task} key={key}></TaskItem>
            })}
            <form className="mt-2 rounded-sm shadow-xl flex flex-col" onSubmit={onNewTaskSubmit}>
                <span className="space-y-1">
                    <input type="text" className="p-1 rounded bg-[rgba(255,255,255,0.2)]" placeholder="New task"></input>
                    <input type="date" className="p-1 rounded bg-[rgba(255,255,255,0.2)]"></input>
                </span>
                <button type="submit" className="mt-2 p-1 rounded-sm bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(255,255,255,0.2)]">Save</button>
            </form>
        </div>
    );
}