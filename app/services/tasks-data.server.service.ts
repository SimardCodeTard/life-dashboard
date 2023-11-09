import { Collection, MongoClient, ObjectId } from 'mongodb';
import { Task } from '../types/task.type';

export namespace TasksDataServerService {

    let client: MongoClient;

    const dbName = 'life-dashboard';
    const collectionName = 'tasks'
    
    const url = 'mongodb://localhost:27017';

    const getConnection = async (): Promise<MongoClient> => {
        if(!client) {
            client = await MongoClient.connect(url);
        }
        return client;
    }

    const getCollection = async (): Promise<Collection> => getConnection().then((connection: MongoClient) => connection.db(dbName).collection(collectionName))

    export const findAllTasks = async (): Promise<Task[]> =>  (await getCollection()).find({}).toArray() as unknown as Task[];
    
    export const saveTask = async (task: Task): Promise<unknown>=>{
        return await (await getCollection()).insertOne({title: task.title, completed: task.completed, deadline: task?.deadline})
    }

    export const saveTasks = async (tasks: Task[]): Promise<void> => {
        const insertArray: Task[] = [];
        for(let task of tasks) {
            insertArray.push({title: task.title, completed: task.completed, deadline: task?.deadline})
        }
        (await getCollection()).insertMany(insertArray);
    }

    export const deleteTaskById = async (taskId: string): Promise<void> => {
        (await getCollection()).deleteOne({_id: new ObjectId(taskId)});
    }
}