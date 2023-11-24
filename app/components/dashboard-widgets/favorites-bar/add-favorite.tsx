"use client"
import { FavoriteItemType } from '@/app/types/favorites.type';
import AddIcon from '@mui/icons-material/Add';  
import CloseIcon from '@mui/icons-material/Close';  
import { Modal } from '@mui/material';
import axios from 'axios';
import { FormEvent, useState } from 'react';


export default function AddFavorite() {

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const getPageNameFromUrl = (url: string):Promise<string> => {
        
        if(!url.startsWith('https://') && !url.startsWith('http://')) {
            url = 'https://' + url;
        }

        return axios.get(url).then(res => {
            const url = res.request.responseURL;    
            return url.split('/').pop()
        })
    }

    const openModal = () => {
        console.log('open modal')
        setModalOpen(true);
    }

    const onModalClose = () => {
        setModalOpen(false);
    }

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // const newFavoriteName: string = (e.target as any)[0].value;
        const newFavoriteUrl: string = (e.target as any)[0].value;
        const newFavoriteItem: FavoriteItemType = {
            name: await getPageNameFromUrl(newFavoriteUrl),
            url: newFavoriteUrl
        }
        onModalClose();
        console.log(newFavoriteItem);
    }

    return (
        <>
            <AddIcon onClick={openModal} className='cursor-pointer'></AddIcon>
            <Modal className='modal outline-none border-none shadow-lg rounded-2xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-72' onClose={onModalClose} open={modalOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <div className='bg-[--card-background] backdrop-blur-lg flex flex-col justify-center items-center p-3 w-full h-full'>
                    <CloseIcon className='ml-auto' onClick={onModalClose} ></CloseIcon>
                    <form onSubmit={handleFormSubmit} className='flex flex-col justify-center items-center w-full h-full'>
                        {/* <input className='h-1/5 w-3/4 mb-2 bg-[rgba(255,255,255,0.2)] rounded p-1' type="text" placeholder='name'></input> */}
                        <input className='h-1/5 w-3/4 bg-[rgba(255,255,255,0.2)] rounded p-1' type="text" placeholder='url'></input>
                        <button className='h-1/4 w-3/4 mt-2 bg-[rgba(255,255,255,0.3)] rounded'>Save</button>
                    </form>
                </div>
            </Modal>

        </>
    )
}
