import { ObjectId } from "mongodb"
import { StaticImageData } from "next/image";

export type FavoriteItemType = {
    _id?: ObjectId;
    name: string;
    url: string;
}

export type FavoriteItemPropsType = {
    item: FavoriteItemType;
}