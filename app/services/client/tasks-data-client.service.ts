import { AxiosResponse } from 'axios';
import { Task, TaskDto } from "../../types/task.type";
import { ObjectId } from "bson";
import { Logger } from "../logger.service";
import { DateTime } from "luxon";
import {axiosClientService} from './axios.client.service'; 

// Namespace for client-side services to interact with the tasks API.
export namespace clientTaskDataService {
    // Base URL for the tasks API.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/task';

    // Fetches all tasks using a GET request.
    export const fetchAllTasks = (): Promise<TaskDto[]> => {
        Logger.debug('Fetching all tasks (in TasksDataClientService)')
        return axiosClientService.GET<TaskDto[]>(apiUrl, {
            'cache-control': 'no-cache'
        }).then(response => sortTaskDtoByMostUrgent(response.data));
    }

    // Saves a task using a POST request.
    export const saveTask = (task: Task): Promise<AxiosResponse<{success: boolean}>> => {
        Logger.debug('Saving new task (in TasksDataClientService)')
        const url = `${apiUrl}/new`;
        return axiosClientService.POST<{success: boolean}>(url, task, {
                'Content-Type': 'application/json'
            }
        );    
    }

    // Deletes a task by ID using a DELETE request.
    export const deleteTaskById = (taskId: ObjectId): Promise<AxiosResponse<{success: boolean}>> => {
        Logger.debug('Deleting task (in TasksDataClientService)')
        const url = `${apiUrl}/delete?id=${taskId.toString()}`;
        return axiosClientService.DELETE<{success: boolean}>(url);
    }

    // Updates a task using a PUT request.
    export const updateTask = (task: Task): Promise<AxiosResponse<{success: boolean}>> => {
        Logger.debug('Updating task (in TasksDataClientService)')
        const url = `${apiUrl}/update`;
        return axiosClientService.PUT<{success: boolean}>(url, task);
    }

    export const formatTaskDate = (date: string) => DateTime.fromFormat(date, 'yyyy\'-\'MM\'-\'dd');

    export const mapTaskToTaskDto = (task: Task): TaskDto => ({...task, deadline: task.deadline?.toISO() ?? undefined});

    export const mapTaskToTaskDtoList = (tasks: Task[]): TaskDto[] => tasks.map(mapTaskToTaskDto);

    export const mapTaskDtoToTask = (taskDto: TaskDto): Task => ({...taskDto, deadline: taskDto.deadline ? formatTaskDate(taskDto.deadline) : undefined});

    export const mapTaskDtoToTaskList = (tasksDto: TaskDto[]): Task[] => tasksDto.map(mapTaskDtoToTask);


    export const sortTaskDtoByMostUrgent = (tasks: TaskDto[]): TaskDto[] => 
        tasks.toSorted((taskA: TaskDto, taskB: TaskDto) => {
            if(!taskA.deadline) return 1;
            else if (!taskB.deadline) return -1;
            const deadlineA = formatTaskDate(taskA.deadline);
            const deadlineB = formatTaskDate(taskB.deadline);
            return deadlineA.toMillis() - deadlineB.toMillis();
        });
}
