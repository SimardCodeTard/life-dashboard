"use client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

import '../components.scss';
import { AccessTime } from "@mui/icons-material";
import { capitalize } from "@/app/utils/string.util";

export default function Clock({ setIsLoading }: Readonly<{ setIsLoading?: (isLoading: boolean) => void }>) {

    const getSecondsString = (now: DateTime = DateTime.now()): string => `:${ now.second.toString().padStart(2, '0') }`;
    const getHourString = (now: DateTime = DateTime.now()): string => `${ now.hour.toString().padStart(2, '0') }:${now.minute.toString().padStart(2, '0')}`;
    const getDateString = (now: DateTime = DateTime.now()): string => `${capitalize(now.weekdayLong as string)} ${now.day} ${now.monthShort} ${now.year}`;

    const [dateDisplay, setDateDisplay] = useState('');
    const [hourDisplay, setHourDisplay] = useState('');
    const [secondsDisplay, setSecondsDisplay] = useState('');

    const [lastSecond, setLastSecond] = useState(-1);
    const [lastMinute, setLastMinute] = useState(-1);
    const [lastHour, setLastHour] = useState(-1);
    const [lastDate, setLastDate] = useState<{ day: number, month: number, year: number } | null>(null);

    const updateClock = () => {
        const now = DateTime.now();

        if (now.second !== lastSecond) {
            setLastSecond(now.second);
            setSecondsDisplay(getSecondsString(now));

            if (now.minute !== lastMinute || now.hour !== lastHour) {
                setLastMinute(now.minute);
                setLastHour(now.hour);
                setHourDisplay(getHourString(now));

                if (!lastDate || now.day !== lastDate.day || now.month !== lastDate.month || now.year !== lastDate.year) {
                setLastDate({ day: now.day, month: now.month, year: now.year });
                    setDateDisplay(getDateString(now));
                }
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(updateClock, 500);
        return () => clearInterval(interval); // Cleanup
    }, [lastSecond, lastMinute, lastHour, lastDate]);

    useEffect(() => {
        setIsLoading && setIsLoading(false);
    }, [setIsLoading]);

    return (
        <div className="card-content">
            <div className="clock card-main-panel">
                <div className="card-header">
                    <h2>Time & Date</h2>
                    <AccessTime />
                </div>

                <div className="card-body">
                    <p className='clock-time'>{hourDisplay}<span className="clock-seconds subtitle">{secondsDisplay}</span></p>
                    <p className="clock-date subtitle">{dateDisplay}</p>
                </div>
            </div>
        </div>

    );
}
