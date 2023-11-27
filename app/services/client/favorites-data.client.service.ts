import { FavoriteItemType } from "@/app/types/favorites.type";
import assert from "assert";
import axios from "axios";

export namespace FavoritesDataClientService {

    const url = process.env.NEXT_PUBLIC_API_URL + "/favorites" as string;
    assert(url !== undefined);


    export const saveNewFavoriteItem = (item: FavoriteItemType) => axios.post(url + "/new", item).then(res => res.data);

    export const findAllFavoriteItems = () => axios.get(url).then(res => res.data.sucess ? res.data.favorites : []);
}