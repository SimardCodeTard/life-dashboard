import { MongodItemType } from "@/app/types/mongod.type";
import { DateTime } from "luxon";
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

    let pendingRequests = 0;

    // Wrapper function to handle pending requests
    const withPendingRequests = async <T>(operation: () => Promise<T>): Promise<T> => {
        pendingRequests++;
        try {
            return await operation();
        } catch (error) {
            console.error(DateTime.now().toISO(), ": Error in operation", error);
            throw error;
        } finally {
            pendingRequests--;
            closeClient();
        }
    };

    // Closes the MongoClient and resets the client.
    const closeClient = async () => {
        console.log(DateTime.now().toISO(),  ": trying to close client")
        if (client && pendingRequests === 0) {
            await client.close();
            client = undefined;
            console.log(DateTime.now().toISO(),  ": client closed")
        } else if (client) {
            console.log(DateTime.now().toISO(),  ": did not close client: requests still pending");
            setTimeout(closeClient, 250);
        } else {
            console.log(DateTime.now().toISO(),  ": did not close client: client already closed");
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
        console.log(DateTime.now().toISO(),  ": finding all in collection", collection.collectionName);
        return withPendingRequests(async () => {
            return await collection.find({}).toArray() as T[];
        });
    };

    export const deleteById = async (collection: Collection, id: ObjectId): Promise<DeleteResult> => {
        console.log(DateTime.now().toISO(),  ": deleting item with id", id, "in collection", collection.collectionName);
        return withPendingRequests(async () => {
            return await collection.deleteOne({_id: new ObjectId(id)});
        });
    };

    export const insertOne = async <T extends MongodItemType> (collection: Collection, item: T): Promise<InsertOneResult> => {
        console.log(DateTime.now().toISO(),  ": inserting item", item, "in collection", collection.collectionName);
        return withPendingRequests(async () => {
            return await collection.insertOne({...item});
        });
    };

    export const updateOne = async <T extends MongodItemType> (collection: Collection, item: T): Promise<null | UpdateResult> => {
        console.log(DateTime.now().toISO(), ": updating item", item, "in collection", collection.collectionName);
    
        const { _id, ...updateData } = item; // Destructure to separate _id from the rest of the data
        
        if(!_id) {
            return null;
        }

        return withPendingRequests(async () => {
            return await collection.updateOne(
                { _id: new ObjectId(_id) },
                { $set: updateData }
            );
        });
    };
    
}