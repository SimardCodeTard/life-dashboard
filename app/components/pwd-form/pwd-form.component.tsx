'use client'

import { clientLoginService } from "@/app/services/client/login.client.service";
import { FormEvent, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { Logger } from "@/app/services/logger.service";

import './pwd-form.css';

export default function PWDForm() {

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false); 


    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const password = (e.target as any)[0].value; 
        (e.target as any)[0].value = '';
        setIsLoggingIn(true);
        clientLoginService.login(password, undefined, undefined)
        .then((res) => {
            Logger.debug('Login successful');

            // Save the token in a cookie
            Cookies.set('token', res.token, { expires: 1 });

            // Save the refresh token in a cookie
            Cookies.set('refresh-token', res.refreshToken);

            setIsLoggingIn(false);

            // Redirect to the dashboard
            window.location.href = '/dashboard';
        }).catch(() => {
            setIsLoggingIn(false);
            setPasswordInvalid(true);
            Logger.debug('Login failed');
        })
    }

    useEffect(() => {
        clientLoginService.autoAuth()
        .then(res => {
            res === true 
            ? window.location.replace('/dashboard')
            : null
        })
    }, [clientLoginService, window])

    return (
        <>
            <form className="pdw-form" onSubmit={onSubmit}>
                <input type="password" autoFocus/>
                <button type="submit" disabled={isLoggingIn as boolean}>Login</button>
            </form>
            {passwordInvalid && <p className="error-text">Invalid password</p>}
        </>
    )
}