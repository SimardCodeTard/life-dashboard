import Loader from "@/app/components/shared/loader/loader.component";
import { useState } from "react";

export default function GeneralSettings() {

    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState();

    return <div className="general-settings">
        {isLoading && <Loader></Loader>}
        <h2>General settings</h2>
    </div>
}