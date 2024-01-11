import { Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';  
import styles from './shared.module.css';
import { ModalComponentPropsType } from "@/app/types/modal.types";


export default function ModalComponent ({children, modalOpened, setModalOpened}: ModalComponentPropsType) {

    const onModalClose = () => {
        setModalOpened(false);
    }

    return (
        <Modal open={modalOpened} onClose={onModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className={['outline-none border-none shadow-lg rounded-2xl h-fit w-72', styles.modal].join(' ')}>
            <div className={['bg-[--modal-background] rounded-xl flex flex-col justify-center items-center p-3 w-full h-full', styles.modalBody].join(' ')}>
                <CloseIcon className='ml-auto cursor-pointer' onClick={onModalClose} ></CloseIcon>
                {children}
            </div>

        </Modal>
    )
}