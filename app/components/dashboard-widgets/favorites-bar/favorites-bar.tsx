"use client"

import { FavoriteItemType } from '@/app/types/favorites.type';
import FavoriteItem from './favorite-item';
import AddFavorite from './add-favorite';
import { useEffect, useState } from 'react';
import { clientFavoritesDataService } from '@/app/services/client/favorites-data.client.service';

import './favorites.scss';

export default function FavoritesBar({setIsLoading}: {setIsLoading?: (isLoading: boolean) => void}) {

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
        .then(setFavorites)
        .finally(() => setIsLoading && setIsLoading(false)).catch(console.error);
    }

    useEffect(() => {
        updateFavoritesList();
    }, [setFavorites]);

    return (
        <div className="card-content">
            <div className='card-main-panel favorites-bar actions-wrapper'>
                {favorites.map((item: FavoriteItemType, key: number) => <FavoriteItem setIsLoading={setIsLoading || (() => false)} key={`$favorite-item-{key}`} item={item} onFavoriteItemEdit={onFavoriteItemEdit} onFavoriteItemDelete={onFavoriteItemDelete}
                ></FavoriteItem>)}
                <AddFavorite setIsLoading={setIsLoading || (() => false)} updateFavoritesList={updateFavoritesList}></AddFavorite>
            </div>
        </div>
    );
}