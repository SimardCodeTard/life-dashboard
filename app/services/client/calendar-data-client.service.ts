import { APIBadRequestError } from "@/app/errors/api.error";
import { CalendarEventType, CalendarEventTypeDTO } from "@/app/types/calendar.type";
import { CalendarUtils } from "@/app/utils/calendar.utils";
import assert from "assert";
import { DateTime } from "luxon";
import { Logger } from "../logger.service";
import { handleAxiosError } from "@/app/utils/api.utils";
import { axiosClientService } from "./axios.client.service";
  
export namespace clientCalendarDataService {

    const formatDateUnivClaudeBernard = (dateStr: string) => DateTime.fromFormat(dateStr, "yyyyMMdd'T'hhmmss'Z'");

    export const formatDate = (dateStr: string, dateSource: CalendarUtils.CalendarSourcesEnum = CalendarUtils.CalendarSourcesEnum.ADELB_UNIV_LYON_1) => {
       switch(dateSource) {
            case(CalendarUtils.CalendarSourcesEnum.ADELB_UNIV_LYON_1): return formatDateUnivClaudeBernard(dateStr)
            default: throw new Error('INVALID_DATE_SOURCE');
        }
    } 

    export const mapCalendarEventDTOtoDO = (calendarEventDto: CalendarEventTypeDTO): CalendarEventType => {
        return {
            ...calendarEventDto,
            dtStart: formatDate(calendarEventDto.dtStart).plus({hours: 1}),
            dtEnd: formatDate(calendarEventDto.dtEnd).plus({hours: 1}),
        }
    }

    export const mapCalendarEventDTOListToDO = (calendarEventDTOList: CalendarEventTypeDTO[]): CalendarEventType[] => calendarEventDTOList.map(mapCalendarEventDTOtoDO);

    export const fetchCalendarEvents = async (source: CalendarUtils.CalendarSourcesEnum = CalendarUtils.CalendarSourcesEnum.ADELB_UNIV_LYON_1) => {
        switch(source) {
            case (CalendarUtils.CalendarSourcesEnum.ADELB_UNIV_LYON_1):
                return fetchCalendarEventsSourceUniv();
            default:
                const internalError = new APIBadRequestError('Invalid calendar source');;
                Logger.error(internalError);
                throw internalError;
            }
    }

    export const fromDateTimeToGroupedEventMapKey = (date: DateTime): string => [date.day, date.month, date.year].join('-');

    export const fromGroupedEventKeyToDateTime = (groupedEventKey: string) => {
        const groupedEventKeyArray = groupedEventKey.split('-');
        return DateTime.fromObject({day: Number(groupedEventKeyArray[0]), month: Number(groupedEventKeyArray[1]), year: Number(groupedEventKeyArray[2])})
    }

    const sortEvents = (events: CalendarEventType[]): CalendarEventType[] => events.sort((a:CalendarEventType, b: CalendarEventType) => {
        return (a.dtStart.hour * 60 + a.dtStart.minute ) - (b.dtStart.hour * 60 + b.dtStart.minute);
    });

    const groupCalEventsByDate = (events: CalendarEventType[]): Map<string, CalendarEventType[]> => {
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

    const fetchCalendarEventsSourceUniv = async (): Promise<Map<string, CalendarEventType[]>> => {
        const url = process.env.NEXT_PUBLIC_API_URL + "/calendar/class" as string;
        assert(url !== undefined);

        const res = await axiosClientService.GET(url).catch(handleAxiosError);
        
        return groupCalEventsByDate(mapCalendarEventDTOListToDO(res?.data as CalendarEventTypeDTO[]));
    }
} 

