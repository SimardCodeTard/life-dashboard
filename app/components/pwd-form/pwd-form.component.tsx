'use client';;
import { clientLoginService } from "@/app/services/client/login.client.service";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react";
import { Person, PersonAdd } from "@mui/icons-material";

import './pwd-form.scss';
import { UserTypeClient, UserTypeServer } from "@/app/types/user.type";
import Checkbox from "../shared/checkbox.component";
import { getUserFromLocalStorage, setUserInLocalStorage } from "@/app/utils/localstorage.utils";
import { APIResponseStatuses } from "@/app/enums/api-response-statuses.enum";
import Loader from "../shared/loader/loader.component";

export default function PWDForm() {

    const getDefaultFormState = (): UserTypeServer => ({
        firstName: '',
        lastName: '',
        mail: '',
        password: '',
        role: 'user'
    });

    const [passwordInvalid, setPasswordInvalid] = useState(false); 
    const [userNotFound, setUserNotFound] = useState(false);
    const [mailConflict, setMailConflict] = useState(false);
    const [unknownError, setUnknownError] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [mailInvalid, setMailInvalid] = useState(false);
    const [missingFields, setMissingFields] = useState<string[]>([]);

    const [modeIsLogin, setModeIsLogin] = useState(false);

    const [formState, setFormState] = useState<UserTypeServer>(getDefaultFormState());
    const [passwordConfirmFormField, setPasswordConfirmFormField] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);


    const [user, setUser] = useState<UserTypeClient | undefined>(undefined);
    const [firstNameLabel, setFirstNameLabel] = useState<ReactNode>();

    const [isLoading, setIsLoading] = useState(true);

    const updateMissingFieldsState = () => {
        setMissingFields([]);
        const newMissingFields = [];

        if(!formState.mail) {
            newMissingFields.push('mail');
        }

        if(!formState.password) {
            newMissingFields.push('password');
        }

        if(!modeIsLogin) {
            if(!formState.firstName) {
                newMissingFields.push('firstName');
            }
            if(!formState.lastName) {
                newMissingFields.push('lastName');
            }
            if(!passwordConfirmFormField) {
                newMissingFields.push('password-confirm')
            }
        }

        setMissingFields(newMissingFields);
        return newMissingFields.length > 0;
    }

    const validateMail = (mail: string): boolean => {
        const mailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return mailRegex.test(mail);
    }

    const submitAction = () => {
        if(modeIsLogin) {
            return clientLoginService.login({mail: formState.mail, password: formState.password, keepLoggedIn});
        } else {
            return clientLoginService.register({user: formState, keepLoggedIn});
        }
    }

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        if(updateMissingFieldsState()) {
            return;
        }

        if(!modeIsLogin && formState.password !== passwordConfirmFormField) {
            setPasswordMismatch(true);
            return;
        }

        if(!validateMail(formState.mail)) {
            setMailInvalid(true);
            return;
        }

        setIsLoading(true);

        submitAction().then(() => {
            // Redirect to the dashboard
            window.location.replace('/dashboard');
        }).catch((e) => {
            if(e.status === APIResponseStatuses.FORBIDDEN) {
                setPasswordInvalid(true);
            } else if (e.status === APIResponseStatuses.NOT_FOUND) {
                setUserNotFound(true);
            } else if (e.status === APIResponseStatuses.CONFLICT) {
                setMailConflict(true);
            } else {
                setUnknownError(true);
            }

            setIsLoading(false);
        });

        if(unknownError || userNotFound || passwordInvalid) {
            return;
        }

        setFormState(getDefaultFormState());
        setPasswordConfirmFormField('');

    }

    useEffect(() => {
        const userInLocalStorage = getUserFromLocalStorage();

        if(userInLocalStorage) {
            setUser(userInLocalStorage)
        }

        clientLoginService.autoAuth().then((autoAuthResult) => {
            if(autoAuthResult.user) {
                setUserInLocalStorage(autoAuthResult.user);
            }

            if(autoAuthResult.result === true ) {
                window.location.replace('/dashboard')
            }

            setUser(autoAuthResult.user);
        }).catch();
    }, [clientLoginService])

    useEffect(() => {
        if(!user) {
            setIsLoading(false)
            return;
        }

        setFirstNameLabel(
            <>Welcome back, <b>{user?.firstName}</b></>
        );
    }, [user]);

    useEffect(() => {
        if(!user) {
            return;
        }
        
        setModeIsLogin(true)
    }, [firstNameLabel]);

    useEffect(() => {
        setPasswordInvalid(false);
        setUserNotFound(false);
        setUnknownError(false);
        setMailInvalid(false);
        setMailConflict(false);
        setMissingFields([]);
        setPasswordMismatch(false);
        setFormState(getDefaultFormState());
        setPasswordConfirmFormField('');

        if(modeIsLogin) {
            setIsLoading(false);
        }

      }, [modeIsLogin])

    const onFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.value) {
            setMissingFields(missingFields.filter(field => field !== 'firstName'));
        }

        setFormState({...formState, firstName: e.target.value});
    }

    const onLasttNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.value) {
            setMissingFields(missingFields.filter(field => field !== 'lastName'));
        }

        setFormState({...formState, lastName: e.target.value});
    }

    const onMailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMailConflict(false);
        setUserNotFound(false);
       
        if(e.target.value) {
            setMissingFields(missingFields.filter(field => field !== 'mail'));
        }
        if(validateMail(e.target.value)) {
            setMailInvalid(false);
        }

        setFormState({...formState, mail: e.target.value});
    }

    const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPasswordInvalid(false);
      
        if(e.target.value) {
            setMissingFields(missingFields.filter(field => field !== 'password'));
        }
        
        setFormState({...formState, password: e.target.value});
    }
    
    const onPasswordConfirmChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.value) {
            setMissingFields(missingFields.filter(field => field !== 'password-confirm'));
        } 
        if(e.target.value === formState.password) {
            setPasswordMismatch(false);
        }

        setPasswordConfirmFormField(e.target.value);
    }

    if(isLoading) {
        return <Loader></Loader>
    }

    const getFormTitle = (): ReactNode => {
        if(modeIsLogin) {
            if(firstNameLabel) {
                return <>
                    <h1>{firstNameLabel}</h1>
                    <h2>Please login to continue</h2>
                </>
            } else {
                return <h1>Please <b>login</b> to continue</h1>
            }
        } else {
            return <>
                <h1>Welcome to <b>Life Dashboard</b></h1>
                <h2>Please create an account to continue</h2>
            </>
        }
    }   

    return (
        <form className="pwd-form" onSubmit={onSubmit}>
            {isLoading && <Loader></Loader>}

            {getFormTitle()}

            {
                !modeIsLogin && <>
                    <label htmlFor="firstName">First Name</label>
                    <input 
                        value={formState.firstName} 
                        onChange={onFirstNameChange} 
                        type="text" 
                        name="firstName" 
                        placeholder="Enter your first name..." 
                        className={`${missingFields.includes('firstName') && 'error'}`}
                    />
                    {missingFields.includes('firstName') && <p className="error-text missing-field-error">First name is required.</p>}

                    <label htmlFor="lastName">Last Name</label>
                    <input 
                        value={formState.lastName} 
                        onChange={onLasttNameChange} 
                        type="text" name="lastName" 
                        placeholder="Enter your last name..." 
                        className={`${missingFields.includes('lastName') && 'error'}`}    
                    />
                    {missingFields.includes('lastName') && <p className="error-text missing-field-error">Last name is required.</p>}
                </>
            }

            <label htmlFor="mail">Email</label>
            <input 
                value={formState.mail} 
                onChange={onMailChange} 
                name="mail" 
                type="text" 
                className={`${(missingFields.includes('mail') || userNotFound || mailInvalid) && 'error'}`}
                placeholder="Enter your email address..."
            ></input>
            {missingFields.includes('mail') && <p className="error-text missing-field-error">Email address is required.</p>}
            
            <label htmlFor="password">Password</label>
            <input 
                value={formState.password} 
                onChange={onPasswordChange} 
                name="password" 
                type="password" 
                className={`${(missingFields.includes('password') || passwordInvalid) && 'error'}`} 
                placeholder="Enter your password..."
            />
            {missingFields.includes('password') && <p className="error-text missing-field-error">Password is required.</p>}
            
            {
                !modeIsLogin && <>
                    <label htmlFor="password-confirm">Confirm password</label>
                    <input 
                        value={passwordConfirmFormField}
                        onChange={onPasswordConfirmChange} 
                        name="password-confirm"
                        type="password"
                        placeholder="Re-enter your password"
                        className={` ${(missingFields.includes('password-confirm') || passwordMismatch) && 'error'}`}   
                    />
                    {missingFields.includes('password-confirm') && <p className="error-text missing-field-error">Please confirm your password.</p>}
                </>
            }

            <span className="keep-signed-in-check">
                <Checkbox name="keep-me-signed-in" onChange={(() => setKeepLoggedIn(!keepLoggedIn))} checked={keepLoggedIn}></Checkbox>
                <label htmlFor="keep-me-signed-in">Keep me signed in.</label>
            </span>
            
            <button type="submit" disabled={isLoading}>{
                modeIsLogin 
                    ? <><Person></Person>Login</>
                    : <><PersonAdd></PersonAdd>Register</>
            }</button>

            {!userNotFound && !mailConflict && <button type="button" className="subtitle toggle-form-mode" onClick={() => setModeIsLogin(!modeIsLogin)} >{modeIsLogin ? 'Not a member yet ?' : 'Already have an account ?'}</button>}
            
            {passwordMismatch && <p className="error-text">The passwords don&apos;t match.</p>}

            {
                (() => {
                    const renderErrorText = () => {
                        if (unknownError) {
                            return <p className="error-text">Sorry, you can&apos;t do that right now...</p>;
                        }
                        if (missingFields.length > 0) {
                            return <p className="error-text">Some fields are missing.</p>;
                        }
                        if (mailInvalid) {
                            return <p className="error-text">The email you entered is not valid.</p>;
                        }
                        if(mailConflict) {
                            return (
                                <p className="error-text">
                                    An account already exists for this email address, would you like to {' ' }
                                    <button
                                        type="button"
                                        className="subtitle toggle-form-mode"
                                        onClick={() => setModeIsLogin(true)}
                                    >
                                        login instead ?
                                    </button>
                                </p>
                            );
                        }
                        if (userNotFound) {
                            return (
                                <p className="error-text">
                                    No accounts were found for this email address, would you like to {' '}
                                    <button
                                        type="button"
                                        className="subtitle toggle-form-mode"
                                        onClick={() => setModeIsLogin(false)}
                                    >
                                        create an account instead ?
                                    </button>
                                </p>
                            );
                        }
                        if (passwordInvalid) {
                            return <p className="error-text">The password you entered was not valid.</p>;
                        }
                        return <></>;
                    };

                    return renderErrorText();
                })()
            }
        </form>
    )
}