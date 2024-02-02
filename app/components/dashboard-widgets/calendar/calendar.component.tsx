"use client"
import { CalendarEventType } from "@/app/types/calendar.type";
import { useEffect, useState } from "react";
import { CalendarUtils } from "@/app/utils/calendar.utils";
import { DateTime } from "luxon";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { clientCalendarDataService } from "@/app/services/client/calendar-data-client.service";
import CalendarItem from "./calendar-item/calendar-item.component";
import styles from './calendar.module.css';
import Loader from "../../shared/loader/loader.component";

export default function Calendar() {

    const [calDataMap, setCalDataMap] = useState<Map<string, CalendarEventType[]>>(new Map());
    const [selectedDate, setSelectedDate] = useState<string>(clientCalendarDataService.fromDateTimeToGroupedEventMapKey(DateTime.now()));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        clientCalendarDataService.fetchCalendarEvents()
            .then((data) => {
                setCalDataMap(data);
            });
    }, [])

    useEffect(() => {
        calDataMap.size > 0 && setIsLoading(false);
    }, [calDataMap])

    const nextDay = () => {
        let currentDate = selectedDate ? clientCalendarDataService.fromGroupedEventKeyToDateTime(selectedDate) : DateTime.now();
        currentDate = currentDate.plus({ days: 1 })
        setSelectedDate(clientCalendarDataService.fromDateTimeToGroupedEventMapKey(currentDate));
    }

    const previousDay = () => {
        let currentDate = selectedDate ? clientCalendarDataService.fromGroupedEventKeyToDateTime(selectedDate) : DateTime.now();
        currentDate = currentDate.minus({ days: 1 })
        setSelectedDate(clientCalendarDataService.fromDateTimeToGroupedEventMapKey(currentDate));
    }

    const buildFriendlyMessage = () => {
        const date = clientCalendarDataService.fromGroupedEventKeyToDateTime(selectedDate);
        if(CalendarUtils.isSameDay(date)) {
            return 'You\'re all free today :)';         
        } else {
            return 'You\'re all free at this date';
        }
    }

    const FriendlyMessage = () => (
        <div className="relative overflow-hidden p-2 h-16 w-full flex align-center justify-center text-[rgba(255,255,255,0.5)]">
            {isLoading ? <Loader></Loader> :  buildFriendlyMessage()}
        </div>
    )

    const EventsOfTheDay = () => (
        <div className={["divide-[rgba(255,255,255,0.2)] h-fit divide-y-2", styles.eventOfTheDay].join(' ')}>
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
        return CalendarUtils.isSameDay(clientCalendarDataService.fromGroupedEventKeyToDateTime(selectedDate));
    }

    return (
        <div className={["p-3 h-fit space-y-2", styles.calendar].join(' ')}>
            <div className="flex justify-evenly pl-2 pr-2 sticky top-0 backdrop-blur-3xl bg-white/5 p-2 rounded">
                <span className="cursor-pointer" onClick={previousDay}>
                    <ArrowBackIosIcon></ArrowBackIosIcon>
                </span>
                <span className="flex flex-col">
                    <p>{selectedDate?.replaceAll('-', ' / ')}</p>
                    {selectedIsToday() 
                        ? <p className="w-full flex text-[rgba(255,255,255,0.4)] justify-center">today</p> 
                        : <span className="w-full cursor-pointer flex text-[rgba(255,255,255,0.4)] justify-center"
                            onClick={() => setSelectedDate(clientCalendarDataService.fromDateTimeToGroupedEventMapKey(DateTime.now()))}
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