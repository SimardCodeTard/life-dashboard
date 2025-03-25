"use client";;
import { ChangeEvent, useEffect, useState } from "react";
import { CalendarSourceEventsFakeMapType, CalendarSourceType } from "@/app/types/calendar.type";
import { clientCalendarDataService } from "@/app/services/client/calendar-data-client.service";
import { ObjectId } from "mongodb";
import CalendarItem from "./calendar-item/calendar-item.component";
import { DateTime } from "luxon";
import { ArrowLeft, ArrowRight, CalendarMonth, KeyboardTab, SaveAlt, Update } from "@mui/icons-material";
import CalendarRender from "./calendar-render";

import './calendar.scss';
import Loader from "../../shared/loader/loader.component";
import EventEmitter from "@/app/lib/event-emitter";
import CalendarSource from "./calendar-source/calendar-source.component";
import { CalendarSourceEditEventsEnum, EventKeysEnum } from "@/app/enums/events.enum";

export default function Calendar({setIsLoading}: {setIsLoading?: (isLoading: boolean) => void}) {

    function stringToHexColor(input: string): string {
        // This is a silly but effective way to generate a unique color for the calendar sources
        // We use it on the source's URL to generate a color

        // Hash the url
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            hash = input.charCodeAt(i) + ((hash << 5) - hash);
        }
    
        // Convert the hash to a hex color
        const color = ((hash & 0xFFFFFF) >>> 0).toString(16).padStart(6, '0');
        
        // Return the color as a string
        return `#${color}`;
    }

    const [calendarSources, setCalendarSources] = useState<CalendarSourceType[]>([]);
    const [calendarsMap, setCalendarsMap] = useState<Map<string, CalendarSourceEventsFakeMapType[]>>();
    const [selectedDate, setSelectedDate] = useState<DateTime | null>(null);
    
    const [sourceFormState, setSourceFormState] = useState<CalendarSourceType>({ name: '', url: '', color:'', visible: true });
    
    const [sidePanelOpened, setSidePanelOpened] = useState(true);
    const [formInEditMode, setFormInEditMode] = useState(false);
    
    const [sidePanelLoading, setSidePanelLoading] = useState(false);
    const [mainPanelLoading, setMainPanelLoading] = useState(false);
    
    const [calendarSourceEditEventEmitter] = useState(new EventEmitter());

    const fetchCalendarEvents = async (sources: CalendarSourceType[]) => {
        // Fetch the events of multiple sources and group them by date

        // Set the main panel to loading
        setMainPanelLoading(true);
        const sourceIds = sources.map(source => source._id as ObjectId); // Get the source ids
        return clientCalendarDataService.fetchAndGroupCalendarEventsBySourceIds(sourceIds) // Call the big guy
            .then(calendarMap =>setCalendarsMap(calendarMap)) // Set the map holding the events
            .finally(() => {setMainPanelLoading(false)}); // Stop the loader
    }

    const fetchCalendarEventsBySourceId = async (sourceId: ObjectId) => {
        // Fetch the events of a single source by its ID

        // Set the main panel to loading
        setMainPanelLoading(true);
        return clientCalendarDataService.fetchCalendarEventsBySourceId(sourceId); // Call the big guy
        // We do not set the map or stop the loader here because this function is ment to be used in a loop
    }

    const fetchCalendarSources = async () => {

        const onSourcedFetched = (sources: CalendarSourceType[]) => {
            setCalendarSources(sources)
            return sources;
        }

        // Fetch the calendar sources

        // Set the side panel to loading
        setSidePanelLoading(true);
        return clientCalendarDataService.fetchCalendarSources() // Call the big guy
            .then(onSourcedFetched)
            .finally(() => setSidePanelLoading(false)); // Stop the loader
    }

    const createNewCalendarSource = async (source: CalendarSourceType) => {
        // Create a new calendar source

        const onNewSourceCreated = async (newSource: CalendarSourceType) => {
            if(!newSource) return;
            // Add the new source to the state
            setCalendarSources(prev => [...prev, newSource]);
            // Stop the loader
            setSidePanelLoading(false) 
            // Call the big guy with our new source to get it's events
            const events = await fetchCalendarEventsBySourceId(newSource._id as ObjectId) 
            // Group the new source's events
            const newCalendarsMap = clientCalendarDataService.groupEventsByDateAndSource(new Map([[newSource, events]]), calendarsMap); 
            // Update the events state
            setCalendarsMap(newCalendarsMap); 
        }

        // Set the main panel to loading
        setSidePanelLoading(true);
        // Generate a unique color for the source in a very silly but effective way
        source.color = stringToHexColor(source.url);
        // Call the big guy
        return clientCalendarDataService.createNewCalendarSource(source)
            .then(onNewSourceCreated)
            // Stop the loader
            .finally(() => {setMainPanelLoading(false)}); 
    }

    const deleteCalendarSource = async (sourceId: ObjectId) => {
        // Delete a calendar source by its ID

        const updateCalendarMap = () => {
            const newCalendarMap = new Map<string, CalendarSourceEventsFakeMapType[]>();

            if(calendarsMap) {
                for (const [day, value] of calendarsMap.entries()) {
                    // Remove the source's events from the events map
                    newCalendarMap.set(day, value.filter(fakeMap => fakeMap.source._id !== sourceId));
                }
            }
            // Update the events state
            setCalendarsMap(newCalendarMap);
        }

        const filterSourceByDeletedId = (source: CalendarSourceType) => source._id !== sourceId;

        // Emit an event that will inform the component displaying the source that it has to start loading
        // This is the exact same system as the one used in the task list component
        calendarSourceEditEventEmitter.emit(EventKeysEnum.CALENDAR_SOURCE_EDIT, CalendarSourceEditEventsEnum.CALENDAR_SOURCE_EDIT_START, sourceId as ObjectId);
        // Call the big guy
        return clientCalendarDataService.deleteCalendarSource(sourceId)
            // Remove the deleted source from the state
            .then(() => setCalendarSources(prev => prev.filter(filterSourceByDeletedId)))
            .then(updateCalendarMap)
            // Emit an event that will inform the component displaying the source that it has to stop loading
            .finally(() => calendarSourceEditEventEmitter.emit(EventKeysEnum.CALENDAR_SOURCE_EDIT, CalendarSourceEditEventsEnum.CALENDAR_SOURCE_EDIT_END, sourceId as ObjectId)); 
    }

    const updateCalendarSource = async (sourceToUpdate: CalendarSourceType) => {
        // Update a calendar source

        const onSourceUpdated = () => {
            // Update the source
            const updateEditedSource = (source: CalendarSourceType) => source._id === sourceToUpdate._id ? sourceToUpdate : source
            setCalendarSources(prev => prev.map(updateEditedSource));
            
            // Here we need to check if the URL of the source was changed during the update to fetch the new events
            let urlChanged = false;

            if (calendarsMap) {
                // Loop over the days of the map
                for (const [_, value] of calendarsMap.entries()) {
                    // Loop over the fakeMaps of the day
                    value.forEach((fakeMap: CalendarSourceEventsFakeMapType) => {
                        // If the source of the fakeMap is the source we updated
                        if (fakeMap.source._id === sourceToUpdate._id) {
                            // Check if the URL was changed
                            if (fakeMap.source.url !== sourceToUpdate.url) {
                                // If it was changed, set the flag to true and clear the events of the fakeMap
                                urlChanged = true;
                                fakeMap.events = [];
                            }
                            // Update the source of the fakeMap
                            fakeMap.source = sourceToUpdate;
                        }
                    });
                }
            }
            

            if(urlChanged) {
                // If the URL was changed, fetch the new events
                // Start loading and call the big guy
                fetchCalendarEventsBySourceId(sourceToUpdate._id as ObjectId).then(events => {
                    // Group the new events
                    const newCalendarsMap = clientCalendarDataService.groupEventsByDateAndSource(new Map([[sourceToUpdate, events]]), calendarsMap);
                    // Update the events state
                    setCalendarsMap(newCalendarsMap);
                })
                // Stop the loader
                .finally(() => {setMainPanelLoading(false)});
            }
        }

        // Emit an event that will inform the component displaying the source that it has to start loading
        calendarSourceEditEventEmitter.emit(EventKeysEnum.CALENDAR_SOURCE_EDIT, CalendarSourceEditEventsEnum.CALENDAR_SOURCE_EDIT_START, sourceToUpdate._id as ObjectId);
        // Call the big guy
        return clientCalendarDataService.updateCalendarSource(sourceToUpdate)
            .then(onSourceUpdated)
            // Emit an event that will inform the component displaying the source that it has to stop loading
            .finally(() => {calendarSourceEditEventEmitter.emit(EventKeysEnum.CALENDAR_SOURCE_EDIT, CalendarSourceEditEventsEnum.CALENDAR_SOURCE_EDIT_END, sourceToUpdate._id as ObjectId)});
    }

    useEffect(() => {
        fetchCalendarSources()
        .then(sources => {
            if(sources.length > 0) {
                fetchCalendarEvents(sources);
            }
        })
        .finally(() => {
            setSelectedDate(DateTime.now());
            setIsLoading && setIsLoading(false);
        });
    }, []);

    function onSourceFormNameChange(e: ChangeEvent<HTMLInputElement>) {
        setSourceFormState({ ...sourceFormState, name: e.target.value });
    }

    function onSourceFormURLChange(e: ChangeEvent<HTMLInputElement>) {
        setSourceFormState({ ...sourceFormState, url: e.target.value });
    }

    function onNewSourceFormSubmit(e: React.FormEvent) {
        e.preventDefault();

        if(formInEditMode) {
            updateCalendarSource(sourceFormState).finally(() => {
                setSourceFormState({ name: '', url: '', color: '', visible: true });
                setFormInEditMode(false);
            });
        } else {
            if(!sourceFormState.name || sourceFormState.name === '' || !sourceFormState.url || sourceFormState.url === '') {
                return;
            }

            createNewCalendarSource(sourceFormState).finally(() => {
                setSourceFormState({ name: '', url: '', color: '', visible: true });
            });
        }
    }

    function deleteSource(sourceId: ObjectId) {
        if(formInEditMode && sourceFormState._id === sourceId) {
            setFormInEditMode(false);
            setSourceFormState({ name: '', url: '', color: '', visible: true });
        }
        deleteCalendarSource(sourceId);
    }

    function shiftMonth(shift: number) {
        const newSelectedDate = selectedDate?.plus({month: shift}) || DateTime.now();

        if(selectedDate && (newSelectedDate.daysInMonth as number) >= selectedDate?.day) {
            newSelectedDate.set({day: selectedDate?.day});
        } else {
            newSelectedDate.set({day: 1});
        }
 
        newSelectedDate.set({day: selectedDate?.day || newSelectedDate.daysInMonth});

        setSelectedDate(newSelectedDate);
    }

    const onSourceVisibilityChange = (source: CalendarSourceType) => {
        if(formInEditMode && source._id === sourceFormState._id) {
            setSourceFormState({ ...sourceFormState, visible: !sourceFormState.visible });
        }

        source.visible = !source.visible;

        updateCalendarSource(source);
    }

    const onSourceEditClick = (source: CalendarSourceType) => {
        if(formInEditMode) {
            if(sourceFormState._id !== source._id) {
                calendarSourceEditEventEmitter.emit(EventKeysEnum.CALENDAR_SOURCE_EDIT, CalendarSourceEditEventsEnum.CALENDAR_SOURCE_EDIT_SOURCE_REPLACED, source._id as ObjectId);

                setSourceFormState(source);
                return;
            }
            setFormInEditMode(false);
            setSourceFormState({ name: '', url: '', color: '', visible: true });
        } else {
            setFormInEditMode(true);
            setSourceFormState(source);
        }
    }

    const sliceName = (name: string, maxLen = 9):string => name.slice(0, maxLen).concat(name.length > 9 ? '...' : '');

    return (
        <div className="card-content calendar">

            <div className={`calendar-side-panel card-side-panel ${sidePanelOpened ? '' : 'card-side-panel-collapsed'}`}>
                <KeyboardTab onClick={() => setSidePanelOpened(!sidePanelOpened)} className="deploy-icon"></KeyboardTab>

                {sidePanelLoading && <Loader></Loader>}

                <div className="calendar-side-panel-content">
                    {calendarSources.length > 0 && <div className="calendar-source-wrapper">{calendarSources.map((source, key) => {
                        return <CalendarSource 
                            key={source._id?.toString()} 
                            source={source} 
                            editSource={onSourceEditClick} 
                            deleteSource={deleteSource} 
                            onVisibilityChange={onSourceVisibilityChange} 
                            sourceEditEventEmitter={calendarSourceEditEventEmitter}
                        ></CalendarSource>
                    }
                    )}</div>}



                    <form onSubmit={onNewSourceFormSubmit} className="new-calendar-source-form">
                        <h3>{formInEditMode ? `Edit source ${sliceName(sourceFormState.name)}` : 'Import new source'}</h3>
                        <input value={sourceFormState.name} onChange={onSourceFormNameChange} type="text" placeholder="Source name..." />
                        <input value={sourceFormState.url} onChange={onSourceFormURLChange} type="texte" placeholder="Source url..." />
                        <button type="submit">  {formInEditMode ? <Update/> : <SaveAlt/>} </button>
                    </form>
                </div>
            </div>


            <div className="card-main-panel">
                {mainPanelLoading && <Loader></Loader>}
                <div className="card-header">
                    <h2>Calendar</h2>
                    <CalendarMonth/>
                </div>

                <div className="card-body">
                    <div className="calendar-main-panel">

                        <div className="calendar-month-select">
                            <button onClick={() => shiftMonth(-1)}><ArrowLeft></ArrowLeft></button>
                            <h3>{selectedDate?.toFormat('LLLL yyyy')}</h3>
                            <button onClick={() => shiftMonth(1)}><ArrowRight></ArrowRight></button>
                        </div>

                        {selectedDate && <CalendarRender currentDay={selectedDate} eventsMap={calendarsMap || new Map()} setSelectedDate={setSelectedDate}></CalendarRender>}

                        <div className="calendar-events-wrapper">{selectedDate && calendarsMap?.get(clientCalendarDataService.fromDateTimeToGroupedEventKey(selectedDate))?.map((fakeEventSourceMap, key) => 
                            <div key={`calendar-source-${fakeEventSourceMap.source._id?.toString()}`} className="calendar-source-wrapper">{
                                fakeEventSourceMap.source.visible && fakeEventSourceMap.events.map((event, key) => {
                                    return <CalendarItem key={`calendar-source-${fakeEventSourceMap.source._id?.toString()}-event-${fakeEventSourceMap.events.indexOf(event)}`} color={fakeEventSourceMap.source.color} event={event}></CalendarItem>
                                })
                            }</div>)
                        }</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
