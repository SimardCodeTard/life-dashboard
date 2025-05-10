import Loader from "@/app/components/shared/loader/loader.component";
import { UserTypeClient } from "@/app/types/user.type";
import { getActiveSession } from "@/app/utils/indexed-db.utils";
import { useEffect, useState } from "react";

import '../settings.scss'

export default function UserSettings() {

    const [session, setSession] = useState<UserTypeClient>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getActiveSession().then(session => {
            setSession(session);
        }).finally(() => {
            setIsLoading(false);
        })
    }, []);

    return <div className="user-settings">
        {isLoading && <Loader></Loader>}
        <h2>User settings</h2>
    </div>
}