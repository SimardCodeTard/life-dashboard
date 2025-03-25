import Loader from "@/app/components/shared/loader/loader.component";
import { CalendarSourceEditEventsEnum, EventKeysEnum } from "@/app/enums/events.enum";
import EventEmitter from "@/app/lib/event-emitter";
import { Logger } from "@/app/services/logger.service";
import { CalendarSourceEventsFakeMapType, CalendarSourceType } from "@/app/types/calendar.type";
import { Visibility, VisibilityOff, Cancel, Edit, Delete } from "@mui/icons-material";
import { ObjectId } from "mongodb";
import { useEffect, useState } from "react";

export default function CalendarSource({
    source,
    sourceEditEventEmitter,
    editSource,
    deleteSource,
    onVisibilityChange
}: {    
    source: CalendarSourceType,
    sourceEditEventEmitter: EventEmitter,
    editSource: (source: CalendarSourceType) => void,
    deleteSource: (id: ObjectId) => void,
    onVisibilityChange: (source: CalendarSourceType) => void
}) {

    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const onNewCalendarSourceEditEvent = (value: CalendarSourceEditEventsEnum, sourceId: ObjectId) => {
            if(value === CalendarSourceEditEventsEnum.CALENDAR_SOURCE_EDIT_START && sourceId === source._id) {
                setIsLoading(true);
            } else if (value === CalendarSourceEditEventsEnum.CALENDAR_SOURCE_EDIT_END && source._id === sourceId) {
                setIsEditing(false);
                setIsLoading(false);
            } else if (value == CalendarSourceEditEventsEnum.CALENDAR_SOURCE_EDIT_SOURCE_REPLACED) {
                if(source._id !== sourceId) {
                    setIsEditing(false);
                } else {
                    setIsEditing(true);
                }
            }
        }

        sourceEditEventEmitter.on(EventKeysEnum.CALENDAR_SOURCE_EDIT, onNewCalendarSourceEditEvent);

        return () => {
            sourceEditEventEmitter.off(EventKeysEnum.CALENDAR_SOURCE_EDIT, onNewCalendarSourceEditEvent);
        }
    }, []);

    const onEditClick = () => {
        setIsEditing(!isEditing);
        editSource(source);
    }

    const onDeleteClick = () => {
        setIsEditing(false);
        deleteSource(source._id as ObjectId);
    }

    return <div className="calendar-source">

        <div className="calendar-source-content-wrapper">
            {isLoading && <Loader></Loader>}
            <span className="actions-wrapper">
                {source.visible ? 
                    <Visibility style={{color: source.color}} onClick={() => onVisibilityChange(source)}></Visibility> : <VisibilityOff style={{color: source.color}} onClick={() => onVisibilityChange(source)}></VisibilityOff>}
            </span>
            <p>{source.name}</p>
            <span className="calendar-source-actions actions-wrapper">
                {isEditing ? <Cancel onClick={() => onEditClick()}/>: <Edit onClick={() => onEditClick()}></Edit>} 
                <Delete onClick={() => onDeleteClick()}></Delete>
            </span>
        </div>
    </div>;
}