"use client";
import { FavoriteItemPropsType, FavoriteItemType } from '@/app/types/favorites.type';
import { MouseEvent, useEffect, useState } from 'react';
import EditFavorite from './edit-favorite';
import { UserTypeClient } from '@/app/types/user.type';
import { getUserFromLocalStorage } from '@/app/utils/localstorage.utils';

export default function FavoriteItem({ item, onFavoriteItemEdit, onFavoriteItemDelete, setIsLoading }: Readonly<FavoriteItemPropsType>) {

    const [editModalOpened, setEditModalOpened] = useState(false);
    const [user, setUser] = useState<UserTypeClient>();

    useEffect(() => {
        setUser(getUserFromLocalStorage())
    }, []);    

    const onItemClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (e.button === 1 || e.ctrlKey) { // Middle click or Ctrl + click
            window.open(item.url, '_blank', 'noreferrer');
        } else if (e.button === 2) { // Right click
            setEditModalOpened(true);
        } else {
            window.location.href = item.url;
        }
    }

    const onItemDelete = async (item: FavoriteItemType) => {
        setEditModalOpened(false);
        onFavoriteItemDelete(item);
    }

    return (
        <>
            <button type='button' onClick={onItemClick} onContextMenu={onItemClick} className='favorite-item action-icon-wrapper'>
                <img width="22" height="22" src={item.url + "/favicon.ico"} alt={item.name.slice(0,2)} />
            </button>
            <EditFavorite setIsLoading={setIsLoading} item={item} user={user as UserTypeClient} onFavoriteItemEdit={onFavoriteItemEdit} onFavoriteItemDelete={onItemDelete} modalOpen={editModalOpened} setModalOpen={setEditModalOpened}
            ></EditFavorite>
        </>
    );
}
