"use client";

import { useEffect, useState } from "react";
import styles from './calendar.module.css';
import { CalendarEventType, CalendarSourceType } from "@/app/types/calendar.type";
import { clientCalendarDataService } from "@/app/services/client/calendar-data-client.service";
import { ObjectId } from "mongodb";
import ModalComponent from "../../shared/modal.component";
import AddIcon from '@mui/icons-material/Add';


export default function Calendar() {

    const [calendarSources, setCalendarSources] = useState<CalendarSourceType[]>([]);
    
    const [calendarsMap, setCalendarsMap] = useState<Map<string, CalendarEventType[]>>();
    const [selectedSource, setSelectedSource] = useState<CalendarSourceType>();
    const [modalOpened, setModalOpened] = useState(false);

    useEffect(() => {
        init();
    }, [setCalendarsMap, setSelectedSource]);

    async function init() {
        setCalendarSources(
            await clientCalendarDataService.fetchCalendarSources()
        );

        if(calendarSources ) {
            setSelectedSource(calendarSources[0]);
        }


        setCalendarsMap(
            calendarSources ? await clientCalendarDataService.fetchCalendarEventsBySourceId(calendarSources[0]?._id as ObjectId) : new Map()
        )
    } 

    function openSourceAdditionDialog() {
        console.log('onClick')
        setModalOpened(true);
    }

    return (
        <div className={["p-3 h-fit space-y-2", styles.calendar].join(' ')}>    
            <select className={styles.sourceSelect}>{
                calendarSources.map((source, key) => 
                    <option selected={selectedSource == source} onSelect={() => setSelectedSource(source)} key={key}>{source.name}</option>
                )
             }</select>
        <AddIcon onClick={openSourceAdditionDialog} className='cursor-pointer'></AddIcon>
        <ModalComponent modalOpened={modalOpened} setModalOpened={setModalOpened}>
            <form>
                <input type="text" placeholder="Nom" name="name"></input>
                <input type="text" placeholder="Url" name="href"></input>
                <input type="submit">Save</input>
            </form>
        </ModalComponent>
        </div>
    );
}[]