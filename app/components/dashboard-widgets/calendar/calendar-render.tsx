import { ReactNode } from 'react';
import { DateTime } from 'luxon';
import { CalendarSourceEventsFakeMapType } from '@/app/types/calendar.type';
import { clientCalendarDataService } from '@/app/services/client/calendar-data-client.service';

import './calendar.scss';
import { capitalize } from '@/app/utils/string.util';

export default function CalendarRender(
    { currentDay, eventsMap, setSelectedDate }: 
    { currentDay : DateTime, eventsMap: Map<string, CalendarSourceEventsFakeMapType[]>, setSelectedDate: (date: DateTime) => void }
) {

    let daysLabels: string[] = [];
    
    for (let i = 3; i <= 9; i++) {
        // Build a list of day labels
        // We use luxon because it automatically translates the days to the current locale
        // We start at 3 to have Monday as the first day, this is the reason why we use i % 7 when setting the day
        daysLabels.push(capitalize(DateTime.now().set({ day: i % 7 }).weekdayShort));
    }

    const daysInMonth = currentDay.daysInMonth as number;
    const calendarDays: ReactNode[] = [];
    const firstDay = currentDay.startOf('month').weekday - 1; // Substract 1 to start from Monday

    const onDayClick = (day: number) => {
        setSelectedDate(currentDay.set({ day }));
    }

    const isCurrentDay = (day: number) => {
        return currentDay.day === day;
    }

    const isToday = (day: number) => {
        const now = DateTime.now();
        return now.year === currentDay.year && now.month === currentDay.month && now.day === day;
    }

    calendarDays.push(daysLabels.map((day, index) => <span key={`key-${day}`}>{day}</span>));

    for(let i = 0; i < firstDay; i++) {
        calendarDays.push(<span key={`empty-${i}`}>
        </span>)
    }

    for(let i = 1; i <= daysInMonth; i++) {

        const currentDate = DateTime.fromObject({year: currentDay.year, month: currentDay.month, day: i});

        calendarDays.push(<button key={`key-day-${i}`} className={`calendar-day`} onClick={() => onDayClick(i)}>
            <div className={`calendar-day-content  ${isCurrentDay(i) ? 'selected-calendar-day' : ''} ${isToday(i) ? 'today-calendar-day' : ''}`}>
                {i}
                <span className="calendar-events-badge-wrapper">
                    {eventsMap.get(clientCalendarDataService.fromDateTimeToGroupedEventKey(currentDate))?.map((fakeMap: CalendarSourceEventsFakeMapType, key: number) =>
                        fakeMap.source.visible ? key <= 3 && <span className="calendar-event-marker color-badge" key={fakeMap.source._id?.toString()} style={{backgroundColor: fakeMap.source.color}}></span> : <></>
                    )}
                </span>
            </div>
        </button>)
    }

    return <div className="calendar-render">
        {calendarDays}
    </div>
}