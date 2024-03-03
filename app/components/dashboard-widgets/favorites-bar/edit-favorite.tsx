import React, { ChangeEvent, FormEvent, useState } from 'react';
import { clientFavoritesDataService } from "@/app/services/client/favorites-data.client.service";
import { EditFavoritePropsType, FavoriteItemType } from "@/app/types/favorites.type";
import ModalComponent from '../../shared/modal.component';

export default function EditFavorite({item, onFavoriteItemEdit, onFavoriteItemDelete, modalOpen, setModalOpen}: EditFavoritePropsType) {
    const [name, setName] = useState(item.name);
    const [url, setUrl] = useState(item.url);

    const handleFormSubmit = async (e: FormEvent) => {
        setModalOpen(false);
        e.preventDefault();
        const newFavoriteItem: FavoriteItemType = { _id: item._id, name, url: clientFavoritesDataService.validateUrl(url) };
        onFavoriteItemEdit(newFavoriteItem);
    }

    const handleDeleteButtonClick = () => {
        onFavoriteItemDelete(item);
    }

    const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const onUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    }

    return (
        <ModalComponent modalOpened={modalOpen} setModalOpened={setModalOpen}>
            <form onSubmit={handleFormSubmit} className='flex flex-col justify-center items-center w-full h-full'>
                <input autoFocus={true} className='h-1/5 w-3/4 mb-2 bg-[rgba(255,255,255,0.2)] rounded p-1' onChange={onNameChange} value={name} type="text" placeholder='Name'></input>
                <input className='h-1/5 w-3/4 bg-[rgba(255,255,255,0.2)] rounded p-1' onChange={onUrlChange} value={url} type="text" placeholder='Url'></input>
                <button className='h-1/4 w-3/4 mt-2 bg-[rgba(255,255,255,0.3)] rounded'>Update</button>
                <button className='h-1/4 w-3/4 mt-2 bg-[rgba(255,0,0,0.5)] rounded' type='button' onClick={handleDeleteButtonClick}>Delete</button>
            </form>
        </ModalComponent>
    );
}
