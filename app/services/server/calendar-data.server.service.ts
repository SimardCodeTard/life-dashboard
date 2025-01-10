import { CalendarEventTypeDTO, CalendarSourceType } from "@/app/types/calendar.type";
import axios from "axios";
import { handleAxiosError } from "@/app/utils/api.utils";
import ICAL from 'ical.js';
import { Collection, DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { serverMongoDataService } from "./mongod-data.server.service";


export namespace serverCalendarDataService {
    const collectionName = "calendar";

    export const patchCalendarSourceURL = (url: string): string => {
        return url.replace('webcal://', 'https://')
    }

    export const fetchIcalData = async (url: string): Promise<string> => axios.get(url).then(res => res.data).catch(handleAxiosError);

    export const parseEventsFromIcal = (calData: string): Promise<CalendarEventTypeDTO[]> => {
        return Promise.resolve(
        new ICAL.Component(ICAL.parse(calData)).getAllSubcomponents('vevent').map((event: any) => ({
            dtEnd: event.getFirstPropertyValue('dtend')?.toJSDate()?.toISOString(),
            dtStart: event.getFirstPropertyValue('dtstart')?.toJSDate()?.toISOString(),
            location: event.getFirstPropertyValue('location'),
            summary: event.getFirstPropertyValue('summary') 
        })
    ) as CalendarEventTypeDTO[])};

    export const saveNewCalendarSource = async (source: CalendarSourceType): Promise<CalendarSourceType> => serverMongoDataService.insertOne<CalendarSourceType>(await getCollection(), source).then(insertOneResult => findCalendarSourceById(insertOneResult.insertedId) as Promise<CalendarSourceType>);
    // MongoDB operations

    const getCollection = async (): Promise<Collection> => (await serverMongoDataService.getDb()).collection(collectionName);

    export const findAllCalendarSources = async (): Promise<CalendarSourceType[]> => serverMongoDataService.findAll<CalendarSourceType>(await getCollection());

    export const findCalendarSourceById = async (id: ObjectId): Promise<CalendarSourceType | null> => serverMongoDataService.findById<CalendarSourceType>(await getCollection(), id);

    export const insertNewCalendarSource = async (source: CalendarSourceType): Promise<InsertOneResult> => serverMongoDataService.insertOne<CalendarSourceType>(await getCollection(), source);
    
    export const deleteCalendarSourceById = async (id: ObjectId): Promise<DeleteResult> => serverMongoDataService.deleteById(await getCollection(), id);

    export const updateCalendarSource = async (favorite: CalendarSourceType): Promise<null | UpdateResult> => serverMongoDataService.updateOne<CalendarSourceType>(await getCollection(), favorite);

}
