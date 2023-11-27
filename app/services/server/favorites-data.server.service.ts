import { FavoriteItemType } from "@/app/types/favorites.type";
import { MongoDataServerService } from "./mongod-data.server.service";
import { Collection, DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";

export namespace FavoritesDataServerService {

    const collectionName = "favorites"

    const getCollection = async (): Promise<Collection> => (await MongoDataServerService.getDb()).collection(collectionName);

    export const findAllFavorites = async (): Promise<FavoriteItemType[]> => MongoDataServerService.findAll<FavoriteItemType>(await getCollection());

    export const insertNewFavoriteItem = async (item: FavoriteItemType): Promise<InsertOneResult> => MongoDataServerService.insertOne<FavoriteItemType>(await getCollection(), item);

    export const deleteFavoriteItemById = async (id: ObjectId): Promise<DeleteResult> => MongoDataServerService.deleteById(await getCollection(), id);

    export const updateFavorite = async (favorite: FavoriteItemType): Promise<null | UpdateResult> => MongoDataServerService.updateOne<FavoriteItemType>(await getCollection(), favorite);
}