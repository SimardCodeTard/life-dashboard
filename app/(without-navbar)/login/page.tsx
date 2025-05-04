'use client';;
import { UserTypeClient } from "@/app/types/user.type";
import PWDForm from "../../components/shared/pwd-form/pwd-form.component";

import './page.scss';
import { useEffect, useState } from "react";
import { clientLoginService } from "@/app/services/client/login.client.service";
import { getActiveSession } from "@/app/utils/indexed-db.utils";

export default function LoginPage() {

    const [user, setUser] = useState<UserTypeClient | undefined>(undefined);

    useEffect(() => {
        (async () => {
            const autoAuthResult = await clientLoginService.autoAuth();

            if(autoAuthResult.result === true ) {
                window.location.replace('/dashboard');
            } else {
                const activeSession= await getActiveSession();
                if(activeSession) {
                    setUser(activeSession);
                }
            }
        })()
    }, [clientLoginService]);

    return <div className='login-page'>{
        <PWDForm user={user} /> 
    }</div>
}