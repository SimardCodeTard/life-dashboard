import { CircularProgress } from "@mui/material";
import styles from './loader.module.css'

export default function Loader() {
    return (
        <div className={styles.loader}>
            <CircularProgress color="secondary" />
        </div>
    )
}