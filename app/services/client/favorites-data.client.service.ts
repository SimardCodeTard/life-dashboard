import { FavoriteItemType } from "@/app/types/favorites.type";
import assert from "assert";
import { ObjectId } from "mongodb";
import { axiosClientService } from "./axios.client.service";
import { FavoritesDeleteResponseType, FavoritesNewRequestBodyType, FavoritesNewResponseType, FavoritesResponseType, FavoritesUpdateRequestBodyType, FavoritesUpdateResponseType } from "@/app/types/api.type";

export namespace clientFavoritesDataService {

    // Base URL for the favorites API
    const url = process.env.NEXT_PUBLIC_API_URL + "/favorites" as string;
    assert(url !== undefined);

    /**
     * Validates and formats a URL to ensure it starts with 'http://' or 'https://'.
     * @param url - The URL to validate.
     * @returns The validated URL.
     */
    export const validateUrl = (url: string): string => {
        return (url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`);
    };

    /**
     * Saves a new favorite item.
     * @param item - The favorite item to save.
     * @returns A promise that resolves to the success status of the operation.
     */
    export const saveNewFavoriteItem = (item: FavoritesNewRequestBodyType) => {
        return axiosClientService.POST<FavoritesNewResponseType, FavoritesNewRequestBodyType>(`${url}/new`, item).then(res => res.data);
    };

    /**
     * Updates an existing favorite item.
     * @param item - The favorite item to update.
     * @returns A promise that resolves to the success status of the operation.
     */
    export const updateFavoriteItem = (item: FavoritesUpdateRequestBodyType) => {
        return axiosClientService.PUT<FavoritesUpdateResponseType, FavoritesUpdateRequestBodyType>(`${url}/update`, item).then(res => res.data);
    };

    /**
     * Deletes a favorite item by its ID.
     * @param id - The ID of the favorite item to delete.
     * @returns A promise that resolves to the success status of the operation.
     */
    export const deleteFavoriteItem = (id: ObjectId) => {
        return axiosClientService.DELETE<FavoritesDeleteResponseType>(`${url}/delete?id=${id.toString()}`).then(res => res.data);
    };

    /**
     * Retrieves all favorite items.
     * @returns A promise that resolves to an array of favorite items.
     */
    export const findAllFavoriteItems = (userId: ObjectId) => {
        return axiosClientService.GET<FavoritesResponseType>(`${url}?userId=${userId.toString()}`).then(res => res.data.length > 0 ? res.data : []);
    };
}
