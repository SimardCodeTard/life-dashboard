import { CircularProgress } from "@mui/material";

import './loader.css'

export default function Loader() {
    return (
        <div className="loader">
            <CircularProgress color="secondary" />
        </div>
    )
}