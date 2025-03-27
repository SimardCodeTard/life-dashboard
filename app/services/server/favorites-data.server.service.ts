import { FavoriteItemType } from "@/app/types/favorites.type";
import { serverMongoDataService } from "./mongod-data.server.service";
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";

export namespace serverFavoritesDataService {

    const collectionName = "favorites";

    /**
     * Find all favorite items.
     * @returns {Promise<FavoriteItemType[]>} A promise that resolves to an array of favorite items.
     */
    export const findAllFavorites = (userId: string): Promise<FavoriteItemType[]> => {
        return serverMongoDataService.findAll<FavoriteItemType>(collectionName, userId);
    };

    /**
     * Insert a new favorite item.
     * @param {FavoriteItemType} item - The favorite item to insert.
     * @returns {Promise<InsertOneResult>} A promise that resolves to the result of the insert operation.
     */
    export const insertNewFavoriteItem = (item: FavoriteItemType): Promise<InsertOneResult> => {
        return serverMongoDataService.insertOne<FavoriteItemType>(collectionName, item);
    };

    /**
     * Delete a favorite item by its ID.
     * @param {ObjectId} id - The ID of the favorite item to delete.
     * @returns {Promise<DeleteResult>} A promise that resolves to the result of the delete operation.
     */
    export const deleteFavoriteItemById = (id: ObjectId): Promise<DeleteResult> => {
        return serverMongoDataService.deleteById(collectionName, id);
    };

    /**
     * Update a favorite item.
     * @param {FavoriteItemType} favorite - The favorite item to update.
     * @returns {Promise<null | UpdateResult>} A promise that resolves to the result of the update operation.
     */
    export const updateFavorite = (favorite: FavoriteItemType): Promise<null | UpdateResult> => {
        return serverMongoDataService.updateOne<FavoriteItemType>(collectionName, favorite);
    };
}