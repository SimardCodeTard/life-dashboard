import { CalendarEventType } from "@/app/types/calendar.type";

export default function CalendarItem({event, index}: {event: CalendarEventType, index: number} ) {
    return(
        <div className="calendar-item border-solid flex items-center w-50 py-2">
            <div>
                <h3 className="text-[rgba(255,255,255,0.6)]">{event.summary}</h3>
                <p>
                    {`${event.dtStart.hour < 10 ? `0${event.dtStart.hour}` : event.dtStart.hour}:${event.dtStart.minute < 10 ? `0${event.dtStart.minute}` : event.dtStart.minute}`}
                    {' - '}
                    {`${event.dtEnd.hour < 10 ? `0${event.dtEnd.hour}` : event.dtEnd.hour}:${event.dtEnd.minute < 10 ? `0${event.dtEnd.minute}` : event.dtEnd.minute}`}</p> 
                <p className="text-[rgb(149,149,149)]">{event.location}</p>
            </div>
        </div>
    );
}