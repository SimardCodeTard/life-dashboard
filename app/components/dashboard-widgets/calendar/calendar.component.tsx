"use client"
import { CalendarEventType, CalendarEventTypeDTO } from "@/app/types/calendar.type";
import { useEffect, useState } from "react";
import { CalendarUtils } from "@/app/utils/calendar.utils";
import { DateTime } from "luxon";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CalendarDataClientService } from "@/app/services/client/calendar-data-client.service";
import CalendarItem from "../../client/calendar/calendar-item.component";

export default function Calendar() {

    const [calDataMap, setCalDataMap] = useState<Map<string, CalendarEventType[]>>(new Map());
    const [selectedDate, setSelectedDate] = useState<string>();

    useEffect(() => {
        CalendarDataClientService.fetchCalendarEvents()
            .then(setCalDataMap);
    }, [])

    useEffect(() => {
        setSelectedDate(CalendarDataClientService.fromDateTimeToGroupedEventMapKey(DateTime.now()))
    }, [calDataMap]);

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

    const FriendlyMessage = () => (
        <p className="text-[rgba(255,255,255,0.5)]">
            {`You are all free ${CalendarUtils.isSameDay(CalendarDataClientService.fromGroupedEventKeyToDateTime(selectedDate
                ? selectedDate
                : CalendarDataClientService.fromDateTimeToGroupedEventMapKey(DateTime.now())), DateTime.now())
                    ? 'today :)'
                    : 'at this date'
                }`
            }
        </p>
    )

    const EventsOfTheDay = () => (
        <div className="divide-[rgba(255,255,255,0.2)] divide-y-2">
            {// If calDataMap is set & has an event for the selected date
                calDataMap && calDataMap.get(selectedDate as string)
                    // Map the events array and display in CalendarItem
                    ? (calDataMap.get(selectedDate as string) as CalendarEventType[]).map((event: CalendarEventType, key: number) => <CalendarItem event={event} index={key} key={key}></CalendarItem>)
                    // Display a friendly message
                    : <FriendlyMessage></FriendlyMessage>
            }
        </div>
    );


    return (
        <div className="p-3 space-y-2">
            <div className="flex justify-evenly pl-2 pr-2">
                <span className="cursor-pointer" onClick={previousDay}>
                    <ArrowBackIosIcon></ArrowBackIosIcon>
                </span>
                <span>
                    {selectedDate?.replaceAll('-', ' / ')}
                </span>
                <span className="cursor-pointer" onClick={nextDay}>
                    <ArrowForwardIosIcon></ArrowForwardIosIcon>
                </span>
            </div>

            <EventsOfTheDay></EventsOfTheDay>

        </div>
    );
}