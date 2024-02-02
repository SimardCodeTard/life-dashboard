import { UnivCalendarLineIndexesEnum } from "@/app/enums/univ-calendar-indexes.enum";
import { CalendarEventTypeDTO } from "@/app/types/calendar.type";
import assert from "assert";
import axios from "axios";
import { 
    APIInternalServerError, 
    APIUnprocessableEntityError, 
} from "@/app/errors/api.error";
import { handleAxiosError } from "@/app/utils/api.utils";

export namespace serverCalendarDataService {
    export const findEventsFromUniv = async (): Promise<CalendarEventTypeDTO[]> => {
        const url = process.env.CALENDAR_URL_UNIV as string;
        
        try {
            assert(url !== undefined);
        } catch (err) {
            throw new APIInternalServerError('Server configuration error: Calendar URL is undefined');
        }

        const data = await axios.get(url).then(res => res.data).catch(handleAxiosError) as string;

        const events: CalendarEventTypeDTO[] = [];

        const requiredFields = [
            UnivCalendarLineIndexesEnum.DTSTART,
            UnivCalendarLineIndexesEnum.DTEND,
            UnivCalendarLineIndexesEnum.LOCATION,
            UnivCalendarLineIndexesEnum.SUMMARY
        ];

        data.split('BEGIN:VEVENT').slice(1).forEach((item: string) => {
            const lines = item.split('\n').map(line => line.replaceAll(/\r\n|\r|\n/g, '')).filter(line => line !== '');
    
            // Check for the presence of required lines
            const isMissingRequiredFields = requiredFields.some(field => !lines[field]);
            if (isMissingRequiredFields) {
                throw new APIUnprocessableEntityError('Missing required data in calendar event');
            }
    
            const dtStart = lines[UnivCalendarLineIndexesEnum.DTSTART].split(':')[1];
            const dtEnd = lines[UnivCalendarLineIndexesEnum.DTEND].split(':')[1];
            const location = lines[UnivCalendarLineIndexesEnum.LOCATION].split(':')[1];
            const summary = lines[UnivCalendarLineIndexesEnum.SUMMARY].split(':')[1];
    
            events.push({ dtEnd, dtStart, location, summary });
        });

        return events;
    }
}
