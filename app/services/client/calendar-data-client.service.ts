import { APIBadRequestError } from "@/app/errors/api.error";
import { CalendarEventType, CalendarEventTypeDTO } from "@/app/types/calendar.type";
import { CalendarUtils } from "@/app/utils/calendar.utils";
import assert from "assert";
import { Logger } from "../logger.service";
import { handleAxiosError } from "@/app/utils/api.utils";
import { axiosClientService } from "./axios.client.service";
import moment, { Moment } from "moment";
  
export namespace clientCalendarDataService {

    const formatDateUnivClaudeBernard = (dateStr: string): Moment => moment.parseZone(dateStr);

    export const formatDate = (dateStr: string, dateSource: CalendarUtils.CalendarSourcesEnum = CalendarUtils.CalendarSourcesEnum.ADELB_UNIV_LYON_1) => {
       switch(dateSource) {
            case(CalendarUtils.CalendarSourcesEnum.ADELB_UNIV_LYON_1): return formatDateUnivClaudeBernard(dateStr)
            default: throw new Error('INVALID_DATE_SOURCE');
        }
    } 

    export const mapCalendarEventDTOtoDO = (calendarEventDto: CalendarEventTypeDTO): CalendarEventType => {
        return {
            ...calendarEventDto,
            dtStart: formatDate(calendarEventDto.dtStart),
            dtEnd: formatDate(calendarEventDto.dtEnd),
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

    export const fromMomentToGroupedEventMapKey = (date: Moment): string => date.format('DD-MM-YYYY');

    export const fromGroupedEventKeyToMoment = (groupedEventKey: string): Moment => {
        const groupedEventKeyArray = groupedEventKey.split('-');
        return moment().year(parseInt(groupedEventKeyArray[2])).month(parseInt(groupedEventKeyArray[1]) - 1).date(parseInt(groupedEventKeyArray[0]));
    }

    const sortEvents = (events: CalendarEventType[]): CalendarEventType[] => events.sort((a:CalendarEventType, b: CalendarEventType) => {
        return (a.dtStart.hour() * 60 + a.dtStart.minute() ) - (b.dtStart.hour() * 60 + b.dtStart.minute());
    });

    const groupCalEventsByDate = (events: CalendarEventType[]): Map<string, CalendarEventType[]> => {
        const groupedEvents = new Map<string, CalendarEventType[]>();

        for(let event of events) {
            Logger.debug('Event: ' + JSON.stringify(event));
            const key = fromMomentToGroupedEventMapKey(event.dtStart);
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

        const res = await axiosClientService.GET<CalendarEventTypeDTO[]>(url).catch(handleAxiosError);
        
        Logger.debug(`Fetched calendar events from ${url} with ${res?.data.length} events: ${JSON.stringify(res?.data)}`);

        return groupCalEventsByDate(mapCalendarEventDTOListToDO(res?.data as CalendarEventTypeDTO[]));
    }
} 

