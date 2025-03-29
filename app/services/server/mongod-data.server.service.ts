import { MongodItemType } from "@/app/types/mongod.type";
import {
    Collection,
    Db,
    DeleteResult,
    InsertManyResult,
    InsertOneResult,
    MongoClient,
    ObjectId,
    ServerApiVersion,
    UpdateResult,
} from "mongodb";
import { Logger } from "../logger.service";
import { APIBadRequestError } from "@/app/errors/api.error";

export namespace serverMongoDataService {
    
    // Shared MongoClient instance.
    let client: MongoClient | undefined;

    // Database configuration constants.
    const dbName = process.env.DB_NAME as string;
    const mongoUrl = process.env.MONGO_DB_URL_LOCAL || process.env.MONGO_DB_URI;
 
    // Options for MongoClient in production environment.
    const productionMongoClientOptions = process.env.NODE_ENV === 'production' ? {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    } : undefined;

    let pendingRequests = 0;

    /**
     * Wrapper function to handle pending requests.
     * @param operation - The operation to be performed.
     * @returns The result of the operation.
     */
    const withPendingRequests = async <T>(collectionName: string, operation: (collection: Collection) => Promise<T>): Promise<T> => {
        pendingRequests++;
        return getCollection(collectionName)
        .then(async collection => {
            const res = await operation(collection);
            Logger.debug('operation result : ' + JSON.stringify(res));
            return res;
        })
        .catch((err) => {
            Logger.error(`Error occured when execution operation : ${err.message}`)
            throw err as Error;
        })
        .finally(() => {
            pendingRequests --;
            return closeClient();
        });
    };

    /**
     * Closes the MongoClient and resets the client.
     */
    const closeClient = async () => {
        Logger.debug("trying to close client");
        if (client && pendingRequests === 0) {
            await client.close();
            client = undefined;
            Logger.debug("client closed");
        } else if (client) {
            Logger.debug("did not close client: requests still pending");
        } else {
            Logger.debug("did not close client: client already closed");
        }
    };

    /**
     * Retrieves or initializes the MongoClient.
     * @returns The MongoClient instance.
     */
    const getClient = async (): Promise<MongoClient> => {
        if (!client) {
            Logger.debug("Opening client.")
            client = new MongoClient(mongoUrl as string, productionMongoClientOptions);
            await client.connect();
        }
        return client;
    };

    /**
     * Retrieves the database instance.
     * @returns The database instance.
     */
    export const getDb = async (): Promise<Db> => (await getClient()).db(dbName);

    export const getCollection = async (collectionName: string): Promise<Collection> => (await getDb()).collection(collectionName)

    /**
     * Finds documents in a collection based on a query.
     * @param collectionName - The collection to search in.
     * @param query - The query to filter documents.
     * @returns An array of documents matching the query.
     */
    export const find = async <T extends MongodItemType>(collectionName: string, query: object): Promise<T[]> => {
        Logger.debug("Calling withPendingRequest prior to finding in collection " + collectionName + " with query " + JSON.stringify(query));
        return withPendingRequests(collectionName, async (collection) => {
            Logger.debug("Finding in collection " + collectionName + " with query " + JSON.stringify(query));
            return await collection.find(query).toArray() as T[];
        });
    };

    /**
         * Finds a document in a collection based on a query.
         * @param collection - The collection to search in.
         * @param query - The query to filter documents.
         * @returns An the document matching the query.
     */
    export const findOne = async <T extends MongodItemType>(collectionName: string, query: object): Promise<T | null> => {
        Logger.debug("Calling withPending Request prior to finding in collection " + collectionName + " with query " + JSON.stringify(query));
        return withPendingRequests(collectionName, async (collection) => {
            Logger.debug("Finding in collection " + collectionName + " with query " + JSON.stringify(query));
            return await collection.findOne(query) as T | null;
        });
    };

    /**
     * Finds all documents in a collection.
     * @param collection - The collection to search in.
     * @returns An array of all documents in the collection.
     */
    export const findAll = async <T extends MongodItemType>(collectionName: string, userId: string): Promise<T[]> => 
        find<T>(collectionName, { userId: userId })

