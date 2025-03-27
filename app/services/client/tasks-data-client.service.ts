import { TaskType } from "../../types/task.type";
import { ObjectId } from "bson";
import { axiosClientService } from './axios.client.service';
import { TaskDeleteResponseType, TaskIdResponseType, TaskNewRequestBodyType, TaskNewResponseType, TaskResponseType, TaskUpdateRequestBodyType, TaskUpdateResponseType } from '@/app/types/api.type';
import { mapTaskDtoToTask, mapTaskDtoToTaskList, mapTaskToTaskDto } from "@/app/mappers/task.mapper";
import axios from "axios";

// Namespace for client-side services to interact with the tasks API.
export namespace clientTaskDataService {
    // Base URL for the tasks API.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/task';

    /**
     * Fetches all tasks using a GET request.
     * @returns {Promise<TaskTypeDto[]>} - A promise that resolves to an array of TaskDto.
     */
    export const fetchAllTasks = (userId: ObjectId): Promise<TaskType[]> => axiosClientService.GET<TaskResponseType>(`${apiUrl}?userId=${userId.toString()}`).then(res => res.data).then(mapTaskDtoToTaskList).then(tasks => sortTaskByMostUrgent(tasks));

    /**
     * Fetch a task by its id
     * @param taskId The id of the task
     * @returns The task
     */
    export const fetchTaskById = (taskId: ObjectId): Promise<TaskType> => axios.get<TaskIdResponseType>(`${apiUrl}/${taskId.toString()}`).then(res => res.data).then(mapTaskDtoToTask);

    /**
     * Saves a task using a POST request.
     * @param {TaskTypeDto} task - The task to be saved.
     * @returns {Promise<AxiosResponse<{success: boolean}>>} - A promise that resolves to the response of the POST request.
     */
    export const saveTask = (task: TaskType): Promise<TaskNewResponseType> => axiosClientService.POST<TaskNewResponseType, TaskNewRequestBodyType>(`${apiUrl}/new`, mapTaskToTaskDto(task)).then(res => res.data);

    /**
     * Deletes a task by ID using a DELETE request.
     * @param {ObjectId} taskId - The ID of the task to be deleted.
     * @returns {Promise<AxiosResponse<{ success: boolean }>>} - A promise that resolves to the response of the DELETE request.
     */
    export const deleteTaskById = (taskId: ObjectId): Promise<TaskDeleteResponseType> => axiosClientService.DELETE<TaskDeleteResponseType>(`${apiUrl}/delete?id=${taskId.toString()}`).then(res => res.data);

    /**
     * Updates a task using a PUT request.
     * @param {TaskTypeDto} task - The task to be updated.
     * @returns {Promise<AxiosResponse<{ success: boolean }>>} - A promise that resolves to the response of the PUT request.
     */
    export const updateTask = (task: TaskType): Promise<TaskUpdateResponseType> =>axiosClientService.PUT<TaskUpdateResponseType, TaskUpdateRequestBodyType>(`${apiUrl}/update`, mapTaskToTaskDto(task)).then(res => res.data);

    /**
     * Sorts an array of TaskDto objects by the most urgent deadline.
     * @param {TaskTypeDto[]} tasks - The array of TaskDto objects to be sorted.
     * @returns {TaskTypeDto[]} - The sorted array of TaskDto objects.
     */
    export const sortTaskByMostUrgent = (tasks: TaskType[]): TaskType[] =>
        tasks.toSorted((taskA: TaskType, taskB: TaskType) => {
            if (!taskA.deadline?.isValid) return 1;
            else if (!taskB.deadline?.isValid) return -1;
            const deadlineA = taskA.deadline;
            const deadlineB = taskB.deadline;
            return deadlineA.toMillis() - deadlineB.toMillis();
        });
}
