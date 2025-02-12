import { MongodItemType } from "@/app/types/mongod.type";
import { Collection, Db, DeleteResult, InsertManyResult, InsertOneResult, MongoClient, ObjectId, ServerApiVersion, UpdateResult } from "mongodb";
import { Logger } from "../logger.service";
import { APIInternalServerError } from "@/app/errors/api.error";

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
    const withPendingRequests = async <T>(operation: () => Promise<T>): Promise<T> => {
        pendingRequests++;
        try {
            const operationResult = await operation();
            Logger.debug('operation result : ' + JSON.stringify(operationResult));
            return operationResult;
        } catch (error: any) {
            throw new APIInternalServerError('Error in operation: ' + error.message);
        } finally {
            pendingRequests--;
            closeClient();
        }
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

    /**
     * Finds documents in a collection based on a query.
     * @param collection - The collection to search in.
     * @param query - The query to filter documents.
     * @returns An array of documents matching the query.
     */
    export const find = async <T extends MongodItemType>(collection: Collection, query: object): Promise<T[]> => {
        Logger.debug("finding in collection " + collection.collectionName + " with query " + JSON.stringify(query));
        return withPendingRequests(async () => {
            return await collection.find(query).toArray() as T[];
        });
    };

    /**
     * Finds all documents in a collection.
     * @param collection - The collection to search in.
     * @returns An array of all documents in the collection.
     */
    export const findAll = async <T extends MongodItemType>(collection: Collection): Promise<T[]> => find<T>(collection, {});

    /**
     * Finds a document by its ID.
     * @param collection - The collection to search in.
     * @param id - The ID of the document to find.
     * @returns The document with the specified ID, or null if not found.
     */
    export const findById = async <T extends MongodItemType>(collection: Collection, id: ObjectId): Promise<T | null> => 
        find(collection, { _id: new ObjectId(id) }).then((result: MongodItemType[]) => result[0] as T);

    /**
     * Finds documents by their IDs.
     * @param collection - The collection to search in.
     * @param ids - The IDs of the documents to find.
     * @returns An array of documents with the specified IDs.
     */
    export const findByIds = async <T extends MongodItemType>(collection: Collection, ids: ObjectId[]): Promise<T[]> => {
        return find(collection, { _id: { $in: ids } });
    };

    /**
     * Deletes a document by its ID.
     * @param collection - The collection to delete from.
     * @param id - The ID of the document to delete.
     * @returns The result of the delete operation.
     */
    export const deleteById = async (collection: Collection, id: ObjectId): Promise<DeleteResult> => {
        Logger.debug("deleting item with id " + id + " in collection " + collection.collectionName);
        return withPendingRequests(async () => {
            return await collection.deleteOne({ _id: new ObjectId(id) });
        });
    };

    /**
     * Inserts a document into a collection.
     * @param collection - The collection to insert into.
     * @param item - The document to insert.
     * @returns The result of the insert operation.
     */
    export const insertOne = async <T extends MongodItemType>(collection: Collection, item: T): Promise<InsertOneResult> => {
        Logger.debug("inserting item " + JSON.stringify(item) + " in collection " + collection.collectionName);
        return withPendingRequests(async () => {
            return await collection.insertOne({ ...item });
        });
    };

    /**
     * Inserts multiple documents into a collection.
     * @param collection - The collection to insert into.
     * @param items - The documents to insert.
     * @returns The result of the insert operation.
     */
    export const insertMany = async <T extends MongodItemType>(collection: Collection, items: T[]): Promise<InsertManyResult> => {
        Logger.debug("inserting items " + JSON.stringify(items) + " in collection " + collection.collectionName);
        return withPendingRequests(async () => {
            return await collection.insertMany(items);
        });
    };

    /**
     * Updates a document in a collection.
     * @param collection - The collection to update in.
     * @param item - The document to update.
     * @returns The result of the update operation, or null if the document has no ID.
     */
    export const updateOne = async <T extends MongodItemType>(collection: Collection, item: T): Promise<null | UpdateResult> => {
        Logger.debug("updating item " + JSON.stringify(item) + " in collection " + collection.collectionName);
        const { _id, ...updateData } = item; // Destructure to separate _id from the rest of the data
        
        if (!_id) {
            return null;
        }

        return withPendingRequests(async () => {
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
    export const updateMany = async <T extends MongodItemType>(collection: Collection, items: T[]): Promise<(UpdateResult | null)[]> => {
        Logger.debug("updating items " + JSON.stringify(items) + " in collection " + collection.collectionName);
        
        const updatePromises = items.map(item => updateOne(collection, item));
        return await Promise.all(updatePromises);
    };
}