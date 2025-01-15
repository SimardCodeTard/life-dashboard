"use client";;
import { ChangeEvent, useEffect, useState } from "react";
import './calendar.css';
import { CalendarEventType, CalendarSourceType } from "@/app/types/calendar.type";
import { clientCalendarDataService } from "@/app/services/client/calendar-data-client.service";
import { ObjectId } from "mongodb";
import ModalComponent from "../../shared/modal.component";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from "../../shared/loader/loader.component";
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import moment, { Moment } from "moment";
import CalendarItem from "./calendar-item/calendar-item.component";

export default function Calendar() {
    const [calendarSources, setCalendarSources] = useState<CalendarSourceType[]>([]);
    const [sourceFormState, setSourceFormState] = useState<{ name: string, url: string }>({ name: '', url: '' });
    const [calendarsMap, setCalendarsMap] = useState<Map<string, CalendarEventType[]>>();
    const [selectedSource, setSelectedSource] = useState<CalendarSourceType>();
    const [modalOpened, setModalOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Moment>(moment());

    useEffect(() => {
        setIsLoading(true);

        (async () => {
            const sources = await clientCalendarDataService.fetchCalendarSources();
            setCalendarSources(sources);

            if (sources.length > 0) {
                const selected = sources[0];
                setSelectedSource(selected);
                const calendarMap = await clientCalendarDataService.fetchAndGroupCalendarEventsBySourceId(selected._id as ObjectId);
                setCalendarsMap(new Map(calendarMap));
            }
        })().finally(() => setIsLoading(false));

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
            setSelectedSource(newSource);
        });
    }

    function deleteSource(sourceId: ObjectId) {
        setIsLoading(true);
        clientCalendarDataService.deleteCalendarSource(sourceId).then(() => {
            setCalendarSources(prev => prev.filter(source => source._id !== sourceId));
        }).finally(() => {
            setIsLoading(false);
        });
    }

    function selectedDateIsToday() {
        return moment().isSame(selectedDate, 'day');
    }

    function previousDay() {
        const newSelectedDate = selectedDate.clone().subtract(1, 'day');
        setSelectedDate(newSelectedDate);
    }
    
    function nextDay() {
        const newSelectedDate = selectedDate.clone().add(1, 'day');
        setSelectedDate(newSelectedDate);
    }
    
    return (
        <div className="calendar">

            <div className="calendar-header">
                <h2>Calendrier</h2>
                <div className="calendar-source-select-wrapper">
                    <select
                        value={selectedSource?._id?.toString()}
                        onChange={(e) => {
                            const selected = calendarSources.find(source => source._id?.toString() === e.target.value);
                            setSelectedSource(selected);
                        }}
                    >
                        {calendarSources.map((source, key) =>
                            <option value={source._id?.toString()} key={key}>{source.name}</option>
                        )}
                    </select>
                    <div className="calendar-source-actions-wrapper actions-wrapper">
                        <AddIcon onClick={openSourceAdditionDialog}/>
                        <DeleteIcon onClick={() => deleteSource(selectedSource?._id as ObjectId)}/>
                    </div>
                </div>

                <div className="calendar-date-select-wrapper actions-wrapper">
                    <ArrowBackIos onClick={previousDay}></ArrowBackIos>
                    
                    <span className="calendar-date-select">
                        <p>{selectedDate?.format('DD / MM / yyyy')}</p>
                        {
                            selectedDateIsToday()
                            ? <p className="calendar-date-is-today-marker subtitle">today</p> 
                            : <span className="calendar-date-is-today-marker subtitle clickable"
                                onClick={() => setSelectedDate(moment())}
                                >go to today</span>}
                    </span>
                    
                    <ArrowForwardIos onClick={nextDay}></ArrowForwardIos>
                
                </div>

            </div>

            <div className="calendar-events-wrapper">
                {calendarsMap?.get(selectedDate.format('DD-MM-YYYY'))?.map((event, key) => <CalendarItem event={event} key={key} />)}
            </div>

            {isLoading && <Loader />}

            <ModalComponent modalOpened={modalOpened} setModalOpened={setModalOpened}>
                <form onSubmit={onNewSourceFormSubmit}>
                    <input
                        type="text"
                        placeholder="Nom"
                        name="name"
                        value={sourceFormState.name}
                        onChange={onSourceFormNameChange}
                    />
                    <input
                        type="text"
                        placeholder="Url"
                        name="href"
                        value={sourceFormState.url}
                        onChange={onSourceFormURLChange}
                    />
                    <button
                        type="submit"
                    >
                        Save
                    </button>
                </form>
            </ModalComponent>
        </div>
    );
}
