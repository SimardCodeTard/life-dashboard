"use client";;
import { ChangeEvent, useEffect, useState } from "react";
import styles from './calendar.module.css';
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

            console.log('Sources: ' + JSON.stringify(sources));

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
        }).catch(error => {

        console.error(error);
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
        <div className={["p-3 h-fit space-y-2 relative", styles.calendar].join(' ')}>

            <div className="flex flex-col">
                <h3>Calendrier</h3>
                <div className="mt-1 flex items-center">
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
                    <div className="flex">
                        <AddIcon onClick={openSourceAdditionDialog} className='cursor-pointer'/>
                        <DeleteIcon className='cursor-pointer' onClick={() => deleteSource(selectedSource?._id as ObjectId)}/>
                    </div>
                </div>

                <div className="flex justify-evenly pl-2 pr-2 sticky top-0 backdrop-blur-3xl bg-white/5 p-2 rounded mt-4">
                    <ArrowBackIos className="cursor-pointer" onClick={previousDay}></ArrowBackIos>
                    
                    <span className="flex flex-col">
                        <p>{selectedDate?.format('DD / MM / yyyy')}</p>
                        {
                            selectedDateIsToday()
                            ? <p className="w-full flex text-[rgba(255,255,255,0.4)] justify-center">today</p> 
                            : <span className="w-full cursor-pointer flex text-[rgba(255,255,255,0.4)] justify-center"
                                onClick={() => setSelectedDate(moment())}
                                >go to today</span>}
                    </span>
                    
                    <ArrowForwardIos className="cursor-pointer" onClick={nextDay}></ArrowForwardIos>
                
                </div>

            </div>

            <div className="flex flex-col space-y-4">
                {calendarsMap?.get(selectedDate.format('DD-MM-YYYY'))?.map((event, key) => <CalendarItem event={event} key={key} />)}
            </div>

            {isLoading && <Loader />}

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
