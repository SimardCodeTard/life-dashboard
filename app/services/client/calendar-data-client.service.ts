import { CalendarEventType, CalendarEventTypeDTO, CalendarSourceType } from "@/app/types/calendar.type";
import { CalendarUtils } from "@/app/utils/calendar.utils";
import { Logger } from "../logger.service";
import moment, { Moment } from "moment";
import { ObjectId } from "mongodb";
import { axiosClientService } from "./axios.client.service";

export namespace clientCalendarDataService {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const formatDate = (dateStr: string): Moment => moment.parseZone(dateStr);

    export const mapCalendarEventDTOtoDO = (calendarEventDto: CalendarEventTypeDTO): CalendarEventType => {
        const object = {
            ...calendarEventDto,
            dtStart: formatDate(calendarEventDto.dtStart),
            dtEnd: formatDate(calendarEventDto.dtEnd),
        };

        Logger.debug('Mapped calendar event DTO to DO: ' + JSON.stringify(object));

        return object;
    }

    export const mapCalendarEventDTOListToDO = (calendarEventDTOList: CalendarEventTypeDTO[]): CalendarEventType[] => calendarEventDTOList.map(mapCalendarEventDTOtoDO);

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

    export const fetchCalendarSources = async (): Promise<CalendarSourceType[]> => 
        axiosClientService.GET<CalendarSourceType[]>(API_URL + '/calendar/source').then(res => res.data);

    export const fetchAndGroupCalendarEventsBySourceId = (sourceId: ObjectId): Promise<Map<string, CalendarEventType[]>> => 
        axiosClientService.GET<CalendarEventTypeDTO[]>(API_URL + '/calendar/source/' + sourceId.toString())
            .then(res => res.data)
            .then(mapCalendarEventDTOListToDO)
            .then(groupCalEventsByDate)

    export const postCalendarSource = async (calendarEvent: any): Promise<CalendarSourceType>  => 
        axiosClientService.POST<CalendarSourceType>(API_URL + '/calendar/source/new/', calendarEvent).then(res => res.data);

    export const deleteCalendarSource = async (sourceId: ObjectId): Promise<void> =>
        axiosClientService.DELETE<void>(API_URL + 'calendar/source/' + sourceId.toString()).then(res => res.data);
} 

