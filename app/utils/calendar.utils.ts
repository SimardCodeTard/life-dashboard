import { DateTime } from "luxon";
import { CalendarEventType, CalendarEventTypeDTO, GroupedEventMapKeyType } from "../types/calendar.type";

export module CalendarUtils {
    export enum CalendarSourcesEnum {
        UNIV_CLAUDE_BERNARD
    }

    export const formatDate = (dateStr: string, dateSource: CalendarSourcesEnum = CalendarSourcesEnum.UNIV_CLAUDE_BERNARD) => {
        switch(dateSource) {
            case(CalendarSourcesEnum.UNIV_CLAUDE_BERNARD): return formatDateUnivClaudeBernard(dateStr)
            default: throw new Error('INVALID_DATE_SOURCE');
        }
    } 

    export const mapCalenadrEventDTOtoDO = (calendarEventDto: CalendarEventTypeDTO): CalendarEventType => {
        return {
            ...calendarEventDto,
            dtStart: formatDate(calendarEventDto.dtStart).plus({hours: 1}),
            dtEnd: formatDate(calendarEventDto.dtEnd).plus({hours: 1}),
        }
    }

    export const mapCalendarEventDTOListToDO = (calendarEventDTOList: CalendarEventTypeDTO[]): CalendarEventType[] => calendarEventDTOList.map(mapCalenadrEventDTOtoDO);

    export const groupCalEventsByDate = (events: CalendarEventType[]): Map<string, CalendarEventType[]> => {
        const groupedEvents = new Map<string, CalendarEventType[]>();
    
        for(let event of events) {
            const key = fromDateTimeToGroupedEventMapKey(event.dtStart);
            const eventsToGroupWith = groupedEvents.get(key);
            if(eventsToGroupWith) {
                groupedEvents.set(key, [...eventsToGroupWith, event]);
            } else {
                groupedEvents.set(key, [event]);
            }
        }  

        groupedEvents.forEach((values, key) => {
            groupedEvents.set(key, sortEvents(values));
        })
    
        return groupedEvents;
    }

    const sortEvents = (events: CalendarEventType[]): CalendarEventType[] => events.sort((a:CalendarEventType, b: CalendarEventType) => {
        return (a.dtStart.hour * 60 + a.dtStart.minute ) - (b.dtStart.hour * 60 + b.dtStart.minute);
    });
    
    export const fromDateTimeToGroupedEventMapKey = (date: DateTime): string => [date.day, date.month, date.year].join('-');
    export const fromGroupedEventKeyToDateTime = (groupedEventKey: string) => {
        const groupedEventKeyArray = groupedEventKey.split('-');
        return DateTime.fromObject({day: Number(groupedEventKeyArray[0]), month: Number(groupedEventKeyArray[1]), year: Number(groupedEventKeyArray[2])})
    }

    const formatDateUnivClaudeBernard = (dateStr: string) => DateTime.fromFormat(dateStr, "yyyyMMdd'T'hhmmss'Z'");
}