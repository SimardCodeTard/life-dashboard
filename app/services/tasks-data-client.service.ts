import axios, { AxiosResponse } from "axios";
import { Task } from "../types/task.type";
import { ObjectId } from "bson";

export namespace TasksDataClientService {

    export const fetchAllTasks = (): Promise<Task[]> => {
        const url = 'http://localhost:3000/api/v1/task'
        return axios.get(url).then(res => {
            return res.data;
        });
    }

    export const saveTask = (task: Task): Promise<AxiosResponse> => {
        const url = 'http://localhost:3000/api/v1/task/new';
        const options = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return axios.post(url, task, options);    
    }

    export const deleteTaskById = (taskId: ObjectId): Promise<AxiosResponse> => {
        const url = `http://localhost:3000/api/v1/task/delete?taskId=${taskId.toString()}`;
        return axios.delete(url)
    }

}