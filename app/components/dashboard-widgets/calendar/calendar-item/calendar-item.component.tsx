import { CalendarEventType } from "@/app/types/calendar.type";

export default function CalendarItem({event}: {event: CalendarEventType} ) {

    return(
        <div className="calendar-item">
            <h3>{event.summary}</h3>
            <p>
                {`${event.dtStart.format('HH:mm')} - ${event.dtEnd.format('HH:mm')}`}</p> 
            <p className="subtitle">{event.location}</p>
        </div>
    );
}