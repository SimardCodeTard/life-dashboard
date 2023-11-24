"use client"
import { FavoriteItemPropsType } from '@/app/types/favorites.type'

export default function FavoriteItem({item}: FavoriteItemPropsType) {
    return (
    <div onClick={() => window.location.href = item.url} className={'flex flex-col justify-center cursor-pointer'}>
        <img width="22" height="22" src={item.url + "/favicon.ico"} alt={item.name}/>
    </div>)
}