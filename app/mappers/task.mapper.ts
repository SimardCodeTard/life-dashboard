import { DateTime } from "luxon";
import { TaskType, TaskTypeDto } from "../types/task.type";

/**
 * Formats a date string to a DateTime object.
 * @param {string} date - The date string to be formatted.
 * @returns {DateTime} - The formatted DateTime object.
 */
export const formatStringToTaskDate = (date: string): DateTime => DateTime.fromFormat(date, 'yyyy\'-\'MM\'-\'dd');

/**
 * Formats a DateTime object to a date string.
 * @param {DateTime} date - The DateTime object to be formatted.
 * @returns {string} - The formatted date string.
 */
const formatTaskDateToString = (date: DateTime): string => date.toFormat('yyyy\'-\'MM\'-\'dd');

/**
 * Maps a Task object to a TaskDto object.
 * @param {TaskType} task - The Task object to be mapped.
 * @returns {TaskTypeDto} - The mapped TaskDto object.
 */
export const mapTaskToTaskDto = (task: TaskType): TaskTypeDto => ({
    ...task,
    deadline: task.deadline ? formatTaskDateToString(task.deadline) : null
});

/**
 * Maps an array of Task objects to an array of TaskDto objects.
 * @param {TaskType[]} tasks - The array of Task objects to be mapped.
 * @returns {TaskTypeDto[]} - The array of mapped TaskDto objects.
 */
export const mapTaskToTaskDtoList = (tasks: TaskType[]): TaskTypeDto[] => tasks.map(mapTaskToTaskDto);

/**
 * Maps a TaskDto object to a Task object.
 * @param {TaskTypeDto} taskDto - The TaskDto object to be mapped.
 * @returns {TaskType} - The mapped Task object.
 */
export const mapTaskDtoToTask = (taskDto: TaskTypeDto): TaskType => ({
    ...taskDto,
    deadline: taskDto.deadline ? formatStringToTaskDate(taskDto.deadline) : undefined
});

/**
 * Maps an array of TaskDto objects to an array of Task objects.
 * @param {TaskTypeDto[]} tasksDto - The array of TaskDto objects to be mapped.
 * @returns {TaskType[]} - The array of mapped Task objects.
 */
export const mapTaskDtoToTaskList = (tasksDto: TaskTypeDto[]): TaskType[] => tasksDto?.map ? tasksDto.map(mapTaskDtoToTask) : [];
