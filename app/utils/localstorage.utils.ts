import { ObjectId } from "mongodb";
import { EventKeysEnum } from "../enums/events.enum";
import { LocalStorageKeysEnum } from "../enums/local-storage-keys.enum";
import EventEmitter from "../lib/event-emitter";
import { getActiveSession } from "./indexed-db.utils";

const localStoragePrefix = process.env.NEXT_PUBLIC_LOCAL_STORAGE_PREFIX;

if(localStoragePrefix === undefined) {
    throw new Error('Configuration error: Required environment variables are undefined')
}

export const userEventEmitter = new EventEmitter()

const getLocalStorageKey = (key: LocalStorageKeysEnum): string => key.startsWith(localStoragePrefix) ? key :  `${localStoragePrefix}${key}`;

export const getLocalStorageItem = <T>(key: LocalStorageKeysEnum, parse = true): T | undefined => {
    const localStorageItem = localStorage.getItem(getLocalStorageKey(key));
    if(localStorageItem === null) {
        return undefined;
    }
    if(parse) {
        return JSON.parse(localStorageItem);          
    } else {
        return localStorageItem as T;
    }
}

export const setLocalStorageItem = <T>(key: LocalStorageKeysEnum, value: T) => {
    if(typeof value === 'string') {
        localStorage.setItem(getLocalStorageKey(key), value);
    } else {
        localStorage.setItem(getLocalStorageKey(key), JSON.stringify(value));
    }
}

export const removeLocalStorageItem = (key: LocalStorageKeysEnum) => {
    localStorage.removeItem(getLocalStorageKey(key));
}
    
export const getActiveUserId = (): string | undefined => getLocalStorageItem<string>(LocalStorageKeysEnum.ACTIVE_USER_ID, false);

export const setActiveUserId = (userId: ObjectId) => {
    setLocalStorageItem(LocalStorageKeysEnum.ACTIVE_USER_ID, userId.toString())
    getActiveSession().then((activeSession) => {
        userEventEmitter.emit(EventKeysEnum.USER_UPDATE, activeSession);
    })
};

export const removeActiveUserId = () => {
    removeLocalStorageItem(LocalStorageKeysEnum.ACTIVE_USER_ID)
    userEventEmitter.emit(EventKeysEnum.USER_UPDATE, undefined);
};