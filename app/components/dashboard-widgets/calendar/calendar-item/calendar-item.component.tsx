import { CalendarEventType } from "@/app/types/calendar.type";

export default function CalendarItem({event}: {event: CalendarEventType} ) {

    const formatNumber = (number: number): string => number < 10 ? `0${number}` : String(number);

    return(
        <div className="calendar-item border-solid flex items-center w-50 py-2">
            <div>
                <h3 className="text-[rgba(255,255,255,0.6)]">{event.summary}</h3>
                <p>
                    {`${formatNumber(event.dtStart.hour())}:${formatNumber(event.dtStart.minute())} - ${formatNumber(event.dtEnd.hour())}:${formatNumber(event.dtEnd.minute())}`}</p> 
                <p className="text-[rgb(149,149,149)]">{event.location}</p>
            </div>
        </div>
    );
}