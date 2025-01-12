import { serverCalendarDataService } from "@/app/services/server/calendar-data.server.service";
import { handleAPIError } from "@/app/utils/api.utils";

export const dynamic = 'force-dynamic'

export const GET = () => serverCalendarDataService.findAllCalendarSources().then(Response.json).catch(handleAPIError);