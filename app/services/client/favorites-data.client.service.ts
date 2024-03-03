import { FavoriteItemType } from "@/app/types/favorites.type";
import assert from "assert";
import { ObjectId } from "mongodb";
import { axiosClientService } from "./axios.client.service";

export namespace clientFavoritesDataService {

    const url = process.env.NEXT_PUBLIC_API_URL + "/favorites" as string;
    assert(url !== undefined);

    export const validateUrl = (url: string):string => (url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`);

    export const saveNewFavoriteItem = (item: FavoriteItemType) => axiosClientService.POST<{success: boolean}>(url + "/new", item).then(res => res.data);

    export const updateFavoriteItem = (item: FavoriteItemType) => axiosClientService.POST<{success: boolean}>(url + "/update", item).then(res => res.data);

    export const deleteFavoriteItem = (id: ObjectId) => axiosClientService.DELETE<{success: boolean}>(url + `/delete?id=${id.toString()}`).then(res => res.data);

    export const findAllFavoriteItems = () => axiosClientService.GET<FavoriteItemType[]>(url).then(res => res.data.length > 0 ? res.data : []);
}
