import { CalendarEventType, CalendarEventTypeDTO, CalendarSourceEventsFakeMapType, CalendarSourceType } from "@/app/types/calendar.type";
import { ObjectId } from "mongodb";
import { axiosClientService } from "./axios.client.service";
import { DateTime } from "luxon";
import { Logger } from "../logger.service";
import { CalendarEventsBySourceIdResponseType, CalendarEventsResponseType, CalendarSourceIdDeleteResponseType, CalendarSourceIdPutRequestBodyType, CalendarSourceIdPutResponseType, CalendarSourceNewRequestBodyType, CalendarSourceNewResponseType, CalendarSourceResponseType } from "@/app/types/api.type";

export namespace clientCalendarDataService {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    /**
     * Converts a DateTime object to a grouped event key.
     * @param dt The DateTime object to convert.
     * @returns The grouped event key, formetted to dd-MM-yyyy.
     */
    export const fromDateTimeToGroupedEventKey = (dt: DateTime): string => {
        return dt.toFormat('dd-MM-yyyy');
    };


    /**
     * Converts a grouped event key to DateTime object.
     * @param key The key to convert.
     * @returns The converted DateTime object.
     */
    export const fromGroupedEventKeyToDateTime = (key: string): DateTime => {
        return DateTime.fromFormat(key, 'dd-MM-yyyy');
    }

    /**
     * Maps a CalendarEventTypeDTO to a CalendarEventType.
     * @param calendarEventDto - The DTO to map.
     * @returns The mapped CalendarEventType.
     */
    export const mapCalendarEventDTOtoDO = (calendarEventDto: CalendarEventTypeDTO): CalendarEventType => {
        return {
            ...calendarEventDto,
            dtStart: DateTime.fromISO(calendarEventDto.dtStart),
            dtEnd: DateTime.fromISO(calendarEventDto.dtEnd),
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
     * Sorts a list of CalendarEventTypes by their start time.
     * @param events - The list of events to sort.
     * @returns The sorted list of events.
     */
    const sortEvents = (a: CalendarEventType, b: CalendarEventType): number => {
        return (a.dtStart.toSeconds()) - (b.dtStart.toSeconds());
    };

    /**
     * Fetches calendar sources from the API.
     * @returns A promise that resolves to a list of CalendarSourceTypes.
     */
    export const fetchCalendarSources = async (userId: ObjectId): Promise<CalendarSourceResponseType> => {
        return axiosClientService.GET<CalendarSourceResponseType>(`${API_URL}/calendar/source?userId=${userId.toString()}`).then(res => res.data);
    };

    export const groupEventsByDateAndSource = (
        calendarSourceEventsMap: Map<CalendarSourceType, CalendarEventType[]>
        , groupedMappedEvents = new Map<string, CalendarSourceEventsFakeMapType[]>()
    ): Map<string, CalendarSourceEventsFakeMapType[]> => {
        for (const [source, events] of Array.from(calendarSourceEventsMap.entries())) {
            for (const event of events) {
                const dateKey = fromDateTimeToGroupedEventKey(event.dtStart);

                if (!groupedMappedEvents.has(dateKey)) {
                    groupedMappedEvents.set(dateKey, []);
                }

                const fakeMaps = groupedMappedEvents.get(dateKey)!;
                let fakeMapForCurrentSource = fakeMaps.find(fakeMap => fakeMap.source?._id === source._id);

                if (!fakeMapForCurrentSource) {
                    fakeMapForCurrentSource = { source, events: [] };
                    fakeMaps.push(fakeMapForCurrentSource);
                }

                fakeMapForCurrentSource.events.push(event);
                fakeMapForCurrentSource.events.sort(sortEvents);
            }
        }

        return groupedMappedEvents;
    }

    /**
     * Fetches and groups calendar events by source IDs.
     * Groups by date and by source.
     * @param sourceIds - The IDs of the sources to fetch events for.
     * @returns A promise that resolves to a map of grouped events by source and date.
     */
    export const fetchAndGroupCalendarEventsBySourceIds = async (sourceIds: ObjectId[]): Promise<Map<string, CalendarSourceEventsFakeMapType[]>> => {
        try {
            // Fetch events from API
            const response = await axiosClientService.GET<CalendarEventsResponseType>(
                `${API_URL}/calendar/events?ids=${sourceIds.join(',')}`
            );

            // Convert DTOs to domain objects
            const mappedEvents = new Map<CalendarSourceType, CalendarEventType[]>(
                Object.entries(response.data).map(([source, events]) => [
                    JSON.parse(source) as CalendarSourceType,
                    mapCalendarEventDTOListToDO(events),
                ])
            );

            // Group by date and source
            return groupEventsByDateAndSource(mappedEvents);
        } catch (error) {
            Logger.error(error as Error);
            return new Map();
        }
    };

    /**
     * Fetches calendar events by source ID.
     * @param sourceId - The ID of the source to fetch events for.
     * @returns A promise that resolves to a list of CalendarEventTypes.
     */
    export const fetchCalendarEventsBySourceId = async (sourceId: ObjectId): Promise<CalendarEventType[]> => {
        return axiosClientService.GET<CalendarEventsBySourceIdResponseType>(`${API_URL}/calendar/source/${sourceId.toString()}/events/`).then(res => res.data.map(mapCalendarEventDTOtoDO));
    }

    /**
     * Posts a new calendar source to the API.
     * @param source - The calendar event to post.
     * @returns A promise that resolves to the created CalendarSourceType.
     */
    export const createNewCalendarSource = async (source: CalendarSourceNewRequestBodyType): Promise<CalendarSourceNewResponseType> => {
        return axiosClientService.POST<CalendarSourceNewResponseType, CalendarSourceNewRequestBodyType>(`${API_URL}/calendar/source/new/`, source).then(res => res.data);
    };

    /**
     * Updates a calendar source by ID.
     * @param source - The source to update.
     * @returns A promise that resolves to the updated CalendarSourceType.
     */
    export const updateCalendarSource = async (source: CalendarSourceIdPutRequestBodyType): Promise<CalendarSourceIdPutResponseType> => {
        return axiosClientService.PUT<CalendarSourceIdPutResponseType, CalendarSourceIdPutRequestBodyType>(`${API_URL}/calendar/source/${source._id}/`, source).then(res => res.data);
    }

    /**
     * Deletes a calendar source by ID.
     * @param sourceId - The ID of the source to delete.
     * @returns A promise that resolves when the source is deleted.
     */
    export const deleteCalendarSource = async (sourceId: ObjectId): Promise<CalendarSourceIdDeleteResponseType> => {
        return axiosClientService.DELETE<CalendarSourceIdDeleteResponseType>(`${API_URL}/calendar/source/${sourceId}`).then(res => res.data);
    };
}
