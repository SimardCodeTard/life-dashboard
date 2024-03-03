import { FavoriteItemType } from "@/app/types/favorites.type";
import { serverMongoDataService } from "./mongod-data.server.service";
import { Collection, DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";

export namespace serverFavoritesDataService {

    const collectionName = "favorites"

    const getCollection = async (): Promise<Collection> => (await serverMongoDataService.getDb()).collection(collectionName);

    export const findAllFavorites = async (): Promise<FavoriteItemType[]> => serverMongoDataService.findAll<FavoriteItemType>(await getCollection());

    export const insertNewFavoriteItem = async (item: FavoriteItemType): Promise<InsertOneResult> => serverMongoDataService.insertOne<FavoriteItemType>(await getCollection(), item);

    export const deleteFavoriteItemById = async (id: ObjectId): Promise<DeleteResult> => serverMongoDataService.deleteById(await getCollection(), id);

    export const updateFavorite = async (favorite: FavoriteItemType): Promise<null | UpdateResult> => serverMongoDataService.updateOne<FavoriteItemType>(await getCollection(), favorite);
}