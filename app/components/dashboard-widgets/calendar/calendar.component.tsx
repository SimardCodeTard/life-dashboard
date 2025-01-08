    "use client";

    import { ChangeEvent, useEffect, useState } from "react";
    import styles from './calendar.module.css';
    import { CalendarEventType, CalendarSourceType } from "@/app/types/calendar.type";
    import { clientCalendarDataService } from "@/app/services/client/calendar-data-client.service";
    import { ObjectId } from "mongodb";
    import ModalComponent from "../../shared/modal.component";
    import AddIcon from '@mui/icons-material/Add'


    export default function Calendar() {

        const [calendarSources, setCalendarSources] = useState<CalendarSourceType[]>([]);
        
        const [calendarsMap, setCalendarsMap] = useState<Map<string, CalendarEventType[]>>();
        const [selectedSource, setSelectedSource] = useState<CalendarSourceType>();
        const [modalOpened, setModalOpened] = useState(false);
        const [sourceFormState, setSourceFormState] = useState<{name: string, url: string}>({name: '', url: ''});

        useEffect(() => {
            init();
        }, [setCalendarsMap, setSelectedSource]);

        async function init() {
            setCalendarSources(
                await clientCalendarDataService.fetchCalendarSources()
            );

            if(calendarSources && calendarSources.length > 0) {
                setSelectedSource(calendarSources[0]);
            }

            setCalendarsMap(
                calendarSources && calendarSources.length > 0 ? await clientCalendarDataService.fetchCalendarEventsBySourceId(calendarSources[0]?._id as ObjectId) : new Map()
            )
        } 

        function openSourceAdditionDialog() {
            console.log('onClick')
            setModalOpened(true);
        }

        function onSourceFormNameChange(e: ChangeEvent<HTMLInputElement>) {
            setSourceFormState({...sourceFormState, name: e.target.value})
        }

        function onSourceFormURLChange(e: ChangeEvent<HTMLInputElement>) {
            setSourceFormState({...sourceFormState, url: e.target.value})
        }

        function onNewSourceFormSubmit() {
            clientCalendarDataService.postCalendarSource(sourceFormState).then(newSource => {
                setCalendarSources([
                    ...calendarSources,
                    newSource
                ])
            });
        }

        return (
            <div className={["p-3 h-fit space-y-2", styles.calendar].join(' ')}>    
                <select value={JSON.stringify(selectedSource)} className={styles.sourceSelect}>{
                    calendarSources.map((source, key) => 
                        <option value={JSON.stringify(source)} onSelect={() => setSelectedSource(source)} key={key}>{source.name}</option>
                    )
                }</select>
                <AddIcon onClick={openSourceAdditionDialog} className='cursor-pointer'></AddIcon>
                <ModalComponent modalOpened={modalOpened} setModalOpened={setModalOpened}>
                    <form onSubmit={onNewSourceFormSubmit}>
                        <input 
                            className= "h-1/5 w-3/4 mb-2 bg-[rgba(255,255,255,0.2)] rounded p-1"
                            type="text" 
                            placeholder="Nom"
                            name="name"
                            value={sourceFormState.name}
                            onChange={onSourceFormNameChange}
                            >
                        </input>
                        <input 
                            className="h-1/5 w-3/4 mb-2 bg-[rgba(255,255,255,0.2)] rounded p-1"
                            type="text" 
                            placeholder="Url" 
                            name="href"
                            value={sourceFormState.url}
                            onChange={onSourceFormURLChange}
                            >
                        </input>
                        <button 
                            className="h-1/5 w-3/4 mb-2 bg-[rgba(255,255,255,0.2)] rounded p-1"
                            type="submit"
                            >Save
                        </button>
                    </form>
                </ModalComponent>
            </div>
        );
    }[]