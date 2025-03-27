import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { TaskTypeDto } from '../../types/task.type';
import { serverMongoDataService } from './mongod-data.server.service';

/**
 * Namespace encapsulating data access operations for tasks.
 */
export namespace serverTasksDataService {
    const collectionName = 'tasks';

    export const findTaskById = async (taskId: ObjectId): Promise<TaskTypeDto | null> => {
        return serverMongoDataService.findById(collectionName, taskId);
    }

    /**
     * Retrieves all tasks from the collection.
     * @returns {Promise<TaskType[]>} A promise that resolves to an array of tasks.
     */
    export const findAllTasks = async (userId: string): Promise<TaskTypeDto[]> => {
        return serverMongoDataService.findAll<TaskTypeDto>(collectionName, userId);
    };

    /**
     * Saves a single task to the collection.
     * @param {TaskType} task - The task to save.
     * @returns {Promise<InsertOneResult>} A promise that resolves to the result of the insert operation.
     */
    export const saveTask = async (task: TaskTypeDto): Promise<InsertOneResult> => {
        return serverMongoDataService.insertOne<TaskTypeDto>(collectionName, task);
    };

    /**
     * Deletes a task by its ID from the collection.
     * @param {ObjectId} id - The ID of the task to delete.
     * @returns {Promise<DeleteResult>} A promise that resolves to the result of the delete operation.
     */
    export const deleteTaskById = async (id: ObjectId): Promise<DeleteResult> => {
        return serverMongoDataService.deleteById(collectionName, id);
    };

    /**
     * Updates a task by its ID in the collection.
     * @param {TaskType} task - The task to update.
     * @returns {Promise<null | UpdateResult>} A promise that resolves to the result of the update operation, or null if the task does not exist.
     */
    export const updateTask = async (task: TaskTypeDto): Promise<null | UpdateResult> => {
        return serverMongoDataService.updateOne<TaskTypeDto>(collectionName, task);
    };
}
