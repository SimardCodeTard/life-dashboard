import { EventKeysEnum } from "../enums/events.enum";
import { Logger } from "../services/logger.service";

export default class EventEmitter {
    events: Partial<Record<EventKeysEnum, Function[]>> = {};

    on(event: EventKeysEnum, listener: Function) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);

        Logger.debug('EventEmitter: registered new listened for event: ' + event);
    }

    emit(event: EventKeysEnum, ...args: any[]) {
        if (!this.events[event]) {
            return;
        }
        this.events[event].forEach(listener => listener(...args));

        Logger.debug('EventEmitter: emitted event: ' + event);
    }

    off(event: EventKeysEnum, listener: Function) {
        if (!this.events[event]) {
            return;
        }
        this.events[event] = this.events[event].filter(l => l !== listener);

        Logger.debug('EventEmitter: removed listener for event: ' + event);
    }
}
