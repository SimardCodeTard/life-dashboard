import { Collection, DeleteResult, InsertOneResult, MongoClient, ObjectId, ServerApiVersion, UpdateResult } from 'mongodb';
import { Task } from '../../types/task.type';
import { serverMongoDataService } from './mongod-data.server.service';

// Namespace encapsulating data access operations for tasks.
export namespace serverTasksDataService {
    const collectionName = 'tasks';

    // Gets the collection from the database.
    const getCollection = async (): Promise<Collection> => (await serverMongoDataService.getDb()).collection(collectionName);

    // Retrieves all tasks from the collection.
    export const findAllTasks = async (): Promise<Task[]> => serverMongoDataService.findAll<Task>(await getCollection());

    // Saves a single task to the collection.
    export const saveTask = async (task: Task): Promise<InsertOneResult> => serverMongoDataService.insertOne<Task>(await getCollection(), task);

    // Deletes a task by its ID from the collection.
    export const deleteTaskById = async (id: ObjectId): Promise<DeleteResult> => serverMongoDataService.deleteById(await getCollection(), id);

    // Updates a task by its ID in the collection.
    export const updateTask = async (task: Task): Promise<null | UpdateResult> => serverMongoDataService.updateOne<Task>(await getCollection(), task);

}
