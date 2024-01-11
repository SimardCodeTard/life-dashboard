import { ObjectId } from "mongodb"

export type FavoriteItemType = {
    _id?: ObjectId;
    name: string;
    url: string;
}

export type FavoriteItemPropsType = {
    item: FavoriteItemType;
    onFavoriteItemEdit: (item: FavoriteItemType) => Promise<void>;
    onFavoriteItemDelete: (item: FavoriteItemType) => Promise<void>;
}

export type AddFavoritePropsType = {
    updateFavoritesList: () => void;
}

export type EditFavoritePropsType = {
    item: FavoriteItemType;
    onFavoriteItemEdit: (item: FavoriteItemType) => Promise<void>;
    onFavoriteItemDelete: (item: FavoriteItemType) => Promise<void>;
    modalOpen: boolean;
    setModalOpen: (modalOpen: boolean) => void
}