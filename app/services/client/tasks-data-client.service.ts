import axios, { AxiosResponse } from "axios";
import { Task } from "../../types/task.type";
import { ObjectId } from "bson";

// Namespace for client-side services to interact with the tasks API.
export namespace TasksDataClientService {
    // Base URL for the tasks API.
    const apiUrl = 'http://localhost:3000/api/v1/task';

    // Fetches all tasks using a GET request.
    export const fetchAllTasks = (): Promise<Task[]> => {
        return axios.get(apiUrl).then(response => response.data as Task[]);
    }

    // Saves a task using a POST request.
    export const saveTask = (task: Task): Promise<AxiosResponse> => {
        const url = `${apiUrl}/new`;
        return axios.post(url, task, {
            headers: {
                'Content-Type': 'application/json'
            }
        });    
    }

    // Deletes a task by ID using a DELETE request.
    export const deleteTaskById = (taskId: ObjectId): Promise<AxiosResponse> => {
        const url = `${apiUrl}/delete?taskId=${taskId.toString()}`;
        return axios.delete(url);
    }

    // Updates a task using a PUT request.
    export const updateTask = (task: Task): Promise<AxiosResponse> => {
        const url = `${apiUrl}/update`;
        return axios.put(url, task);
    }
}
