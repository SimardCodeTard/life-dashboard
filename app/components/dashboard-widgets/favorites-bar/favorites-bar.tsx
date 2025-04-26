'use client';
import { FavoriteItemType } from '@/app/types/favorites.type';
import FavoriteItem from './favorite-item';
import AddFavorite from './add-favorite';
import { useEffect, useState } from 'react';
import { clientFavoritesDataService } from '@/app/services/client/favorites-data.client.service';
import { ObjectId } from 'mongodb';

import './favorites.scss';
import { EventKeysEnum } from '@/app/enums/events.enum';
import { UserTypeClient } from '@/app/types/user.type';
import { getActiveSession } from '@/app/utils/indexed-db.utils';
import { userEventEmitter } from '@/app/utils/localstorage.utils';

export default function FavoritesBar({setIsLoading}: Readonly<{setIsLoading?: (isLoading: boolean) => void}>) {

    const [favorites, setFavorites] = useState<FavoriteItemType[]>([]);
    const [userId, setUserId] = useState<ObjectId>();

    const onFavoriteItemEdit = async (item: FavoriteItemType) => {
        await clientFavoritesDataService.updateFavoriteItem(item);
        updateFavoritesList();
    }

    const onFavoriteItemDelete = async (item: FavoriteItemType) => {
        item._id && (await clientFavoritesDataService.deleteFavoriteItem(item._id));
        const id = item._id;
        setFavorites(favorites.filter(item => item._id !== id));
        updateFavoritesList();
    }

    const updateFavoritesList = () => {
        userId && clientFavoritesDataService.findAllFavoriteItems(userId)
        .then(setFavorites)
        .finally(() => setIsLoading && setIsLoading(false)).catch(console.error);
    }

    useEffect(() => {
        updateFavoritesList();
    }, [setFavorites, userId]);

    useEffect(() => {
        getActiveSession().then(activeSession => {
            setUserId(activeSession?._id);
        });

        const onUserUpdate = (user: UserTypeClient) => {
            if(user) {
                setUserId(user._id);
            }
        }

        userEventEmitter.on(EventKeysEnum.USER_UPDATE, onUserUpdate);

        return () => {
            userEventEmitter.off(EventKeysEnum.USER_UPDATE, onUserUpdate);
        }
    }, [])

    return (
        <div className='card-content'>
            <div className='card-main-panel favorites-bar actions-wrapper'>
                {favorites.map((item: FavoriteItemType, key: number) => <FavoriteItem setIsLoading={setIsLoading || (() => false)} key={`$favorite-item-{key}`} item={item} onFavoriteItemEdit={onFavoriteItemEdit} onFavoriteItemDelete={onFavoriteItemDelete}
                ></FavoriteItem>)}
                <AddFavorite setIsLoading={setIsLoading || (() => false)} updateFavoritesList={updateFavoritesList}></AddFavorite>
            </div>
        </div>
    );
}