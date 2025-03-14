"use client";

import { useEffect, useState } from "react";
import Loader from "../../shared/loader/loader.component";

import './greeting.scss'

export default function Greeting() {
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState<string | null>(null);

  const name = process.env.NEXT_PUBLIC_USER_NAME || "User";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      updateGreeting(now);
    };

    updateTime();
     const timer = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(timer);
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

  return (
    <div className="greeting">

        {time ? <>
            <h1>
                {greeting}, {name}
            </h1>
            <p className="subtitle">{time}</p>
        </> : <Loader></Loader>
        }
    </div>  
  );
}
