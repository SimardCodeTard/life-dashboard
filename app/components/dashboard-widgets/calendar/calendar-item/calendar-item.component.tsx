import { CalendarEventType } from "@/app/types/calendar.type";
import { LocationOn } from "@mui/icons-material";

export default function CalendarItem({event, color}: Readonly<{event: CalendarEventType, color: string}> ) {

    const onLocationClick = () => {
        const url = `https://www.google.com/maps/search/${event.location}`;
        window.open(url, '_blank');
    }

    return(
        <div className="calendar-item">
            <span className="color-badge calendar-item-color-badge" style={{backgroundColor: color}}></span>
            <div className="calendar-item-content">
                {event.summary}
                {event.location && <button onClick={onLocationClick} className="subtitle location"><LocationOn></LocationOn> {event.location}</button>}
            </div>
            <p className="subtitle">{`${event.dtStart.toFormat('HH:mm')}`}</p> 
        </div>
    );
}