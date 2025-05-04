"use client";
import Link from 'next/link';
import { useEffect, useState, MouseEvent } from 'react';
import FitbitSharpIcon from '@mui/icons-material/FitbitSharp';
import { Add, KeyboardArrowDown, Logout, Settings, SyncAlt } from '@mui/icons-material';
import ModalComponent from '../../shared/modal.component';
import { UserTypeClient } from '@/app/types/user.type';
import { userEventEmitter } from '@/app/utils/localstorage.utils';
import { EventKeysEnum } from '@/app/enums/events.enum';
import ThemeSelector from '../../shared/theme-selector/theme-selector';
import { clientLoginService } from '@/app/services/client/login.client.service';
import { getActiveSession, getAllSessions } from '@/app/utils/indexed-db.utils';
import { redirect } from "next/navigation";
import PWDForm from '../../shared/pwd-form/pwd-form.component';
import SessionSelector from '../../shared/session-selector/session-selector';

import './navbar.scss'

export default function NavBar() {
  const [tabs] = useState([{ href: '/dashboard', label: 'Dashboard' }]);
  const [currentPageHref, setCurrentPageHref] = useState('/');
  const [userModalOpened, setUserModalOpened] = useState(false);
  const [addUserModalOpened, setAddUserModalOpened] = useState(false);
  const [user, setUser] = useState<UserTypeClient>();
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);  

  useEffect(() => {
    getActiveSession().then(activeSession=> {
      setUser(activeSession);
    })

    getAllSessions().then((sessions) => {
      setShowSwitchAccount(sessions.length > 1);
    })

    const onUserUpdate = (user: UserTypeClient) => {
      if(user) {
        setUser(user);
      }
    }

    userEventEmitter.on(EventKeysEnum.USER_UPDATE, onUserUpdate);

    return () => {
      userEventEmitter.off(EventKeysEnum.USER_UPDATE, onUserUpdate);
    };
  }, []);

  const handleTabClick = (_: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    window.location.replace(href)
    setCurrentPageHref(href);
  }

  const onUserIconClicked = () => {
    setUserModalOpened(!userModalOpened);
  }

  const onSettingsClicked = (_: MouseEvent<HTMLDivElement>) => {
    setUserModalOpened(false);
    redirect('/settings');
  }

  const onAddAccountClicked = (_: MouseEvent<HTMLDivElement>) => {
    setAddUserModalOpened(true);
  }

  const onLogoutClicked = (_: MouseEvent<HTMLDivElement>) => {
    clientLoginService.logout().then(_ => {
      window.location.replace('/login');
    } );
  }

  const onNewUserAdded = () => {
    // window.location.reload();
  }

  const onShowRegisterFormButtonClicked = () => {
    setShowSwitchAccount(false);
  }

  return (
    <div className='navbar'>
      <Link href='/'
          onClick={(e) => handleTabClick(e, '/')}> 
        <span className="actions-wrapper">
          <FitbitSharpIcon></FitbitSharpIcon>
        </span>
      </Link>

      <span className="tabs-wrapper">
        {tabs.map((tab, _) => (
           <Link href={tab.href}
            className={`tab ${tab.href === currentPageHref && 'selected tab'}`}
            key={`tab${tab.label}`}
            onClick={(e) => handleTabClick(e, '/')}>
            {tab.label}
        </Link>
        ))}
      </span>

      <button className={`user-icon ${userModalOpened && 'deployed'}`} onClick={() => onUserIconClicked()}>
        <span className='user-badge'>{user?.firstName.substring(0, 1)}</span> {user?.firstName} <KeyboardArrowDown></KeyboardArrowDown> 
      </button>

      <ModalComponent className='user-modal' modalOpened={userModalOpened} setModalOpened={setUserModalOpened}>
        <div className='modal-content'>
          <div className="user-infos">
            <span className="user-badge">
              {user?.firstName.substring(0, 1)}
            </span>
            <p className="user-name">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="user-mail subtitle">
              {user?.mail}
            </p>
          </div>
          <ThemeSelector/>
          <div tabIndex={-2} onClick={onSettingsClicked} className="settings-link actions-wrapper">
            <Settings></Settings>
            <p>Settings</p>
          </div>
          <div className="add-account">
            <div onClick={onAddAccountClicked} tabIndex={-1} className="add-account-wrapper actions-wrapper">{
              showSwitchAccount 
              ? <> <SyncAlt></SyncAlt> <p>Switch account</p> </> 
              : <> <Add></Add> <p>Add an account</p> </>
            }</div>
          </div>
          <div tabIndex={0} onClick={onLogoutClicked} className="logout actions-wrapper">
            <Logout></Logout>
            <p>Logout</p>
          </div>
        </div>
      </ModalComponent>

      <ModalComponent className='add-user-modal' modalOpened={addUserModalOpened} setModalOpened={setAddUserModalOpened}>{
        showSwitchAccount ? <SessionSelector onShowRegisterFormButtonClicked={onShowRegisterFormButtonClicked} onSessionSelected={() => {
          setAddUserModalOpened(false);
          setUserModalOpened(false);
        }}></SessionSelector> : <PWDForm isAddingUser={true} onNewUserAdded={onNewUserAdded}></PWDForm>
      }
      </ModalComponent> 
    </div>
  );
}
