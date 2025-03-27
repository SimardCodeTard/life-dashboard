import { EventKeysEnum } from "../enums/events.enum";
import { LocalStorageKeysEnum } from "../enums/local-storage-keys.enum";
import EventEmitter from "../lib/event-emitter";
import { UserTypeClient } from "../types/user.type";

const localStoragePrefix = process.env.NEXT_PUBLIC_LOCAL_STORAGE_PREFIX;

if(localStoragePrefix === undefined) {
    throw new Error('Configuration error: Required environment variables are undefined')
}

export const userEventEmitter = new EventEmitter()

const getLocalStorageKey = (key:string) => key.startsWith(localStoragePrefix) ? key :  `${localStoragePrefix}${key}`;

export const getLocalStorageItem = <T>(key: LocalStorageKeysEnum): T | undefined => {
    const localStorageItem = localStorage.getItem(getLocalStorageKey(key));
    if(localStorageItem === null) {
        return undefined;
    }
    return JSON.parse(localStorageItem);  
}

export const getSessionStorageItem = <T>(key: LocalStorageKeysEnum): T | undefined => {
    const sessionStorageItem = sessionStorage.getItem(getLocalStorageKey(key));
    if(sessionStorageItem === null || sessionStorageItem === undefined || sessionStorageItem === 'undefined') {
        return undefined;
    } 
    return JSON.parse(sessionStorageItem);
}

export const getUserFromLocalStorage = (): UserTypeClient | undefined => getLocalStorageItem<UserTypeClient>(LocalStorageKeysEnum.USER);

export const setUserInLocalStorage = (user: UserTypeClient) => {
    const stringified = JSON.stringify(user);
    localStorage.setItem(getLocalStorageKey(LocalStorageKeysEnum.USER), stringified);
    userEventEmitter.emit(EventKeysEnum.USER_UPDATE, user);
}

export const removeUserFromLocalStorage = () => {
    localStorage.removeItem(getLocalStorageKey(LocalStorageKeysEnum.USER));
    userEventEmitter.emit(EventKeysEnum.USER_UPDATE, undefined);
}
