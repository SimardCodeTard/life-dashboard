'use client'

import { useEffect, useState } from 'react';
import './session-selector.scss';
import { UserTypeClient } from '@/app/types/user.type';
import { getAllSessions } from '@/app/utils/indexed-db.utils';
import SessionItem from './session-item/session-item';
import { Add } from '@mui/icons-material';
import { clientLoginService } from '@/app/services/client/login.client.service';
import { getActiveUserId } from '@/app/utils/localstorage.utils';
import { ObjectId } from 'mongodb';
import { AxiosError } from 'axios';
import { APIResponseStatuses } from '@/app/enums/api-response-statuses.enum';
import { Logger } from '@/app/services/logger.service';

export default function SessionSelector({
    onShowRegisterFormButtonClicked,
    onSessionSelected: closeModal,
}: Readonly<{
    onShowRegisterFormButtonClicked: () => void,
    onSessionSelected: () => void
}>) {

    const [sessions, setSesssions] = useState<UserTypeClient[]>([])
    const [unknwonError, setUnknownError] = useState(false);

    useEffect(() => {
        getAllSessions().then(setSesssions);    
    }, []);

    const onSessionSelected = async (session: UserTypeClient) => {

        try {
            const previousActiveUserId = getActiveUserId();
            Logger.debug(`Switching account with previousActiveUserId: ${previousActiveUserId}, new user id:${session._id?.toString()}`)
            await clientLoginService.switchAccount(session._id as ObjectId, previousActiveUserId as string);
            closeModal();
        } catch(err) {
            Logger.error(err as Error);
            if((err as AxiosError).status === APIResponseStatuses.FORBIDDEN) {
                Logger.debug('Session expired')
            } else if ((err as AxiosError).status === APIResponseStatuses.NOT_FOUND) {
                Logger.debug('Session not found')
            } else {
                setUnknownError(true);
            }
        }

        console.log('selected session:', session)
    }

    return <div className="session-selector">
        <h2>Select an account to continue</h2>
        <div className="session-selector-content">
            {sessions.map(session => 
                <SessionItem key={session._id?.toString()} session={session} onSessionSelected={onSessionSelected}></SessionItem>
            )}
            <button type="button" className="show-register-form-button" onClick={() => onShowRegisterFormButtonClicked()}
                ><Add></Add> Add an account
            </button>
            {unknwonError && <p className="error-text">Sorry, you can't do that right now...</p>}
        </div>
    </div>
}