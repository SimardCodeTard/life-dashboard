import React, { ChangeEvent, FormEvent, useState } from 'react';
import { FavoritesDataClientService } from "@/app/services/client/favorites-data.client.service";
import { EditFavoritePropsType, FavoriteItemType } from "@/app/types/favorites.type";
import { Modal } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';  
import styles from './favorites.module.css';

export default function EditFavorite({item, onFavoriteItemEdit, onFavoriteItemDelete, modalOpen, setModalOpen}: EditFavoritePropsType) {
    const [name, setName] = useState(item.name);
    const [url, setUrl] = useState(item.url);

    const onModalClose = () => {
        setModalOpen(false);
    }

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const newFavoriteItem: FavoriteItemType = { _id: item._id, name, url: FavoritesDataClientService.validateUrl(url) };
        onFavoriteItemEdit(newFavoriteItem);
        onModalClose();
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
        <Modal className={['modal outline-none border-none shadow-lg rounded-2xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-72', styles.modal].join(' ')} 
            onClose={onModalClose} open={modalOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <div className='bg-[--card-background] backdrop-blur-lg flex flex-col justify-center items-center p-3 w-full h-full'>
                <CloseIcon className='ml-auto cursor-pointer' onClick={onModalClose} ></CloseIcon>
                <form onSubmit={handleFormSubmit} className='flex flex-col justify-center items-center w-full h-full'>
                    <input className='h-1/5 w-3/4 mb-2 bg-[rgba(255,255,255,0.2)] rounded p-1' onChange={onNameChange} value={name} type="text" placeholder='name'></input>
                    <input className='h-1/5 w-3/4 bg-[rgba(255,255,255,0.2)] rounded p-1' onChange={onUrlChange} value={url} type="text" placeholder='url'></input>
                    <button className='h-1/4 w-3/4 mt-2 bg-[rgba(255,255,255,0.3)] rounded'>Update</button>
                </form>
                <button className='h-1/4 w-3/4 mb-2 bg-[rgba(255,0,0,0.5)] rounded' type='button' onClick={handleDeleteButtonClick}>Delete</button>
            </div>
        </Modal>
    );
}
