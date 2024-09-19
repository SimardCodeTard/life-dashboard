import { APIBadRequestError } from "@/app/errors/api.error"
import { serverCalendarDataService } from "@/app/services/server/calendar-data.server.service"
import { handleAPIError } from "@/app/utils/api.utils"
import { ObjectId } from "mongodb"

export const GET = (
    req: Request,
    { params }: { params: { id: string } }
): Promise<Response> => serverCalendarDataService.findCalendarSourceById(new ObjectId(params.id)).then(source => {
    if(!source) {
        throw new APIBadRequestError('Calendar source not found')
    } 
    return source.url as string;
}).then(serverCalendarDataService.fetchIcalData).then(serverCalendarDataService.parseEventsFromIcal).then(Response.json).catch(handleAPIError)
