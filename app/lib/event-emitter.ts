import { EventKeysEnum } from "../enums/events.enum";
import { Logger } from "../services/logger.service";

export default class EventEmitter {
    events: Partial<Record<EventKeysEnum, Function[]>> = {};

    on(eventKey: EventKeysEnum, listener: Function) {
        if (!this.events[eventKey]) {
            this.events[eventKey] = [];
        }
        this.events[eventKey]?.push(listener);

        Logger.debug('EventEmitter: registered new listened for event: ' + eventKey);
    }

    emit(eventKey: EventKeysEnum, ...args: any[]) {
        if (!this.events[eventKey]) {
            return;
        }
        this.events[eventKey]?.forEach(listener => listener(...args));

        Logger.debug('EventEmitter: emitted event: ' + eventKey);
    }

    off(eventKey: EventKeysEnum, listener: Function) {
        if (!this.events[eventKey]) {
            return;
        }
        this.events[eventKey] = this.events[eventKey]?.filter(l => l !== listener);

        Logger.debug('EventEmitter: removed listener for event: ' + eventKey);
    }
}
