import { UserTypeClient } from '@/app/types/user.type'
import '../session-selector.scss'
import { Check, Login } from '@mui/icons-material'
import { useEffect, useState } from 'react';
import { getActiveUserId } from '@/app/utils/localstorage.utils'
import Loader from '../../loader/loader.component';
import { clientLoginService } from '@/app/services/client/login.client.service';
import { Logger } from '@/app/services/logger.service';

export default function SessionItem({session, onSessionSelected}: Readonly<{session: UserTypeClient, onSessionSelected: (session: UserTypeClient) => Promise<void>}>) {

    const [activeSessionId] = useState<string>(getActiveUserId() as string);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        console.log('use effect !!')
        if(session._id?.toString() === activeSessionId) {
            setIsLoading(false);
            return;
        }

        clientLoginService.validateTokens(session._id?.toString())
        .then((res) => {
            res.result && setSessionExpired(false);
        })
        .catch((err) => {
            Logger.error(err as Error)
            setSessionExpired(true);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [])

    return <div aria-disabled={activeSessionId === session._id?.toString() || sessionExpired} className="session-item actions-wrapper" onClick={async () => {
        if(activeSessionId === session._id?.toString() || sessionExpired) {
            return;
        }
        setIsLoading(true);
        await onSessionSelected(session);
        setIsLoading(false);
    }}>
        {isLoading && <Loader></Loader>}
        <div className="user-infos">
            <span className="user-badge">
              {session?.firstName.substring(0, 1)}
            </span>
            
            <div>
                <p className="user-name">
                    {session?.firstName} {session?.lastName}
                </p>
                <p className="user-mail subtitle">
                    {session?.mail}
                </p>

                {sessionExpired && <p className="error-text">This session expired, please log in again.</p>}
            </div>
        </div>
        <button disabled={activeSessionId === session._id?.toString()} className='session-select-button' >{
            activeSessionId === session._id?.toString()
                ? <Check></Check>
                : <Login></Login>
        }</button>
    </div>
}