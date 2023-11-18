import { Collection, MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { Task } from '../../types/task.type';

// Namespace encapsulating data access operations for tasks.
export namespace TasksDataServerService {
    // Shared MongoClient instance.
    let client: MongoClient | undefined;

    // Database configuration constants.
    const dbName = process.env.NEXT_PUBLIC_DB_NAME as string;
    const collectionName = 'tasks';

    // MongoDB URL logic to determine if it's running in development or production.
    const mongoUrl = process.env.NEXT_PUBLIC_MONGO_DB_URL_LOCAL ?? process.env.NEXT_PUBLIC_MONGODB_URI;

    // Options for MongoClient in production environment.
    const productionMongoClientOptions = process.env.NODE_ENV === 'production' ? {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    } : undefined;

    // Closes the MongoClient and resets the client.
    export const closeClient = async () => {
        if (client) {
            await client.close();
            client = undefined;
        }
    };

    // Retrieves or initializes the MongoClient.
    const getClient = async (): Promise<MongoClient> => {
        if (!client) {
            client = new MongoClient(
                mongoUrl as string,
                productionMongoClientOptions
            );
            await client.connect();
        }
        return client;
    };

    // Gets the collection from the database.
    const getTasksCollection = async (): Promise<Collection> => {
        const connection = await getClient();
        return connection.db(dbName).collection(collectionName);
    };

    // Retrieves all tasks from the collection.
    export const findAllTasks = async (): Promise<Task[]> => {
        const tasksCollection = await getTasksCollection();
        const tasks = await tasksCollection.find({}).toArray() as Task[];
        await closeClient();
        return tasks;
    };

    // Saves a single task to the collection.
    export const saveTask = async (task: Task): Promise<unknown> => {
        const { title, completed, deadline } = task;
        const tasksCollection = await getTasksCollection();
        const result = await tasksCollection.insertOne({ title, completed, deadline });
        await closeClient();
        return result;
    };

    // Saves multiple tasks to the collection.
    export const saveTasks = async (tasks: Task[]): Promise<void> => {
        const insertArray = tasks.map(({ title, completed, deadline }) => ({ title, completed, deadline }));
        if (insertArray.length > 0) {
            const tasksCollection = await getTasksCollection();
            await tasksCollection.insertMany(insertArray);
        }
        await closeClient();
    };

    // Deletes a task by its ID from the collection.
    export const deleteTaskById = async (taskId: string): Promise<void> => {
        const tasksCollection = await getTasksCollection();
        await tasksCollection.deleteOne({ _id: new ObjectId(taskId) });
        await closeClient();
    };

    // Updates a task by its ID in the collection.
    export const updateTask = async (task: Task): Promise<void> => {
        const { _id, title, deadline, completed } = task;
        const tasksCollection = await getTasksCollection();
        await tasksCollection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: { title, deadline, completed } }
        );
        await closeClient();
    }
}
