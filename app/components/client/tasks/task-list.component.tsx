'use client'

import { Task } from "@/app/types/task.type";
import TaskItem from "./task.component";
import { FormEvent, useEffect, useState } from "react";
import { TasksDataClientService } from "@/app/services/tasks-data-client.service";

export default function Tasks() {

    const [tasks, setTasks] = useState<Task[]>([]);

    const onNewTaskSubmit = (event: FormEvent) => {
        event.preventDefault();
        const newTask: Task = {title: (event.target as any)[0].value, completed: false};
        TasksDataClientService.saveTask(newTask)
        .then((res: any) => res.data.success && TasksDataClientService.fetchAllTasks().then(setTasks));
        (event.target as any)[0].value = "";
    }

    useEffect(() => {
        TasksDataClientService.fetchAllTasks().then(setTasks).catch(console.error);
    }, [])

    return (
        <div className="p-2 task-list">
            <h2>Tasks</h2>
            {tasks.map((task: Task, key: number) => {
                return <TaskItem setTasks={setTasks} task={task} key={key}></TaskItem>
            })}
            <form className="mt-2" onSubmit={onNewTaskSubmit}>
                <input type="text" className="p-1 rounded bg-[rgba(255,255,255,0.2)]" placeholder="New task"></input>
                <button type="submit" className="mt-2 p-1 rounded-sm bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(255,255,255,0.2)]">Save</button>
            </form>
        </div>
    );
}