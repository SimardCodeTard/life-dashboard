'use client'

import { useEffect, useState } from "react";
import PWDForm from "../components/pwd-form/pwd-form.component";
import { clientLoginService } from "../services/client/login.client.service";
import Loader from "../components/shared/loader/loader.component";

import './page.scss'

export default function LoginPage() {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        clientLoginService.autoAuth()
        .finally(() => setIsLoading(false));
    }, [clientLoginService]);

    return <div className='login-page'>
        {isLoading  && <Loader></Loader>}
        <PWDForm/>   
    </div>
}