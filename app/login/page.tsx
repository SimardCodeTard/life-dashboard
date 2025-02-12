'use client'

import { useEffect, useState } from "react";
import PWDForm from "../components/pwd-form/pwd-form.component";
import Card from "../components/shared/card.component";
import { clientLoginService } from "../services/client/login.client.service";
import Loader from "../components/shared/loader/loader.component";

export default function LoginPage() {

    const [isAutomaticallyLoggingIn, setIsAutomaticallyLoggingIn] = useState(true);

    useEffect(() => {
        clientLoginService.autoAuth()
        .finally(() => setIsAutomaticallyLoggingIn(false))
    }, [clientLoginService]);

    return <>{
        isAutomaticallyLoggingIn  
        ? <Loader></Loader>
        : <div className="flex flex-col pt-24 items-center h-screen">
            <Card>
                <div className="p-4 space-y-4 flex flex-col w-full items-center">
                    <h1>Welcome to Life Dashboard</h1>
                    <h2>Please enter your password to continue</h2>
                    <PWDForm/>    
                </div>
            </Card>
        </div>
    }</>
}