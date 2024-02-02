import { MongodItemType } from "@/app/types/mongod.type";
import { Collection, Db, DeleteResult, InsertOneResult, MongoClient, ObjectId, ServerApiVersion, UpdateResult } from "mongodb";
import { Logger } from "../logger.service";
import { APIInternalServerError } from "@/app/errors/api.error";

export namespace serverMongoDataService {
    
    // Shared MongoClient instance.
    let client: MongoClient | undefined;

    // Database configuration constants.
    const dbName = process.env.DB_NAME as string;

    // MongoDB URL logic to determine if it's running in development or production.
    const mongoUrl = process.env.MONGO_DB_URL_LOCAL ?? process.env.NEXT_PUBLIC_MONGODB_URI;

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
        let operationResult
        try {
            operationResult = await operation();
            Logger.debug('operation result : ' + JSON.stringify(operationResult))
            return operationResult;
        } catch (error: any) {
            throw new APIInternalServerError('Error in operation: ' + error.message);
        } finally {
            pendingRequests--;
            closeClient();
        }
    };

    // Closes the MongoClient and resets the client.
    const closeClient = async () => {
        Logger.debug("trying to close client")
        if (client && pendingRequests === 0) {
            await client.close();
            client = undefined;
            Logger.debug("client closed");
        } else if (client) {
            Logger.debug("did not close client: requests still pending");
            setTimeout(closeClient, 250);
        } else {
            Logger.debug("did not close client: client already closed");
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
        Logger.debug("finding all in collection " + collection.collectionName);
        return withPendingRequests(async () => {
            return await collection.find({}).toArray() as T[];
        });
    };

    export const deleteById = async (collection: Collection, id: ObjectId): Promise<DeleteResult> => {
        Logger.debug("deleting item with id " + id + " in collection " + collection.collectionName);
        return withPendingRequests(async () => {
            return await collection.deleteOne({_id: new ObjectId(id)});
        });
    };

    export const insertOne = async <T extends MongodItemType> (collection: Collection, item: T): Promise<InsertOneResult> => {
        Logger.debug("inserting item " + JSON.stringify(item) + " in collection " + collection.collectionName);
        return withPendingRequests(async () => {
            return await collection.insertOne({...item});
        });
    };

    export const updateOne = async <T extends MongodItemType> (collection: Collection, item: T): Promise<null | UpdateResult> => {
        Logger.debug("updating item " + JSON.stringify(item) + " in collection " + collection.collectionName);
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