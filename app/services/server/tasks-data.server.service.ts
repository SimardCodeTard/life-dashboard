import { Collection, MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { Task } from '../../types/task.type';

export namespace TasksDataServerService {

    let client: MongoClient | undefined;

    const dbName = 'life-dashboard';
    const collectionName = 'tasks';

    const mongoUrl =  process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_MONGO_DB_URL_LOCAL === undefined
        ? process.env.NEXT_PUBLIC_MONGO_DB_URL_LOCAL 
        : process.env.MONGO_DB_URI;
    
    const productionMongoClientOptions = {
        serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        }
    };

    export const closeClient = async () => {
        (await getClient()).close();
        client = undefined;
    }

    const getClient = async (): Promise<MongoClient> => {
        if(!client) {
            client = await MongoClient.connect(
                mongoUrl as string, 
                process.env.NODE_ENV === 'development' 
                ? undefined
                : productionMongoClientOptions
            );
        }
        return client;
    }

    const getCollection = async (): Promise<Collection> => await getClient().then((connection: MongoClient) => connection.db(dbName).collection(collectionName))

    export const findAllTasks = async (): Promise<Task[]> =>{
        const result = await (await getCollection()).find({}).toArray() as unknown as Task[]
        closeClient();
        return result;
    };

    
    export const saveTask = async (task: Task): Promise<unknown>=>{
        const result = task && await (await getCollection()).insertOne(
            {
                title: task.title,
                completed: task.completed, 
                deadline: task?.deadline
            }
        );
        closeClient();
        return result;
    }

    export const saveTasks = async (tasks: Task[]): Promise<void> => {
        const insertArray: Task[] = [];
        for(let task of tasks) {
            task && insertArray.push({title: task.title, completed: task.completed, deadline: task?.deadline})
        }
        insertArray.length > 0 && await (await getCollection()).insertMany(insertArray);
        closeClient();
    }

    export const deleteTaskById = async (taskId: string): Promise<void> => {
        taskId && await (await getCollection()).deleteOne({_id: new ObjectId(taskId)});
        closeClient();
    }

    export const updateTask = async (task: Task): Promise<void> => {
        task && task._id && await (await getCollection()).updateOne(
            {_id: new ObjectId(task._id)}, 
            {$set: {
                title: task.title,
                deadline: task.deadline,
                completed: task.completed
                }
            }
        );
        closeClient();
    }
}