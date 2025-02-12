import { Collection, DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { Task } from '../../types/task.type';
import { serverMongoDataService } from './mongod-data.server.service';

/**
 * Namespace encapsulating data access operations for tasks.
 */
export namespace serverTasksDataService {
    const collectionName = 'tasks';

    /**
     * Gets the collection from the database.
     * @returns {Promise<Collection>} The tasks collection.
     */
    const getCollection = async (): Promise<Collection> => {
        const db = await serverMongoDataService.getDb();
        return db.collection(collectionName);
    };

    /**
     * Retrieves all tasks from the collection.
     * @returns {Promise<Task[]>} A promise that resolves to an array of tasks.
     */
    export const findAllTasks = async (): Promise<Task[]> => {
        const collection = await getCollection();
        return serverMongoDataService.findAll<Task>(collection);
    };

    /**
     * Saves a single task to the collection.
     * @param {Task} task - The task to save.
     * @returns {Promise<InsertOneResult>} A promise that resolves to the result of the insert operation.
     */
    export const saveTask = async (task: Task): Promise<InsertOneResult> => {
        const collection = await getCollection();
        return serverMongoDataService.insertOne<Task>(collection, task);
    };

    /**
     * Deletes a task by its ID from the collection.
     * @param {ObjectId} id - The ID of the task to delete.
     * @returns {Promise<DeleteResult>} A promise that resolves to the result of the delete operation.
     */
    export const deleteTaskById = async (id: ObjectId): Promise<DeleteResult> => {
        const collection = await getCollection();
        return serverMongoDataService.deleteById(collection, id);
    };

    /**
     * Updates a task by its ID in the collection.
     * @param {Task} task - The task to update.
     * @returns {Promise<null | UpdateResult>} A promise that resolves to the result of the update operation, or null if the task does not exist.
     */
    export const updateTask = async (task: Task): Promise<null | UpdateResult> => {
        const collection = await getCollection();
        return serverMongoDataService.updateOne<Task>(collection, task);
    };
}
