"use client"

import { FavoriteItemType } from '@/app/types/favorites.type';
import FavoriteItem from './favorite-item';
import AddFavorite from './add-favorite';
import { useEffect, useState } from 'react';
import { FavoritesDataClientService } from '@/app/services/client/favorites-data.client.service';

export default function FavoritesBar() {

    const [favorites, setFavorites] = useState<FavoriteItemType[]>([]);

    const onFavoriteItemEdit = async (item: FavoriteItemType) => {
        await FavoritesDataClientService.updateFavoriteItem(item);
        updateFavoritesList();
    }

    const updateFavoritesList = () => {
        FavoritesDataClientService.findAllFavoriteItems()
        .then(setFavorites);
    }

    useEffect(() => {
        updateFavoritesList();
    }, [setFavorites]);

    return (
        <div className={'mb-2 p-2 rounded-lg space-x-2 flex flex-row w-fit bg-[--card-background]'}>
            {favorites.map((item: FavoriteItemType, key: number) => <FavoriteItem key={key} item={item} onFavoriteItemEdit={onFavoriteItemEdit}></FavoriteItem>)}
            <AddFavorite updateFavoritesList={updateFavoritesList}></AddFavorite>
        </div>
    );
}