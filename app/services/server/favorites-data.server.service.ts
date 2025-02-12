import { FavoriteItemType } from "@/app/types/favorites.type";
import { serverMongoDataService } from "./mongod-data.server.service";
import { Collection, DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";

export namespace serverFavoritesDataService {

    const collectionName = "favorites";

    /**
     * Get the MongoDB collection for favorites.
     * @returns {Promise<Collection>} The favorites collection.
     */
    const getCollection = async (): Promise<Collection> => {
        const db = await serverMongoDataService.getDb();
        return db.collection(collectionName);
    };

    /**
     * Find all favorite items.
     * @returns {Promise<FavoriteItemType[]>} A promise that resolves to an array of favorite items.
     */
    export const findAllFavorites = async (userId: string): Promise<FavoriteItemType[]> => {
        const collection = await getCollection();
        return serverMongoDataService.findAll<FavoriteItemType>(collection, userId);
    };

    /**
     * Insert a new favorite item.
     * @param {FavoriteItemType} item - The favorite item to insert.
     * @returns {Promise<InsertOneResult>} A promise that resolves to the result of the insert operation.
     */
    export const insertNewFavoriteItem = async (item: FavoriteItemType): Promise<InsertOneResult> => {
        const collection = await getCollection();
        return serverMongoDataService.insertOne<FavoriteItemType>(collection, item);
    };

    /**
     * Delete a favorite item by its ID.
     * @param {ObjectId} id - The ID of the favorite item to delete.
     * @returns {Promise<DeleteResult>} A promise that resolves to the result of the delete operation.
     */
    export const deleteFavoriteItemById = async (id: ObjectId): Promise<DeleteResult> => {
        const collection = await getCollection();
        return serverMongoDataService.deleteById(collection, id);
    };

    /**
     * Update a favorite item.
     * @param {FavoriteItemType} favorite - The favorite item to update.
     * @returns {Promise<null | UpdateResult>} A promise that resolves to the result of the update operation.
     */
    export const updateFavorite = async (favorite: FavoriteItemType): Promise<null | UpdateResult> => {
        const collection = await getCollection();
        return serverMongoDataService.updateOne<FavoriteItemType>(collection, favorite);
    };
}