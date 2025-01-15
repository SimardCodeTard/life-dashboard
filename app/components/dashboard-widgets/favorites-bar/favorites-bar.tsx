"use client"

import { FavoriteItemType } from '@/app/types/favorites.type';
import FavoriteItem from './favorite-item';
import AddFavorite from './add-favorite';
import { useEffect, useState } from 'react';
import { clientFavoritesDataService } from '@/app/services/client/favorites-data.client.service';

import './favorites.css'

export default function FavoritesBar() {

    const [favorites, setFavorites] = useState<FavoriteItemType[]>([]);

    const onFavoriteItemEdit = async (item: FavoriteItemType) => {
        await clientFavoritesDataService.updateFavoriteItem(item);
        updateFavoritesList();
    }

    const onFavoriteItemDelete = async (item: FavoriteItemType) => {
        item._id && await clientFavoritesDataService.deleteFavoriteItem(item._id);
        const id = item._id;
        setFavorites(favorites.filter(item => item._id !== id));
        updateFavoritesList();
    }

    const updateFavoritesList = () => {
        clientFavoritesDataService.findAllFavoriteItems()
        .then(setFavorites);
    }

    useEffect(() => {
        updateFavoritesList();
    }, [setFavorites]);

    return (
        <div className='favorites-bar actions-wrapper'>
            {favorites.map((item: FavoriteItemType, key: number) => <FavoriteItem key={key} item={item} onFavoriteItemEdit={onFavoriteItemEdit} onFavoriteItemDelete={onFavoriteItemDelete}
            ></FavoriteItem>)}
            <AddFavorite updateFavoritesList={updateFavoritesList}></AddFavorite>
        </div>
    );
}