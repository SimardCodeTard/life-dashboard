import { MongodItemType } from "@/app/types/mongod.type";
import { Collection, Db, DeleteResult, InsertOneResult, MongoClient, ObjectId, ServerApiVersion, UpdateResult } from "mongodb";

export namespace MongoDataServerService {
    
    // Shared MongoClient instance.
    let client: MongoClient | undefined;

    // Database configuration constants.
    const dbName = process.env.NEXT_PUBLIC_DB_NAME as string;

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
    const closeClient = async () => {
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

    export const getDb = async (): Promise<Db> => (await getClient()).db(dbName);

    export const findAll = async <T extends MongodItemType> (collection: Collection): Promise<T[]> => {
        const items = await collection.find({}).toArray();
        closeClient();
        return items as unknown as T[]; 
    }

    export const deleteById = async (collection: Collection, id: ObjectId): Promise<DeleteResult> => {
        const result = await collection.deleteOne({_id: new ObjectId(id)});
        closeClient();
        return result;
    }

    export const insertOne = async <T extends MongodItemType> (collection: Collection, item: T): Promise<InsertOneResult> => {
        const result = await collection.insertOne({...item});
        closeClient();
        return result;
    }

    export const updateOne = async <T extends MongodItemType> (collection: Collection, item: T ): Promise<UpdateResult> => {
        const result = await collection.updateOne(
            {_id: new ObjectId(item._id)},
            {$set: {...item}}
        );
        closeClient()
        return result;
    }
}