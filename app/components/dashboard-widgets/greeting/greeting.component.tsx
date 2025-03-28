"use client";
import { useEffect, useState } from "react";
import Loader from "../../shared/loader/loader.component";

import './greeting.scss'
import { UserTypeClient } from "@/app/types/user.type";
import { getUserFromLocalStorage, userEventEmitter } from "@/app/utils/localstorage.utils";
import { EventKeysEnum } from "@/app/enums/events.enum";
import { DateTime } from "luxon";

export default function Greeting() {
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState<DateTime | undefined>();

  const [user, setUser] = useState<UserTypeClient>()
  const [displayName, setDisplayName] = useState('User');

  useEffect(() => {
    setUser(getUserFromLocalStorage());

    const onUserUpdate = (user: UserTypeClient) => {
      setUser(user);
    }

    userEventEmitter.on(EventKeysEnum.USER_UPDATE, onUserUpdate);

    return () => {
      userEventEmitter.off(EventKeysEnum.USER_UPDATE, onUserUpdate);
    };
  }, []) 

  useEffect(() => {
    const updateTime = () => {
      const now = DateTime.now();;
      setTime(now);
      updateGreeting(now);
    };

    updateTime();
    const timer = setInterval(updateTime, 600000); // Update every 10 minutes
    return () => {
      clearInterval(timer);
    }

  }, [user]);

  const updateGreeting = (date: DateTime) => {
    const hour = date.hour;

    if(user) {
      if(user.isMom) {
        setDisplayName('Maman ❤️');
        setGreeting("Coucou");
      } else if (user.isDad) {
        setDisplayName('LE PEEERE ❤️');
        setGreeting('UUUEEEEEEHHH');
      } else if (user.isSister) {
        setDisplayName('le frèr');
        setGreeting('Wesh');
      } else if (user.isMe) {
        setDisplayName('bg');
        setGreeting('Wesh');
      } else if (user.isSasha) {
        setDisplayName('Bebou :333333')
        setGreeting('Coucou')
      } else if (user.isClement) {
        setDisplayName('le K');
        setGreeting('Wesh');
      } else if (user.isAlizee) {
        setDisplayName('ALISSEWWWW');
        setGreeting('BONJOU');
      } else if (user.isHippolyte) {
        setDisplayName('LE KHO BENDEJO');
        setGreeting('WE');
      } else {
        setDisplayName(user.firstName);
        if(hour > 4 && hour < 12) {
          setGreeting('Good morning,');
        } else if (hour < 18) {
          setGreeting('Good afternoon,');
        } else {
          setGreeting('Good evening,');
        }
      }
    }
  };


  return (
    <div className="greeting">
        {time ? <>
            <h1>
                {greeting} <b>{displayName}</b>
            </h1>
            <p className="subtitle">{`${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`}</p>
        </> : <Loader></Loader>
        }
    </div>  
  );
}
