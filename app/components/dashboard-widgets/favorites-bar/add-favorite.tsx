"use client";
import { clientFavoritesDataService } from '@/app/services/client/favorites-data.client.service';
import { AddFavoritePropsType, FavoriteItemType } from '@/app/types/favorites.type';
import AddIcon from '@mui/icons-material/Add';
import { FormEvent, useEffect, useState } from 'react';
import ModalComponent from '../../shared/modal.component';
import { Logger } from '@/app/services/logger.service';
import { getUserFromLocalStorage } from '@/app/utils/localstorage.utils';
import { UserTypeClient } from '@/app/types/user.type';
import { ObjectId } from 'mongodb';
import { SaveAlt } from '@mui/icons-material';

import './favorites.scss';

export default function AddFavorite({updateFavoritesList, setIsLoading}: Readonly<AddFavoritePropsType>) {

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [user, setUser] = useState<UserTypeClient>();

    useEffect(() => {
        setUser(getUserFromLocalStorage() as UserTypeClient)
    }, [])

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
        const newFavoriteItem: FavoriteItemType = { name, url, userId: user?._id as ObjectId};
        setIsLoading && setIsLoading(true);
        try {
            await clientFavoritesDataService.saveNewFavoriteItem(newFavoriteItem).then(res => {
                if (res.acknowledged) {
                    updateFavoritesList();
                }
            });
        } catch(error) {
            Logger.error(error as Error);
        } finally {
            setIsLoading && setIsLoading(false);
        }
    }

    return (
        <div className="actions-wrapper">
            <AddIcon onClick={openModal} className='cursor-pointer'></AddIcon>
            <ModalComponent modalOpened={modalOpen} setModalOpened={setModalOpen}>
                <form className='new-favorite-form' onSubmit={handleFormSubmit}>
                    <h3>Create new favorite item...</h3>
                    <input autoFocus={true} type="text" placeholder='Name'></input>
                    <input type="text" placeholder='Url'></input>
                    <button><SaveAlt/> Save</button>
                </form>
            </ModalComponent>
        </div>
    )
}
