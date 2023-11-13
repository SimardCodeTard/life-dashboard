import { CalendarEventType, CalendarEventTypeDTO } from "@/app/types/calendar.type";
import { CalendarUtils } from "@/app/utils/calendar.utils";
import axios from "axios";
import { DateTime } from "luxon"

export async function GET():Promise<Response> {
    const url = process.env.NEXT_PUBLIC_CALENDAR_URL_UNIV as string;
    let data = await axios.get(url).then(res => res.data) as string;

    const events: CalendarEventTypeDTO[] = [];

    let newEvent: CalendarEventTypeDTO;

    let dtStart: string;
    let dtEnd: string;

    let location: string;
    let summary: string; 

    data.split('BEGIN:VEVENT').slice(1).map((item: string) => {
        
        dtStart = item.substring(item.indexOf('DTSTART:') + 'DTSTART:'.length, item.indexOf('LAST-MODIFIED:')).replace(/\r\n|\r|\n/, '');
        dtEnd = item.substring(item.indexOf('DTEND:') + 'DTEND:'.length, item.indexOf('DTSTAMP:')).replace(/\r\n|\r|\n/, '');

        location = item.substring(item.indexOf('LOCATION:') + 'LOCATION:'.length, item.indexOf('SEQUENCE:'));
        summary = item.substring(item.indexOf('SUMMARY:') + 'SUMMARY:'.length, item.indexOf('UID:'))
        
        newEvent = {
            dtEnd, 
            dtStart,
            location,
            summary,
        }

        events.push(newEvent);
    })

    return Response.json(events);
}