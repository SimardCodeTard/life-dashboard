import { ObjectId } from "mongodb"
import { UserTypeClient } from "./user.type";

export type FavoriteItemType = {
    _id?: ObjectId;
    userId: ObjectId;
    name: string;
    url: string;
}

export type FavoriteItemPropsType = {
    item: FavoriteItemType;
    onFavoriteItemEdit: (item: FavoriteItemType) => Promise<void>;
    onFavoriteItemDelete: (item: FavoriteItemType) => Promise<void>;
    setIsLoading: (isLoading: boolean) => void;
}

export type AddFavoritePropsType = {
    updateFavoritesList: () => void,
    setIsLoading: (isLoading: boolean) => void
}

export type EditFavoritePropsType = {
    item: FavoriteItemType;
    user: UserTypeClient;
    onFavoriteItemEdit: (item: FavoriteItemType) => Promise<void>;
    onFavoriteItemDelete: (item: FavoriteItemType) => Promise<void>;
    modalOpen: boolean;
    setModalOpen: (modalOpen: boolean) => void;
    setIsLoading?: (isLoading: boolean) => void;
}