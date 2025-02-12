import { CalendarEventType, CalendarEventTypeDTO, CalendarSourceType } from "@/app/types/calendar.type";
import { Logger } from "../logger.service";
import moment, { Moment } from "moment";
import { ObjectId } from "mongodb";
import { axiosClientService } from "./axios.client.service";

export namespace clientCalendarDataService {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    /**
     * Formats a date string into a Moment object.
     * @param dateStr - The date string to format.
     * @returns A Moment object representing the date.
     */
    const formatDate = (dateStr: string): Moment => moment.parseZone(dateStr);

    /**
     * Maps a CalendarEventTypeDTO to a CalendarEventType.
     * @param calendarEventDto - The DTO to map.
     * @returns The mapped CalendarEventType.
     */
    export const mapCalendarEventDTOtoDO = (calendarEventDto: CalendarEventTypeDTO): CalendarEventType => {
        return {
            ...calendarEventDto,
            dtStart: formatDate(calendarEventDto.dtStart),
            dtEnd: formatDate(calendarEventDto.dtEnd),
        };
    };

    /**
     * Maps a list of CalendarEventTypeDTOs to a list of CalendarEventTypes.
     * @param calendarEventDTOList - The list of DTOs to map.
     * @returns The list of mapped CalendarEventTypes.
     */
    export const mapCalendarEventDTOListToDO = (calendarEventDTOList: CalendarEventTypeDTO[]): CalendarEventType[] => {
        return calendarEventDTOList.map(mapCalendarEventDTOtoDO);
    };

    /**
     * Converts a Moment object to a string key for grouping events.
     * @param date - The Moment object to convert.
     * @returns The string key representing the date.
     */
    export const fromMomentToGroupedEventMapKey = (date: Moment): string => {
        return date.format('DD-MM-YYYY');
    };

    /**
     * Converts a grouped event key to a Moment object.
     * @param groupedEventKey - The string key to convert.
     * @returns The Moment object representing the date.
     */
    export const fromGroupedEventKeyToMoment = (groupedEventKey: string): Moment => {
        const [date, month, year] = groupedEventKey.split('-');
        return moment().year(parseInt(year)).month(parseInt(month) - 1).date(parseInt(date));
    };

    /**
     * Sorts a list of CalendarEventTypes by their start time.
     * @param events - The list of events to sort.
     * @returns The sorted list of events.
     */
    const sortEvents = (events: CalendarEventType[]): CalendarEventType[] => {
        return events.sort((a, b) => {
            return (a.dtStart.hour() * 60 + a.dtStart.minute()) - (b.dtStart.hour() * 60 + b.dtStart.minute());
        });
    };

    /**
     * Groups a list of CalendarEventTypes by their start date.
     * @param events - The list of events to group.
     * @returns A map of grouped events by date.
     */
    const groupCalEventsByDate = (events: CalendarEventType[]): Map<string, CalendarEventType[]> => {
        const groupedEvents = new Map<string, CalendarEventType[]>();

        for (let event of events) {
            const key = fromMomentToGroupedEventMapKey(event.dtStart);
            const eventsToGroupWith = groupedEvents.get(key);
            if (eventsToGroupWith) {
                groupedEvents.set(key, [...eventsToGroupWith, event]);
            } else {
                groupedEvents.set(key, [event]);
            }
        }

        groupedEvents.forEach((values, key) => {
            groupedEvents.set(key, sortEvents(values));
        });

        return groupedEvents;
    };

    /**
     * Fetches calendar sources from the API.
     * @returns A promise that resolves to a list of CalendarSourceTypes.
     */
    export const fetchCalendarSources = async (): Promise<CalendarSourceType[]> => {
        return axiosClientService.GET<CalendarSourceType[]>(`${API_URL}/calendar/source`).then(res => res.data);
    };

    /**
     * Fetches and groups calendar events by source ID.
     * @param sourceId - The ID of the source to fetch events for.
     * @returns A promise that resolves to a map of grouped events by date.
     */
    export const fetchAndGroupCalendarEventsBySourceId = async (sourceId: ObjectId): Promise<Map<string, CalendarEventType[]>> => {
        const response = await axiosClientService.GET<CalendarEventTypeDTO[]>(`${API_URL}/calendar/source/${sourceId.toString()}`);
        const events = mapCalendarEventDTOListToDO(response.data);
        return groupCalEventsByDate(events);
    };

    /**
     * Posts a new calendar source to the API.
     * @param calendarEvent - The calendar event to post.
     * @returns A promise that resolves to the created CalendarSourceType.
     */
    export const postCalendarSource = async (calendarEvent: any): Promise<CalendarSourceType> => {
        return axiosClientService.POST<CalendarSourceType>(`${API_URL}/calendar/source/new/`, calendarEvent).then(res => res.data);
    };

    /**
     * Deletes a calendar source by ID.
     * @param sourceId - The ID of the source to delete.
     * @returns A promise that resolves when the source is deleted.
     */
    export const deleteCalendarSource = async (sourceId: ObjectId): Promise<void> => {
        return axiosClientService.DELETE<void>(`${API_URL}/calendar/source/${sourceId.toString()}`).then(res => res.data);
    };
}
