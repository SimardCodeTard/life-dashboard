import axios, { AxiosResponse } from "axios";
import { Task } from "../../types/task.type";
import { ObjectId } from "bson";
import { Logger } from "../logger.service";

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
        }).then(response => response.data as Task[]);
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
        const url = `${apiUrl}/delete?taskId=${taskId.toString()}`;
        return axios.delete(url);
    }

    // Updates a task using a PUT request.
    export const updateTask = (task: Task): Promise<AxiosResponse> => {
        Logger.debug('Updating task (in TasksDataClientService)')
        const url = `${apiUrl}/update`;
        return axios.put(url, task);
    }
}
