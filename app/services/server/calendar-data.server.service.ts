import { CalendarEventTypeDTO, CalendarSourceType } from "@/app/types/calendar.type";
import axios from "axios";
import { handleAxiosError } from "@/app/utils/api.utils";
import ICAL from 'ical.js';
import { Collection, DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { serverMongoDataService } from "./mongod-data.server.service";

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
            new ICAL.Component(ICAL.parse(calData)).getAllSubcomponents('vevent').map((event: any) => ({
                dtEnd: event.getFirstPropertyValue('dtend')?.toJSDate()?.toISOString(),
                dtStart: event.getFirstPropertyValue('dtstart')?.toJSDate()?.toISOString(),
                location: event.getFirstPropertyValue('location'),
                summary: event.getFirstPropertyValue('summary')
            })) as CalendarEventTypeDTO[]
        );
    }

    /**
     * Saves a new calendar source to the database.
     * @param source - The calendar source to save.
     * @returns A promise that resolves to the saved CalendarSourceType.
     */
    export const saveNewCalendarSource = async (source: CalendarSourceType): Promise<CalendarSourceType> => {
        const insertOneResult = await serverMongoDataService.insertOne<CalendarSourceType>(await getCollection(), source);
        return findCalendarSourceById(insertOneResult.insertedId) as Promise<CalendarSourceType>;
    }

    // MongoDB operations

    /**
     * Gets the MongoDB collection for calendar sources.
     * @returns A promise that resolves to the MongoDB collection.
     */
    const getCollection = async (): Promise<Collection> => {
        return (await serverMongoDataService.getDb()).collection(collectionName);
    }

    /**
     * Finds all calendar sources in the database.
     * @returns A promise that resolves to an array of CalendarSourceType.
     */
    export const findAllCalendarSources = async (): Promise<CalendarSourceType[]> => {
        return serverMongoDataService.findAll<CalendarSourceType>(await getCollection());
    }

    /**
     * Finds a calendar source by its ID.
     * @param id - The ID of the calendar source to find.
     * @returns A promise that resolves to the found CalendarSourceType or null if not found.
     */
    export const findCalendarSourceById = async (id: ObjectId): Promise<CalendarSourceType | null> => {
        return serverMongoDataService.findById<CalendarSourceType>(await getCollection(), id);
    }

    /**
     * Inserts a new calendar source into the database.
     * @param source - The calendar source to insert.
     * @returns A promise that resolves to the result of the insert operation.
     */
    export const insertNewCalendarSource = async (source: CalendarSourceType): Promise<InsertOneResult> => {
        return serverMongoDataService.insertOne<CalendarSourceType>(await getCollection(), source);
    }

    /**
     * Deletes a calendar source by its ID.
     * @param id - The ID of the calendar source to delete.
     * @returns A promise that resolves to the result of the delete operation.
     */
    export const deleteCalendarSourceById = async (id: ObjectId): Promise<DeleteResult> => {
        return serverMongoDataService.deleteById(await getCollection(), id);
    }

    /**
     * Updates a calendar source in the database.
     * @param source - The calendar source to update.
     * @returns A promise that resolves to the result of the update operation or null if not found.
     */
    export const updateCalendarSource = async (source: CalendarSourceType): Promise<null | UpdateResult> => {
        return serverMongoDataService.updateOne<CalendarSourceType>(await getCollection(), source);
    }
}
