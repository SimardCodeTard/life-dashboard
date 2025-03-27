import { serverCalendarDataService } from "@/app/services/server/calendar-data.server.service";
import { CalendarSourceIdDeleteResponseType, CalendarSourceIdPutRequestBodyType, CalendarSourceIdPutResponseType, } from "@/app/types/api.type";
import { CalendarSourceType } from "@/app/types/calendar.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";
import { ObjectId } from "mongodb";

// Force dynamic
export const dynamic = 'force-dynamic';

const deleteHandler = async ({ params }: { params: Promise<{ id: string }>}): Promise<CalendarSourceIdDeleteResponseType> => {
    return await serverCalendarDataService.deleteCalendarSourceById(new ObjectId((await params).id));
}

const putHandler = async (req: Request): Promise<CalendarSourceIdPutResponseType> => {
    const body: CalendarSourceType = await parseBody<CalendarSourceIdPutRequestBodyType>(req);
    return await serverCalendarDataService.updateCalendarSource(body);
}

export const DELETE = async (_: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> => Response.json(await deleteHandler({ params }).catch(handleAPIError));
export const PUT = async (req: Request): Promise<Response> => Response.json(await putHandler(req).catch(handleAPIError));
