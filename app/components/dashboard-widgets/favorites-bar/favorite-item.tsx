"use client"

import { FavoriteItemPropsType, FavoriteItemType } from '@/app/types/favorites.type';
import { MouseEvent, useState } from 'react';
import EditFavorite from './edit-favorite';

export default function FavoriteItem({ item, onFavoriteItemEdit, onFavoriteItemDelete }: FavoriteItemPropsType) {

    const [editModalOpened, setEditModalOpened] = useState(false);

    const onItemContextMenu = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const onItemClick = (e: MouseEvent<HTMLDivElement>) => {
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
            <div onClick={onItemClick} onContextMenu={onItemContextMenu} className='favorite-item'>
                <img width="22" height="22" src={item.url + "/favicon.ico"} alt={item.name.slice(0,2)} />
            </div>
            <EditFavorite item={item} onFavoriteItemEdit={onFavoriteItemEdit} onFavoriteItemDelete={onItemDelete} modalOpen={editModalOpened} setModalOpen={setEditModalOpened}
            ></EditFavorite>
        </>
    );
}
