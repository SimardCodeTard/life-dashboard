import axios, { AxiosResponse } from "axios";
import { Task } from "../../types/task.type";
import { ObjectId } from "bson";
import { Logger } from "../logger.service";
import { TaskAlt } from "@mui/icons-material";
import { DateTime } from "luxon";

// Namespace for client-side services to interact with the tasks API.
export namespace TasksDataClientService {
    // Base URL for the tasks API.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/task';
    Logger.debug(apiUrl);

    // Fetches all tasks using a GET request.
    export const fetchAllTasks = (): Promise<Task[]> => {
        Logger.debug('Fetching all tasks (in TasksDataClientService)')
        return axios.get(apiUrl, {
            headers: {
                'cache-control': 'no-cache'
            }
        }).then(response => sortTaskByMostUrgent(response.data) as Task[]);
    }

    // Saves a task using a POST request.
    export const saveTask = (task: Task): Promise<AxiosResponse> => {
        Logger.debug('Saving new task (in TasksDataClientService)')
        const url = `${apiUrl}/new`;
        return axios.post(url, task, {
            headers: {
                'Content-Type': 'application/json'
            }
        });    
    }

    // Deletes a task by ID using a DELETE request.
    export const deleteTaskById = (taskId: ObjectId): Promise<AxiosResponse> => {
        Logger.debug('Deleting task (in TasksDataClientService)')
        const url = `${apiUrl}/delete?id=${taskId.toString()}`;
        return axios.delete(url);
    }

    // Updates a task using a PUT request.
    export const updateTask = (task: Task): Promise<AxiosResponse> => {
        Logger.debug('Updating task (in TasksDataClientService)')
        const url = `${apiUrl}/update`;
        return axios.put(url, task);
    }

    export const formatTaskDate = (date: string) => DateTime.fromFormat(date, 'yyyy\'-\'MM\'-\'dd');


    export const sortTaskByMostUrgent = (tasks: Task[]): Task[] => 
        tasks.toSorted((taskA: Task, taskB: Task) => {
            if(!taskA.deadline) return 1;
            else if (!taskB.deadline) return -1;
            const deadlineA = formatTaskDate(taskA.deadline);
            const deadlineB = formatTaskDate(taskB.deadline);
            console.log(deadlineA, deadlineB)
            return deadlineA.toMillis() - deadlineB.toMillis();
        });
}
