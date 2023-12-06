"use client"
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

import styles from '../components.module.css'

let lastSecond: number = -1;
let lastMinute: number = -1;
let lastHour: number = -1;
let lastDate: {day: number, month: number, year: number} | null = null;

export default function Clock() {

    const getSecondsString = (now: DateTime = DateTime.now()): string => `:${ now.second < 10 ? `0${ now.second }`: now.second }`;
    const getHourString = (now: DateTime = DateTime.now()): string => `${ now.hour < 10 ? `0${ now.hour }`: now.hour }:${ now.minute < 10 ? `0${ now.minute }` : now.minute }`;
    const getDateString = (now: DateTime = DateTime.now()): string => (now.toISODate() as string).replaceAll('-',' / ');

    const [dateDisplay, setDateDisplay] = useState('');
    const [hourDisplay, setHourDisplay] = useState('');
    const [secondsDisplay, setSecondsDisplay] = useState('');

    const updateClock = () => {
        const {second, minute, hour, day, month, year} = DateTime.now();

        if(second != lastSecond) {
            // Update the seconds
            lastSecond = second;
            setSecondsDisplay(getSecondsString());

            if(hourDisplay === '' || minute != lastMinute || hour != lastHour) {
                // Update the minutes
                lastMinute = minute;
                lastHour = hour;
                setHourDisplay(getHourString());

                if(dateDisplay === '' || lastDate !== null && day !== lastDate.day && month !== lastDate.month && year !== lastDate.year) {
                    // Update the date
                    setDateDisplay(getDateString());
                }
            }
        }
    }

    useEffect(()=>{
        setDateDisplay(getDateString())
        updateClock();
        setInterval(updateClock, 100)
    }, [updateClock]);

    return (
        <div className={[
                "p-5 text-2xl font-bold w-full flex flex-col items-center justify-center",
                styles.clock
                ].join(' ')}>
            <p className={styles.time}>{hourDisplay}<b className={styles.seconds}>{secondsDisplay}</b></p>
            <p className={styles.date}>{dateDisplay}</p>
        </div>
    );
}
