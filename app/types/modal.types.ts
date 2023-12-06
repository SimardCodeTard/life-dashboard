export type ModalComponentPropsType = {
    children: JSX.Element, 
    externalModalOpenedState?: boolean, 
    externalSetModalOpenedState?: (modalOpened: boolean) => void
}