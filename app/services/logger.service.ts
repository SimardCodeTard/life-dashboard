import { DateTime } from "luxon";

export namespace Logger {
    const showDebug = (): boolean => true;
    const showInfo = (): boolean => true;
    const showWarn = (): boolean => true;
    const showError = (): boolean => true;

    export const debug = (message: string) => showDebug() && console.debug(`${DateTime.now().toISO()} [DEBUG] : ${message}`)
    export const info = (message: string) => showInfo() && console.info(`${DateTime.now().toISO()} [INFO] : ${message}`)
    export const warn = (message: string) => showWarn() && console.warn(`${DateTime.now().toISO()} [WARN] : ${message}`)
    export const error = (message: string) => showError() && console.error(`${DateTime.now().toISO()} [ERROR] : ${message}`)

}