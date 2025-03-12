import { Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';  
import { ModalComponentPropsType } from "@/app/types/modal.types";


export default function ModalComponent ({children, modalOpened, setModalOpened}: ModalComponentPropsType) {

    const onModalClose = () => {
        setModalOpened(false);
    }

    return (
        <Modal open={modalOpened} onClose={onModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className='modal'>
            <div className='modal-body'>
                <span className="actions-wrapper">
                    <CloseIcon onClick={onModalClose} ></CloseIcon>
                </span>
                {children}
            </div>

        </Modal>
    )
}