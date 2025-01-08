"use client";

import { ChangeEvent, useEffect, useState } from "react";
import styles from './calendar.module.css';
import { CalendarEventType, CalendarSourceType } from "@/app/types/calendar.type";
import { clientCalendarDataService } from "@/app/services/client/calendar-data-client.service";
import { ObjectId } from "mongodb";
import ModalComponent from "../../shared/modal.component";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from "../../shared/loader/loader.component";

export default function Calendar() {
    const [calendarSources, setCalendarSources] = useState<CalendarSourceType[]>([]);
    const [sourceFormState, setSourceFormState] = useState<{ name: string, url: string }>({ name: '', url: '' });
    const [calendarsMap, setCalendarsMap] = useState<Map<string, CalendarEventType[]>>();
    const [selectedSource, setSelectedSource] = useState<CalendarSourceType>();
    const [modalOpened, setModalOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        const fetchData = async () => {
            const sources = await clientCalendarDataService.fetchCalendarSources();
            setCalendarSources(sources);

            if (sources.length > 0) {
                const selected = sources[0];
                setSelectedSource(selected);
                const events = await clientCalendarDataService.fetchCalendarEventsBySourceId(selected._id as ObjectId);
                setCalendarsMap(new Map(events)); // Assuming events is the array or Map you need
            }
        };

        fetchData().finally(() => setIsLoading(false)); // Make sure loading state is reset
    }, []);

    function openSourceAdditionDialog() {
        setModalOpened(true);
    }

    function onSourceFormNameChange(e: ChangeEvent<HTMLInputElement>) {
        setSourceFormState({ ...sourceFormState, name: e.target.value });
    }

    function onSourceFormURLChange(e: ChangeEvent<HTMLInputElement>) {
        setSourceFormState({ ...sourceFormState, url: e.target.value });
    }

    function onNewSourceFormSubmit(e: React.FormEvent) {
        e.preventDefault();

        clientCalendarDataService.postCalendarSource(sourceFormState).then(newSource => {
            setCalendarSources(prev => [...prev, newSource]);
            setModalOpened(false);
            setSourceFormState({ name: '', url: '' });
        }).catch(error => {

        console.error(error);
        });
    }

    return (
        <div className={["p-3 h-fit space-y-2 relative", styles.calendar].join(' ')}>

            <div className="flex items-center">
                <select
                    value={selectedSource?._id?.toString()}
                    className={styles.sourceSelect}
                    onChange={(e) => {
                        const selected = calendarSources.find(source => source._id?.toString() === e.target.value);
                        setSelectedSource(selected);
                    }}
                >
                    {calendarSources.map((source, key) =>
                        <option value={source._id?.toString()} key={key}>{source.name}</option>
                    )}
                </select>
                <AddIcon onClick={openSourceAdditionDialog} className='cursor-pointer' />
                <DeleteIcon />
            </div>

            {isLoading && <Loader />}@

            <ModalComponent modalOpened={modalOpened} setModalOpened={setModalOpened}>
                <form onSubmit={onNewSourceFormSubmit}>
                    <input
                        className="h-1/5 w-3/4 mb-2 bg-[rgba(255,255,255,0.2)] rounded p-1"
                        type="text"
                        placeholder="Nom"
                        name="name"
                        value={sourceFormState.name}
                        onChange={onSourceFormNameChange}
                    />
                    <input
                        className="h-1/5 w-3/4 mb-2 bg-[rgba(255,255,255,0.2)] rounded p-1"
                        type="text"
                        placeholder="Url"
                        name="href"
                        value={sourceFormState.url}
                        onChange={onSourceFormURLChange}
                    />
                    <button
                        className="h-1/5 w-3/4 mb-2 bg-[rgba(255,255,255,0.2)] rounded p-1"
                        type="submit"
                    >
                        Save
                    </button>
                </form>
            </ModalComponent>
        </div>
    );
}
