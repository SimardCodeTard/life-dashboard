"use client"

import { FavoriteItemPropsType } from '@/app/types/favorites.type';
import { MouseEvent, useState } from 'react';
import EditFavorite from './edit-favorite';

export default function FavoriteItem({ item, onFavoriteItemEdit }: FavoriteItemPropsType) {

    const [editModalOpened, setEditModalOpened] = useState(false);

    const onItemClick = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        window.location.href = item.url;
    }

    const onItemContextMenu = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setEditModalOpened(true);
    }
    return (
        <>
            <div onClick={onItemClick} onContextMenu={onItemContextMenu} className={'flex flex-col justify-center cursor-pointer w-fit'}>
                <img width="22" height="22" src={item.url + "/favicon.ico"} alt={item.name} />
            </div>
            <EditFavorite item={item} onFavoriteItemEdit={onFavoriteItemEdit} modalOpen={editModalOpened} setModalOpen={setEditModalOpened}
            ></EditFavorite>
        </>
    );
}