    /**
     * Finds a document by its ID.
     * @param collection - The collection to search in.
     * @param id - The ID of the document to find.
     * @returns The document with the specified ID, or null if not found.
     */
    export const findById = async <T extends MongodItemType>(collectionName: string, id: ObjectId): Promise<T | null> => 
        findOne(collectionName, { _id: new ObjectId(id) }).then((result: MongodItemType | null) => result as T | null);

    /**
     * Finds documents by their IDs.
     * @param collection - The collection to search in.
     * @param ids - The IDs of the documents to find.
     * @returns An array of documents with the specified IDs.
     */
    export const findByIds = async <T extends MongodItemType>(collectionName: string, ids: ObjectId[]): Promise<T[]> => find(collectionName, { _id: { $in: ids } });
    
    /**
     * Deletes a document by its ID.
     * @param collection - The collection to delete from.
     * @param id - The ID of the document to delete.
     * @returns The result of the delete operation.
     */
    export const deleteById = async (collectionName: string, id: ObjectId): Promise<DeleteResult> => {
        Logger.debug("Calling withPendingRequests prior to deleting item with id " + id + " in collection " + collectionName);
        return withPendingRequests(collectionName, async (collection) => {
            Logger.debug("Deleting item with id " + id + " in collection " + collectionName);
            return await collection.deleteOne({ _id: new ObjectId(id) });
        });
    };

    export const deleteByQuery = async (collectionName: string, query: object): Promise<DeleteResult> => {
        Logger.debug('Calling withPendingRequests prior to deleting item with query ' + JSON.stringify(query) + ' in collection ' + collectionName);
        return withPendingRequests(collectionName, async (collection) => {
            Logger.debug('Deleting item with query ' + JSON.stringify(query) + ' in collection ' + collectionName);
            return await collection.deleteOne(query);
        });
    }

    /**
     * Inserts a document into a collection.
     * @param collection - The collection to insert into.
     * @param item - The document to insert.
     * @returns The result of the insert operation.
     */
    export const insertOne = async <T extends MongodItemType>(collectionName: string, item: T): Promise<InsertOneResult> => {
        Logger.debug("Calling with pending request prior to inserting item " + JSON.stringify(item) + " in collection " + collectionName);
        return withPendingRequests(collectionName, async (collection) => {
            Logger.debug("Inserting item " + JSON.stringify(item) + " in collection " + collectionName);
            return await collection.insertOne({ ...item });
        });
    };

    /**
     * Inserts multiple documents into a collection.
     * @param collection - The collection to insert into.
     * @param items - The documents to insert.
     * @returns The result of the insert operation.
     */
    export const insertMany = async <T extends MongodItemType>(collectionName: string, items: T[]): Promise<InsertManyResult> => {
        Logger.debug("Calling withPendingRequests prior to inserting items " + JSON.stringify(items) + " in collection " + collectionName);
        return withPendingRequests(collectionName, async (collection) => {
            Logger.debug("inserting items " + JSON.stringify(items) + " in collection " + collectionName);
            return await collection.insertMany(items);
        });
    };

    /**
     * Updates a document in a collection.
     * @param collection - The collection to update in.
     * @param item - The document to update.
     * @returns The result of the update operation, or null if the document has no ID.
     */
    export const updateOne = async <T extends MongodItemType>(collectionName: string, item: T): Promise<null | UpdateResult> => {
        const { _id, ...updateData } = item; // Destructure to separate _id from the rest of the data
        
        if (!_id) {
            throw new APIBadRequestError('Missing _id in request body');
        }

        Logger.debug("Calling withPendingRequest prior to updating item " + JSON.stringify(item) + " in collection " + collectionName);
        return withPendingRequests(collectionName, async (collection) => {
            Logger.debug("Updating item " + JSON.stringify(item) + " in collection " + collectionName);
            return await collection.updateOne(
                { _id: new ObjectId(_id) },
                { $set: updateData }
            );
        });
    };

    /**
     * Updates multiple documents in a collection.
     * @param collection - The collection to update in.
     * @param items - The documents to update.
     * @returns An array of results for each update operation.
     */
    export const updateMany = async <T extends MongodItemType>(collectionName: string, items: T[]): Promise<(UpdateResult | null)[]> => await Promise.all(items.map(item => updateOne(collectionName, item)));
}