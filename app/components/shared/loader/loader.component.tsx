import { CircularProgress } from "@mui/material";

import './loader.scss';

export default function Loader() {
    return (
        <div className="loader">
            <CircularProgress color="primary" />
        </div>
    )
}