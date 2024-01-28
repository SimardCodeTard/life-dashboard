"use client"
import { clientFavoritesDataService } from '@/app/services/client/favorites-data.client.service';
import { AddFavoritePropsType, FavoriteItemType } from '@/app/types/favorites.type';
import AddIcon from '@mui/icons-material/Add';  
import { FormEvent, useState } from 'react';
import ModalComponent from '../../shared/modal.component';

export default function AddFavorite({updateFavoritesList}: AddFavoritePropsType) {

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const openModal = () => {
        setModalOpen(true);
    }

    const onModalClose = () => {
        setModalOpen(false);
    }


    const handleFormSubmit = async (e: FormEvent) => {
        onModalClose();
        e.preventDefault();
        const name: string = (e.target as any)[0].value;
        const url: string = clientFavoritesDataService.validateUrl((e.target as any)[1].value);
        const newFavoriteItem: FavoriteItemType = { name, url };
        if ((await clientFavoritesDataService.saveNewFavoriteItem(newFavoriteItem)).success) {
            updateFavoritesList();
        }
    }

    return (
        <>
            <AddIcon onClick={openModal} className='cursor-pointer'></AddIcon>
            <ModalComponent modalOpened={modalOpen} setModalOpened={setModalOpen}>
                <form onSubmit={handleFormSubmit} className='flex flex-col justify-center items-center w-full h-full'>
                    <input autoFocus={true} className='h-1/5 w-3/4 mb-2 bg-[rgba(255,255,255,0.2)] rounded p-1' type="text" placeholder='Name'></input>
                    <input className='h-1/5 w-3/4 bg-[rgba(255,255,255,0.2)] rounded p-1' type="text" placeholder='Url'></input>
                    <button className='h-1/4 w-3/4 mt-2 bg-[rgba(255,255,255,0.3)] rounded'>Save</button>
                </form>
            </ModalComponent>

        </>
    )
}
