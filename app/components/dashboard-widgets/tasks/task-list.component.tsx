'use client'
import { Task, TaskDto } from "@/app/types/task.type";
import TaskItem from "./task.component";
import { FormEvent, useEffect, useState } from "react";
import { clientTaskDataService } from "@/app/services/client/tasks-data-client.service";
import styles from '../../components.module.css';
import Loader from "../../shared/loader/loader.component";
import { Logger } from "@/app/services/logger.service";
import NewTaskForm from "./new-task-form.component";

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
        const newTask: TaskDto = {title, deadline: deadline, completed};

        clientTaskDataService.saveTask(newTask)
        .then((res: any) => res.data.success && clientTaskDataService.fetchAllTasks().then(clientTaskDataService.mapTaskDtoToTaskList).then(setTasks)).then(() => setIsLoading(false)).catch(console.error);
       
        (event.target as any)[0].value = "";
        (event.target as any)[1].value = "";
    }

    const updateTask = (taskDto: TaskDto, completed?: boolean) => {
        setIsLoading(true)
        taskDto = {...taskDto, _id: taskDto._id, completed: completed !== undefined ? completed : taskDto.completed};
        clientTaskDataService.updateTask(taskDto)
        .then(async () => setTasks(clientTaskDataService.mapTaskDtoToTaskList( await clientTaskDataService.fetchAllTasks() )))
        .then(() => setIsLoading(false));
    }

    const deleteTask = (taskDto: TaskDto) => {
        setIsLoading(true);
        taskDto._id && clientTaskDataService.deleteTaskById(taskDto._id)
            .then((res) =>{ return res.data.success ? clientTaskDataService.fetchAllTasks() : undefined})
            .catch(Logger.error)
            .then((tasks) => tasks && setTasks(clientTaskDataService.mapTaskDtoToTaskList(tasks)))
            .then(() => setIsLoading(false));
    }

    useEffect(() => {
        setIsLoading(true);
        clientTaskDataService.fetchAllTasks().then(clientTaskDataService.mapTaskDtoToTaskList).then(setTasks).then(() => setIsLoading(false)).catch(console.error);
    }, [])

    return (
        <div className={["relative p-2 task-list ", styles.taskList].join(' ')}>
            <h2 className="text-lg mt-2 mb-3">Tasks</h2>
            {tasks.map((task: Task, key: number) => {
                return <TaskItem deleteTask={deleteTask} updateTask={updateTask} task={task} key={key}></TaskItem>
            })}
            
            {isLoading && <Loader></Loader>}
            <NewTaskForm onNewTaskSubmit={onNewTaskSubmit}></NewTaskForm>
        </div>
    );
}