import { DateTime } from "luxon";
import { CalendarEventType, CalendarEventTypeDTO } from "../types/calendar.type";

export module CalendarUtils {
    export enum CalendarSourcesEnum {
        ADELB_UNIV_LYON_1 // University Claude Bernard, Lyon, France
    }


    export const isSameDay = (a: DateTime, b: DateTime = DateTime.now()) => a.day === b.day && a.month === b.month && a.month === b.month;
}