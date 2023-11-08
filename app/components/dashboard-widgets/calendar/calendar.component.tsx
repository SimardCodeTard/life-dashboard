"use client"
import { CalendarEventType, CalendarEventTypeDTO, GroupedEventMapKeyType } from "@/app/types/calendar.type";
import axios from "axios";
import { useEffect, useState } from "react";
import CalendarItem from "./calendar-item.component";
import { CalendarUtils } from "@/app/utils/calendar.utils";
import { DateTime } from "luxon";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Calendar() {

    const [calDataMap, setCalDataMap] = useState<Map<string, CalendarEventType[]>>(new Map());
    const [selectedDate, setSelectedDate] = useState<string>();

    const fetchCalendarEvents = () => {
        const url = "http://localhost:3000/api/v1/calendar/class";
        axios.get(url)
        .then(res => setCalDataMap(CalendarUtils.groupCalEventsByDate(CalendarUtils.mapCalendarEventDTOListToDO(res.data as CalendarEventTypeDTO[]))));
    }

    useEffect(()=>{
        fetchCalendarEvents();  
    }, [])


    useEffect(()=>{
        setSelectedDate(CalendarUtils.fromDateTimeToGroupedEventMapKey(DateTime.now()))
    }, [calDataMap]);

    useEffect(()=>{ 
        console.log('selected date:', selectedDate)
        console.log('events of selected date:', calDataMap.get(selectedDate as string))
    }, [selectedDate]);


    const nextDay = () => {
        let currentDate = selectedDate ? CalendarUtils.fromGroupedEventKeyToDateTime(selectedDate) : DateTime.now();
        currentDate = currentDate.plus({days: 1})
        setSelectedDate(CalendarUtils.fromDateTimeToGroupedEventMapKey(currentDate));
    }
    
    const previousDay = () => {
        let currentDate = selectedDate ? CalendarUtils.fromGroupedEventKeyToDateTime(selectedDate) : DateTime.now();
        currentDate = currentDate.minus({days: 1})
        setSelectedDate(CalendarUtils.fromDateTimeToGroupedEventMapKey(currentDate));
    }

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

            <div className="divide-[rgba(255,255,255,0.2)] divide-y-2">
                {calDataMap && calDataMap.get(selectedDate as string) 
                    && (calDataMap.get(selectedDate as string) as CalendarEventType[])
                    .map((event: CalendarEventType, key: number) => 
                        <CalendarItem event={event} index={key} key={key}></CalendarItem>)
                }
            </div>

        </div>
    );
}