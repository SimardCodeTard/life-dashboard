"use client"

import { FavoriteItemPropsType } from '@/app/types/favorites.type';
import { MouseEvent, useState } from 'react';
import EditFavorite from './edit-favorite';

export default function FavoriteItem({ item, onFavoriteItemEdit, onFavoriteItemDelete }: FavoriteItemPropsType) {

    const [editModalOpened, setEditModalOpened] = useState(false);

    const onItemClick = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        window.location.href = item.url;
    }

    const onItemContextMenu = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const onItemAuxClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.button === 1) { // Middle click
            console.log(e);
            e.preventDefault();
            window.open(item.url, '_blank', 'noreferrer');
        } else if (e.button === 2) {
            setEditModalOpened(true);
        }
    }
    return (
        <>
            <div onClick={onItemClick} onContextMenu={onItemContextMenu} onAuxClick={onItemAuxClick} className={'flex flex-col justify-center cursor-pointer w-fit'}>
                <img width="22" height="22" src={item.url + "/favicon.ico"} alt={item.name.slice(0,2)} />
            </div>
            <EditFavorite item={item} onFavoriteItemEdit={onFavoriteItemEdit} onFavoriteItemDelete={onFavoriteItemDelete} modalOpen={editModalOpened} setModalOpen={setEditModalOpened}
            ></EditFavorite>
        </>
    );
}
