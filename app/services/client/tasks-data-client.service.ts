import axios, { AxiosResponse } from "axios";
import { Task } from "../../types/task.type";
import { ObjectId } from "bson";

export namespace TasksDataClientService {

    const apiUrl = 'http://localhost:3000/api/v1/task';

    export const fetchAllTasks = (): Promise<Task[]> => {
        const url = apiUrl;
        return axios.get(url).then(res => {
            return res.data;
        });
    }

    export const saveTask = (task: Task): Promise<AxiosResponse> => {
        const url = apiUrl + '/new';
        const options = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return axios.post(url, task, options);    
    }

    export const deleteTaskById = (taskId: ObjectId): Promise<AxiosResponse> => {
        const url = apiUrl + `/delete?taskId=${taskId.toString()}`;
        return axios.delete(url)
    }

    export const updateTask = (task: Task): Promise<AxiosResponse> => {
        const url = apiUrl + "/update";
        return axios.put(url, task);
    }

}