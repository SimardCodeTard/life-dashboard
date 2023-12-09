"use client"
import { CalendarEventType } from "@/app/types/calendar.type";
import { useEffect, useState } from "react";
import { CalendarUtils } from "@/app/utils/calendar.utils";
import { DateTime } from "luxon";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CalendarDataClientService } from "@/app/services/client/calendar-data-client.service";
import CalendarItem from "./calendar-item/calendar-item.component";
import styles from './calendar.module.css';

export default function Calendar() {

    const [calDataMap, setCalDataMap] = useState<Map<string, CalendarEventType[]>>(new Map());
    const [selectedDate, setSelectedDate] = useState<string>(CalendarDataClientService.fromDateTimeToGroupedEventMapKey(DateTime.now()));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        CalendarDataClientService.fetchCalendarEvents()
            .then((data) => {
                setCalDataMap(data);
                setIsLoading(false)
            });
    }, [])

    const nextDay = () => {
        let currentDate = selectedDate ? CalendarDataClientService.fromGroupedEventKeyToDateTime(selectedDate) : DateTime.now();
        currentDate = currentDate.plus({ days: 1 })
        setSelectedDate(CalendarDataClientService.fromDateTimeToGroupedEventMapKey(currentDate));
    }

    const previousDay = () => {
        let currentDate = selectedDate ? CalendarDataClientService.fromGroupedEventKeyToDateTime(selectedDate) : DateTime.now();
        currentDate = currentDate.minus({ days: 1 })
        setSelectedDate(CalendarDataClientService.fromDateTimeToGroupedEventMapKey(currentDate));
    }

    const buildFriendlyMessage = () => {
        const date = CalendarDataClientService.fromGroupedEventKeyToDateTime(selectedDate);
        if(CalendarUtils.isSameDay(date)) {
            return 'You\'re all free today :)';         
        } else {
            return 'You\'re all free at this date';
        }
    }

    const FriendlyMessage = () => (
        <p className="text-[rgba(255,255,255,0.5)]">
            {isLoading ? 'Loading calendar events  ...' :  buildFriendlyMessage()}
        </p>
    )

    const EventsOfTheDay = () => (
        <div className={["divide-[rgba(255,255,255,0.2)] h-fit divide-y-2", styles.calendar].join(' ')}>
            {// If calDataMap is set & has an event for the selected date
                calDataMap && calDataMap.get(selectedDate as string)
                    // Map the events array and display in CalendarItem
                    ? (calDataMap.get(selectedDate as string) as CalendarEventType[]).map((event: CalendarEventType, key: number) => <CalendarItem event={event} key={key}></CalendarItem>)
                    // Display a friendly message
                    : <FriendlyMessage></FriendlyMessage>
            }
        </div>
    );

    const selectedIsToday = (): boolean => {
        return CalendarUtils.isSameDay(CalendarDataClientService.fromGroupedEventKeyToDateTime(selectedDate));
    }

    return (
        <div className="p-3 h-fit space-y-2">
            <div className="flex justify-evenly pl-2 pr-2">
                <span className="cursor-pointer" onClick={previousDay}>
                    <ArrowBackIosIcon></ArrowBackIosIcon>
                </span>
                <span className="flex flex-col">
                    <p>{selectedDate?.replaceAll('-', ' / ')}</p>
                    {selectedIsToday() 
                        ? <p className="w-full flex text-[rgba(255,255,255,0.4)] justify-center">today</p> 
                        : <span className="w-full cursor-pointer flex text-[rgba(255,255,255,0.4)] justify-center"
                            onClick={() => setSelectedDate(CalendarDataClientService.fromDateTimeToGroupedEventMapKey(DateTime.now()))}
                            >go to today</span>}
                </span>
                <span className="cursor-pointer" onClick={nextDay}>
                    <ArrowForwardIosIcon></ArrowForwardIosIcon>
                </span>
            </div>

            <EventsOfTheDay></EventsOfTheDay>

        </div>
    );
}