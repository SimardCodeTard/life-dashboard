import { Collection, DeleteResult, InsertOneResult, MongoClient, ObjectId, ServerApiVersion, UpdateResult } from 'mongodb';
import { Task } from '../../types/task.type';
import { MongoDataServerService } from './mongod-data.server.service';

// Namespace encapsulating data access operations for tasks.
export namespace TasksDataServerService {
    const collectionName = 'tasks';

    // Gets the collection from the database.
    const getCollection = async (): Promise<Collection> => (await MongoDataServerService.getDb()).collection(collectionName);

    // Retrieves all tasks from the collection.
    export const findAllTasks = async (): Promise<Task[]> => MongoDataServerService.findAll<Task>(await getCollection());

    // Saves a single task to the collection.
    export const saveTask = async (task: Task): Promise<InsertOneResult> => MongoDataServerService.insertOne<Task>(await getCollection(), task);

    // Deletes a task by its ID from the collection.
    export const deleteTaskById = async (id: ObjectId): Promise<DeleteResult> => MongoDataServerService.deleteById(await getCollection(), id);

    // Updates a task by its ID in the collection.
    export const updateTask = async (task: Task): Promise<null | UpdateResult> => MongoDataServerService.updateOne<Task>(await getCollection(), task);

}
