import { FavoriteItemType } from '@/app/types/favorites.type';
import FavoriteItem from './favorite-item';
import AddFavorite from './add-favorite';

export default async function FavoritesBar() {

    const mockFavoritesItem: FavoriteItemType[] = [
        {name: 'Youtube', url: 'https://youtube.com'},
        {name: 'Github', url: 'https://github.com'},
    ];

return (
    <div className={'mb-2 p-2 rounded-lg space-x-2 flex flex-row bg-[--card-background]'}>
        {mockFavoritesItem.map((item: FavoriteItemType, key: number) => <FavoriteItem key={key} item={item}></FavoriteItem>)}
        <AddFavorite></AddFavorite>
    </div>)
}