'use client';

import { UserTypeClient } from '@/app/types/user.type'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { SaveAlt } from '@mui/icons-material';

import './user-page.scss'
import '@/app/components/components.scss'
import { getActiveSession } from '@/app/utils/indexed-db.utils';

export default function UserPage() {

    const getDefaultUserFormState = (): UserTypeClient => ({
        firstName: '',
        lastName: '',
        mail: '',
        role: 'user',
    });

    const getDefaultPasswordFormState = (): {oldPassword: string, newPassword: string, confirmNewPassword: string} => ({
        oldPassword: '',
        newPassword: '', 
        confirmNewPassword: ''
    });

    const [userFormState, setUserFormState] = useState<UserTypeClient>(getDefaultUserFormState)
    const [passwordFormState, setPasswordFormState] = useState<{oldPassword: string, newPassword: string, confirmNewPassword: string}>(getDefaultPasswordFormState());
    const [editPassword, setEditPassword] = useState(false);

    useEffect(() => {
        (async () => {
            const user = await getActiveSession();
            if(!user) return;
            setUserFormState(user);
        })();   
    }, []);

    const onFirstNameFieldChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setUserFormState({...userFormState, firstName: e.target.value});
    }

    const onLastNameFieldChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setUserFormState({...userFormState, lastName: e.target.value});
    }

    const onMailFieldChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setUserFormState({...userFormState, mail: e.target.value});
    }

    const onOldPasswordFieldChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPasswordFormState({...passwordFormState, oldPassword: e.target.value});
    }

    const onNewPasswordFieldChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPasswordFormState({...passwordFormState, newPassword: e.target.value});
    }

    const onConfirmNewPasswordFieldChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPasswordFormState({...passwordFormState, confirmNewPassword: e.target.value});
    }

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
    }

    return <main className="login-page">
        <div className="card">
            <div className="card-content">
                <div className="card-main-panel">
                    <div className="card-header">
                        <h1>User settings</h1>
                    </div>

                    <form onSubmit={onSubmit} className="card-body">
                        <label htmlFor="firstName">First Name</label>
                        <input name='firstName' onChange={onFirstNameFieldChange} type="text" value={userFormState?.firstName} />

                        <label htmlFor="lastName">Last Name</label>
                        <input name='lastName' onChange={onLastNameFieldChange} type="text" value={userFormState?.lastName} />

                        <label htmlFor="mail">Email Address</label>
                        <input name='mail' onChange={onMailFieldChange} type="text" value={userFormState?.mail}/>

                        <button type='button' onClick={() => setEditPassword(!editPassword)} className="change-password-button">Change password</button>

                        {
                            editPassword ? <div className='password-form-subsction'>
                                <label htmlFor="old-passwrod">Password</label>
                                <input name='old-password' onChange={onOldPasswordFieldChange} type="text" value={passwordFormState?.oldPassword} />

                                <label htmlFor="new-password">First Name</label>
                                <input name='new-password' onChange={onNewPasswordFieldChange} type="text" value={passwordFormState?.newPassword}/>

                                <label htmlFor="firstName">First Name</label>
                                <input name='' type="text" onChange={onConfirmNewPasswordFieldChange} value={passwordFormState?.confirmNewPassword}/>
                            </div> : ''
                        } 

                        <button><SaveAlt></SaveAlt>Update</button>

                    </form>
                </div>
            </div>     
        </div>

    </main>
}