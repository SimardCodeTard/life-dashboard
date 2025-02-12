import { AxiosResponse } from 'axios';
import { Task, TaskDto } from "../../types/task.type";
import { ObjectId } from "bson";
import { Logger } from "../logger.service";
import { DateTime } from "luxon";
import { axiosClientService } from './axios.client.service';

// Namespace for client-side services to interact with the tasks API.
export namespace clientTaskDataService {
    // Base URL for the tasks API.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/task';

    /**
     * Fetches all tasks using a GET request.
     * @returns {Promise<TaskDto[]>} - A promise that resolves to an array of TaskDto.
     */
    export const fetchAllTasks = (): Promise<TaskDto[]> => {
        Logger.debug('Fetching all tasks (in TasksDataClientService)');
        return axiosClientService.GET<TaskDto[]>(apiUrl, {
            'cache-control': 'no-cache'
        }).then(response => sortTaskDtoByMostUrgent(response.data));
    }

    /**
     * Saves a task using a POST request.
     * @param {TaskDto} task - The task to be saved.
     * @returns {Promise<AxiosResponse<{success: boolean}>>} - A promise that resolves to the response of the POST request.
     */
    export const saveTask = (task: TaskDto): Promise<AxiosResponse<{ success: boolean }>> => {
        Logger.debug('Saving new task (in TasksDataClientService)');
        const url = `${apiUrl}/new`;
        return axiosClientService.POST<{ success: boolean }>(url, task, {
            'Content-Type': 'application/json'
        });
    }

    /**
     * Deletes a task by ID using a DELETE request.
     * @param {ObjectId} taskId - The ID of the task to be deleted.
     * @returns {Promise<AxiosResponse<{ success: boolean }>>} - A promise that resolves to the response of the DELETE request.
     */
    export const deleteTaskById = (taskId: ObjectId): Promise<AxiosResponse<{ success: boolean }>> => {
        Logger.debug('Deleting task (in TasksDataClientService) with id: ' + taskId);
        const url = `${apiUrl}/delete?id=${taskId.toString()}`;
        return axiosClientService.DELETE<{ success: boolean }>(url);
    }

    /**
     * Updates a task using a PUT request.
     * @param {TaskDto} task - The task to be updated.
     * @returns {Promise<AxiosResponse<{ success: boolean }>>} - A promise that resolves to the response of the PUT request.
     */
    export const updateTask = (task: TaskDto): Promise<AxiosResponse<{ success: boolean }>> => {
        Logger.debug('Updating task (in TasksDataClientService)');
        const url = `${apiUrl}/update`;
        return axiosClientService.PUT<{ success: boolean }>(url, task);
    }

    /**
     * Formats a date string to a DateTime object.
     * @param {string} date - The date string to be formatted.
     * @returns {DateTime} - The formatted DateTime object.
     */
    export const formatTaskDate = (date: string): DateTime => DateTime.fromFormat(date, 'yyyy\'-\'MM\'-\'dd');

    /**
     * Formats a DateTime object to a date string.
     * @param {DateTime} date - The DateTime object to be formatted.
     * @returns {string} - The formatted date string.
     */
    const formatTaskDateToInput = (date: DateTime): string => date.toFormat('yyyy\'-\'MM\'-\'dd');

    /**
     * Maps a Task object to a TaskDto object.
     * @param {Task} task - The Task object to be mapped.
     * @returns {TaskDto} - The mapped TaskDto object.
     */
    export const mapTaskToTaskDto = (task: Task): TaskDto => ({
        ...task,
        deadline: task.deadline ? formatTaskDateToInput(task.deadline) : undefined
    });

    /**
     * Maps an array of Task objects to an array of TaskDto objects.
     * @param {Task[]} tasks - The array of Task objects to be mapped.
     * @returns {TaskDto[]} - The array of mapped TaskDto objects.
     */
    export const mapTaskToTaskDtoList = (tasks: Task[]): TaskDto[] => tasks.map(mapTaskToTaskDto);

    /**
     * Maps a TaskDto object to a Task object.
     * @param {TaskDto} taskDto - The TaskDto object to be mapped.
     * @returns {Task} - The mapped Task object.
     */
    export const mapTaskDtoToTask = (taskDto: TaskDto): Task => ({
        ...taskDto,
        deadline: taskDto.deadline ? formatTaskDate(taskDto.deadline) : undefined
    });

    /**
     * Maps an array of TaskDto objects to an array of Task objects.
     * @param {TaskDto[]} tasksDto - The array of TaskDto objects to be mapped.
     * @returns {Task[]} - The array of mapped Task objects.
     */
    export const mapTaskDtoToTaskList = (tasksDto: TaskDto[]): Task[] => tasksDto.map(mapTaskDtoToTask);

    /**
     * Sorts an array of TaskDto objects by the most urgent deadline.
     * @param {TaskDto[]} tasks - The array of TaskDto objects to be sorted.
     * @returns {TaskDto[]} - The sorted array of TaskDto objects.
     */
    export const sortTaskDtoByMostUrgent = (tasks: TaskDto[]): TaskDto[] =>
        tasks.toSorted((taskA: TaskDto, taskB: TaskDto) => {
            if (!taskA.deadline) return 1;
            else if (!taskB.deadline) return -1;
            const deadlineA = formatTaskDate(taskA.deadline);
            const deadlineB = formatTaskDate(taskB.deadline);
            return deadlineA.toMillis() - deadlineB.toMillis();
        });
}
