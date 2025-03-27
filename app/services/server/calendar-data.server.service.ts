import { CalendarEventTypeDTO, CalendarSourceType } from "@/app/types/calendar.type";
import axios from "axios";
import { handleAxiosError } from "@/app/utils/api.utils";
import ICAL from 'ical.js';
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { serverMongoDataService } from "./mongod-data.server.service";
import { Logger } from "../logger.service";

export namespace serverCalendarDataService {
    const collectionName = "calendar";

    /**
     * Replaces 'webcal://' with 'https://' in the given URL.
     * @param url - The URL to be patched.
     * @returns The patched URL.
     */
    export const patchCalendarSourceURL = (url: string): string => {
        return url.replace('webcal://', 'https://');
    }

    /**
     * Fetches and parses calendar events from the given calendar source.
     * @param calendarSource - The calendar source to fetch and parse events from.
     * @returns - A promise that resolves to a map of calendar events by source.
     */
    export const fetchAndParseCalendarEvents = async (calendarSource: CalendarSourceType): Promise<CalendarEventTypeDTO[]> => {

        const iCalData = await serverCalendarDataService.fetchIcalData(calendarSource.url);
        const calendarEvents = await serverCalendarDataService.parseEventsFromIcal(iCalData);

        Logger.debug(`Fetched ${calendarEvents.length} events from source ${calendarSource.name}`)

        return calendarEvents;
    }

    /**
     * Fetches iCal data from the given URL.
     * @param url - The URL to fetch iCal data from.
     * @returns A promise that resolves to the iCal data as a string.
     */
    export const fetchIcalData = async (url: string): Promise<string> => {
        return axios.get(url).then(res => res.data).catch(handleAxiosError);
    }

    /**
     * Parses events from iCal data.
     * @param calData - The iCal data as a string.
     * @returns A promise that resolves to an array of CalendarEventTypeDTO.
     */
    export const parseEventsFromIcal = (calData: string): Promise<CalendarEventTypeDTO[]> => {
        return Promise.resolve(
            new ICAL.Component(ICAL.parse(calData)).getAllSubcomponents('vevent').map((event: ICAL.Component) => ({
                dtEnd: (event.getFirstPropertyValue('dtend') as ICAL.Time | null)?.toJSDate().toISOString(),
                dtStart: (event.getFirstPropertyValue('dtstart') as ICAL.Time | null)?.toJSDate().toISOString(),
                location: event.getFirstPropertyValue('location') as string,
                summary: event.getFirstPropertyValue('summary') as string
            })) as CalendarEventTypeDTO[]
        );
    }

    /**
     * Saves a new calendar source to the database.
     * @param source - The calendar source to save.
     * @returns A promise that resolves to the saved CalendarSourceType.
     */
    export const saveNewCalendarSource = async (source: CalendarSourceType): Promise<CalendarSourceType> => {
        const insertOneResult = await serverMongoDataService.insertOne<CalendarSourceType>(collectionName, source);
        return findCalendarSourceById(insertOneResult.insertedId) as Promise<CalendarSourceType>;
    }

    // MongoDB operations
    /**
     * Finds all calendar sources in the database.
     * @returns A promise that resolves to an array of CalendarSourceType.
     */
    export const findAllCalendarSources = (userId: string): Promise<CalendarSourceType[]> => {
        return serverMongoDataService.findAll<CalendarSourceType>(collectionName, userId);
    }

    /**
     * Finds a calendar source by its ID.
     * @param id - The ID of the calendar source to find.
     * @returns A promise that resolves to the found CalendarSourceType or null if not found.
     */
    export const findCalendarSourceById = (id: ObjectId): Promise<CalendarSourceType | null> => {
        return serverMongoDataService.findById<CalendarSourceType>(collectionName, id);
    }

    /**
     * Finds calendar sources by their IDs.
     * @param ids - The IDs of the calendar sources to find.
     * @returns A promise that resolves to an array of CalendarSourceType.
     */
    export const findCalendarSourceByIds = (ids: ObjectId[]): Promise<CalendarSourceType[]> => {
        return serverMongoDataService.findByIds<CalendarSourceType>(collectionName, ids);
    }

    /**
     * Inserts a new calendar source into the database.
     * @param source - The calendar source to insert.
     * @returns A promise that resolves to the result of the insert operation.
     */
    export const insertNewCalendarSource = (source: CalendarSourceType): Promise<InsertOneResult> => {
        return serverMongoDataService.insertOne<CalendarSourceType>(collectionName, source);
    }

    /**
     * Deletes a calendar source by its ID.
     * @param id - The ID of the calendar source to delete.
     * @returns A promise that resolves to the result of the delete operation.
     */
    export const deleteCalendarSourceById = (id: ObjectId): Promise<DeleteResult> => {
        return serverMongoDataService.deleteById(collectionName, id);
    }

    /**
     * Updates a calendar source in the database.
     * @param source - The calendar source to update.
     * @returns A promise that resolves to the result of the update operation or null if not found.
     */
    export const updateCalendarSource = (source: CalendarSourceType): Promise<null | UpdateResult> => {
        return serverMongoDataService.updateOne<CalendarSourceType>(collectionName, source);
    }
}
