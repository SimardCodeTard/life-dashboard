import { Moment } from "moment";
import moment from "moment";

export module CalendarUtils {
    export enum CalendarSourcesEnum {
        ADELB_UNIV_LYON_1 // University Claude Bernard, Lyon, France
    }

    export const isSameDay = (a: Moment, b: Moment = moment()) => a.day() === b.day() && a.month() === b.month() && a.month() === b.month();
}