import { APIBadRequestError } from "@/app/errors/api.error";
import { serverCalendarDataService } from "@/app/services/server/calendar-data.server.service";
import { handleAPIError } from "@/app/utils/api.utils";
import { ObjectId } from "mongodb";

// Force dynamic
export const dynamic = 'force-dynamic';

/**
 * GET handler to fetch calendar source by ID, fetch iCal data, and parse events.
 * @param req - The request object.
 * @param params - The route parameters containing the calendar source ID.
 * @returns A promise that resolves to a Response object.
 */
export const GET = async (
    req: Request,
    { params }: { params: { id: string } }
): Promise<Response> => {
    try {
        const source = await serverCalendarDataService.findCalendarSourceById(new ObjectId(params.id));
        if (!source) {
            throw new APIBadRequestError('Calendar source not found');
        }
        const icalData = await serverCalendarDataService.fetchIcalData(source.url as string);
        const events = await serverCalendarDataService.parseEventsFromIcal(icalData);
        return Response.json(events);
    } catch (error) {
        return handleAPIError(error as Error);
    }
};

/**
 * DELETE handler to delete a calendar source by ID.
 * @param req - The request object.
 * @param params - The route parameters containing the calendar source ID.
 * @returns A promise that resolves to a Response object.
 */
export const DELETE = async (
    req: Request,
    { params }: { params: { id: string } }
): Promise<Response> => {
    try {
        const result = await serverCalendarDataService.deleteCalendarSourceById(new ObjectId(params.id));
        return Response.json(result);
    } catch (error) {
        return handleAPIError(error as Error);
    }
};