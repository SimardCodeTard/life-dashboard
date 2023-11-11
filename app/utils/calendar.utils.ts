import { DateTime } from "luxon";
import { CalendarEventType, CalendarEventTypeDTO } from "../types/calendar.type";

export module CalendarUtils {
    export enum CalendarSourcesEnum {
        ADELB_UNIV_LYON_1 // University Claude Bernard, Lyon, France
    }

    // Indexes of the elements of the calendar data from Univ
    export const UnivCalendarLineIndexes = {
        DTSTAMP: 0,
        DTSART: 1,
        DTEND: 2,
        SUMMARY: 3,
        LOCATION: 4,
        DESCRIPTION: 5,
        UID: 6,
        CREATED: 7,
        LAST_MODIFIED: 8,
        SEQUENCE: 9
    }

    export const isSameDay = (a: DateTime, b: DateTime) => a.day === b.day && a.month === b.month && a.month === b.month;
}