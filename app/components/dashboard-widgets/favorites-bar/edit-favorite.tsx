import React, { ChangeEvent, FormEvent, useState } from 'react';
import { clientFavoritesDataService } from "@/app/services/client/favorites-data.client.service";
import { EditFavoritePropsType, FavoriteItemType } from "@/app/types/favorites.type";
import ModalComponent from '../../shared/modal.component';
import { Logger } from '@/app/services/logger.service';

export default function EditFavorite({item, onFavoriteItemEdit, onFavoriteItemDelete, modalOpen, setModalOpen, setIsLoading}: EditFavoritePropsType) {
    const [name, setName] = useState(item.name);
    const [url, setUrl] = useState(item.url);

    const handleFormSubmit = async (e: FormEvent) => {
        setIsLoading && setIsLoading(true);
        setModalOpen(false);
        e.preventDefault();
        const newFavoriteItem: FavoriteItemType = { _id: item._id, name, url: clientFavoritesDataService.validateUrl(url) };
        onFavoriteItemEdit(newFavoriteItem)
            .catch(Logger.error)
            .finally(() => setIsLoading && setIsLoading(false));
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
            <form onSubmit={handleFormSubmit}>
                <input autoFocus={true} onChange={onNameChange} value={name} type="text" placeholder='Name'></input>
                <input onChange={onUrlChange} value={url} type="text" placeholder='Url'></input>
                <button>Update</button>
                <button type='button' aria-roledescription='delete' onClick={handleDeleteButtonClick}>Delete</button>
            </form>
        </ModalComponent>
    );
}
