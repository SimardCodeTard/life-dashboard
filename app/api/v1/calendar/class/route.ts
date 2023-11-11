import { CalendarEventTypeDTO } from "@/app/types/calendar.type";
import { CalendarUtils } from "@/app/utils/calendar.utils";
import assert from "assert";
import axios from "axios";

export async function GET():Promise<Response> {
    const url = process.env.NEXT_PUBLIC_CALENDAR_URL_UNIV as string;
    assert(url !== undefined);

    let data;

    try {
        // Try to fetch the calendar data
        data = await axios.get(url).then(res => res.data) as string;
    } catch(err: any) {
        console.error(err.message);
        return Response.json({success: false});
    }

    const events: CalendarEventTypeDTO[] = [];

    let newEvent: CalendarEventTypeDTO;

    let dtStart: string;
    let dtEnd: string;

    let location: string;
    let summary: string; 

    const { DTSART, DTEND, SUMMARY, LOCATION } = CalendarUtils.UnivCalendarLineIndexes

    data.split('BEGIN:VEVENT').slice(1).map((item: string) => {

        let lines = item.split('\n');

        for(let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].replaceAll(/\r\n|\r|\n/g, '')
        }

        lines = lines.filter(line => line !== '');


        dtStart = lines[DTSART].split(':')[1];
        dtEnd = lines[DTEND].split(':')[1];
        location = lines[LOCATION].split(':')[1];
        summary = lines[SUMMARY].split(':')[1];     

        newEvent = {
            dtEnd, 
            dtStart,
            location,
            summary,
        }

        events.push(newEvent);
    })

    return Response.json({success: true, events});
}