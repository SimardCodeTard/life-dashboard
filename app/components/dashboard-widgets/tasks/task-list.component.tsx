'use client'
import { Task, TaskDto } from "@/app/types/task.type";
import TaskItem from "./task-item.component";
import { FormEvent, useEffect, useState } from "react";
import { clientTaskDataService } from "@/app/services/client/tasks-data-client.service";
import Loader from "../../shared/loader/loader.component";
import { Logger } from "@/app/services/logger.service";
import NewTaskForm from "./new-task-form.component";

export default function Tasks() {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const updateTask = async (taskDto: TaskDto, completed?: boolean) => {
        taskDto = {...taskDto, _id: taskDto._id, completed: completed !== undefined ? completed : taskDto.completed};
        return clientTaskDataService.updateTask(taskDto)
        .then(async () => setTasks(clientTaskDataService.mapTaskDtoToTaskList( await clientTaskDataService.fetchAllTasks() )))
    }

    const deleteTask = async (taskDto: TaskDto) => {
        return taskDto._id && clientTaskDataService.deleteTaskById(taskDto._id)
            .then((res) =>{ return res.data.success ? clientTaskDataService.fetchAllTasks() : undefined})
            .catch(Logger.error)
            .then((tasks) => tasks && setTasks(clientTaskDataService.mapTaskDtoToTaskList(tasks)))
    }

    useEffect(() => {
        setIsLoading(true);
        clientTaskDataService.fetchAllTasks().then(clientTaskDataService.mapTaskDtoToTaskList).then(setTasks).then(() => setIsLoading(false)).catch(console.error);
    }, [])

    return (
        <div className="task-list">
            <h2 >Tasks</h2>
            {isLoading 
                ? <Loader></Loader>
                : <div className="task-items-wrapper">
                    {tasks.map((task: Task, key: number) => {
                        return <TaskItem deleteTask={deleteTask} updateTask={updateTask} task={task} key={key}></TaskItem>
                    })}
                </div>
            }
            <NewTaskForm onNewTaskSubmit={onNewTaskSubmit}></NewTaskForm>
        </div>
    );
}