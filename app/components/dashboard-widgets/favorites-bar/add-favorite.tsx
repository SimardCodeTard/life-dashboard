"use client"
import { FavoritesDataClientService } from '@/app/services/client/favorites-data.client.service';
import { AddFavoritePropsType, FavoriteItemType } from '@/app/types/favorites.type';
import AddIcon from '@mui/icons-material/Add';  
import CloseIcon from '@mui/icons-material/Close';  
import { Modal } from '@mui/material';
import { FormEvent, useState } from 'react';


export default function AddFavorite({updateFavoritesList}: AddFavoritePropsType) {

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const openModal = () => {
        setModalOpen(true);
    }

    const onModalClose = () => {
        setModalOpen(false);
    }


    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const name: string = (e.target as any)[0].value;
        const url: string = FavoritesDataClientService.validateUrl((e.target as any)[1].value);
        const newFavoriteItem: FavoriteItemType = { name, url };
        if ((await FavoritesDataClientService.saveNewFavoriteItem(newFavoriteItem)).success) {
            updateFavoritesList();
        }
        onModalClose();
    }

    return (
        <>
            <AddIcon onClick={openModal} className='cursor-pointer'></AddIcon>
            <Modal className='modal outline-none border-none shadow-lg rounded-2xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-72' onClose={onModalClose} open={modalOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <div className='bg-[--card-background] backdrop-blur-lg flex flex-col justify-center items-center p-3 w-full h-full'>
                    <CloseIcon className='ml-auto cursor-pointer' onClick={onModalClose} ></CloseIcon>
                    <form onSubmit={handleFormSubmit} className='flex flex-col justify-center items-center w-full h-full'>
                        <input className='h-1/5 w-3/4 mb-2 bg-[rgba(255,255,255,0.2)] rounded p-1' type="text" placeholder='name'></input>
                        <input className='h-1/5 w-3/4 bg-[rgba(255,255,255,0.2)] rounded p-1' type="text" placeholder='url'></input>
                        <button className='h-1/4 w-3/4 mt-2 bg-[rgba(255,255,255,0.3)] rounded'>Save</button>
                    </form>
                </div>
            </Modal>

        </>
    )
}
