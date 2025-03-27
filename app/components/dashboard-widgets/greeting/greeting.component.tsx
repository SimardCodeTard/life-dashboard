"use client";
import { useEffect, useState } from "react";
import Loader from "../../shared/loader/loader.component";

import './greeting.scss'
import { UserTypeClient } from "@/app/types/user.type";
import { getUserFromLocalStorage, userEventEmitter } from "@/app/utils/localstorage.utils";
import { EventKeysEnum } from "@/app/enums/events.enum";

export default function Greeting() {
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState<string | null>(null);

  const [user, setUser] = useState<UserTypeClient>()

  useEffect(() => {
    setUser(getUserFromLocalStorage());

    const onUserUpdate = (user: UserTypeClient) => {
      setUser(user);
    }

    userEventEmitter.on(EventKeysEnum.USER_UPDATE, onUserUpdate);

    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      updateGreeting(now);
    };

    updateTime();
     const timer = setInterval(updateTime, 60000); // Update every minute

    return () => {
      clearInterval(timer)
      userEventEmitter.off(EventKeysEnum.USER_UPDATE, onUserUpdate);
    };
  }, []);

  const updateGreeting = (date: Date) => {
    const hour = date.getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  };

  let name = 'User';

  if(user) {
    name = user.firstName;
  }

  return (
    <div className="greeting">

        {time ? <>
            <h1>
                {greeting}, <b>{name}</b>
            </h1>
            <p className="subtitle">{time}</p>
        </> : <Loader></Loader>
        }
    </div>  
  );
}
