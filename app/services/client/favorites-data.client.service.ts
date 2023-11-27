import { FavoriteItemType } from "@/app/types/favorites.type";
import assert from "assert";
import axios from "axios";

export namespace FavoritesDataClientService {

    const url = process.env.NEXT_PUBLIC_API_URL + "/favorites" as string;
    assert(url !== undefined);

    export const validateUrl = (url: string):string => (url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`);

    export const saveNewFavoriteItem = (item: FavoriteItemType) => axios.post(url + "/new", item).then(res => res.data);

    export const updateFavoriteItem = (item: FavoriteItemType) => axios.post(url + "/update", item).then(res => res.data);

    export const findAllFavoriteItems = () => axios.get(url).then(res => res.data.success ? res.data.favorites : []);
}