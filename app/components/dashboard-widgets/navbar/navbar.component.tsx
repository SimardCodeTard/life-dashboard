"use client";;
import Link from 'next/link';
import { useEffect, useState, MouseEvent } from 'react';
import FitbitSharpIcon from '@mui/icons-material/FitbitSharp';
import { Add, KeyboardArrowDown, Logout, Settings } from '@mui/icons-material';
import ModalComponent from '../../shared/modal.component';
import { UserTypeClient } from '@/app/types/user.type';
import { userEventEmitter } from '@/app/utils/localstorage.utils';
import { EventKeysEnum } from '@/app/enums/events.enum';
import ThemeSelector from '../../shared/theme-selector/theme-selector';
import { clientLoginService } from '@/app/services/client/login.client.service';

import './navbar.scss'
import { getActiveSession } from '@/app/utils/indexed-db.utils';


export default function NavBar() {
  const [tabs] = useState([{ href: '/dashboard', label: 'Dashboard' }]);
  const [currentPageHref, setCurrentPageHref] = useState('/');
  const [modalOpened, setModalOpened] = useState(false);
  const [user, setUser] = useState<UserTypeClient>();

  useEffect(() => {
    getActiveSession().then(activeSession=> {
      setUser(activeSession);
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
    setModalOpened(!modalOpened);
  }

  const onSettingsClicked = (_: MouseEvent<HTMLDivElement>) => {

  }

  const onAddAccountClicked = (_: MouseEvent<HTMLDivElement>) => {

  }

  const onLogoutClicked = (_: MouseEvent<HTMLDivElement>) => {
    clientLoginService.logout().then(_ => {
      window.location.replace('/login');
    } );
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

      <button className={`user-icon ${modalOpened && 'deployed'}`} onClick={() => onUserIconClicked()}>
        <span className='user-badge'>{user?.firstName.substring(0, 1)}</span> {user?.firstName} <KeyboardArrowDown></KeyboardArrowDown> 
      </button>

      <ModalComponent className='user-modal' modalOpened={modalOpened} setModalOpened={setModalOpened}>
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
            <div onClick={onAddAccountClicked} tabIndex={-1} className="add-account-wrapper actions-wrapper">
              <Add></Add> 
              <p>Add an account</p>
            </div>
          </div>
          <div tabIndex={0} onClick={onLogoutClicked} className="logout actions-wrapper">
            <Logout></Logout>
            <p>Logout</p>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
}
