import { DateTime } from "luxon";
import { LoggingLevelsEnum } from "../enums/logging-level.enum";

export namespace Logger {

    const loggingLevel = process.env.NEXT_PUBLIC_LOGGING_LEVEL 
        ? Number(process.env.NEXT_PUBLIC_LOGGING_LEVEL) 
        : LoggingLevelsEnum.WARN;

    const showDebug = (): boolean => loggingLevel <= LoggingLevelsEnum.DEBUG;
    const showInfo = (): boolean => loggingLevel <= LoggingLevelsEnum.INFO;
    const showWarn = (): boolean => loggingLevel <= LoggingLevelsEnum.WARN;
    const showError = (): boolean => loggingLevel <= LoggingLevelsEnum.ERROR;

    export const debug = async (message: any) => showDebug() && console.debug(`${DateTime.now().toISO()} [DEBUG] : ${message}`)
    export const info = async (message: any) => showInfo() && console.info(`${DateTime.now().toISO()} [INFO] : ${message}`)
    export const warn = async (message: any) => showWarn() && console.warn(`${DateTime.now().toISO()} [WARN] : ${message}`)
    export const error = (error: Error | string) => {
        if(!showError()) return;
        const message = typeof error === 'string' ? error : error.message;
        const stack = typeof error === 'string' ? new Error().stack : error.stack;
        console.error(`${DateTime.now().toISO()} [ERROR] : ${message}\r\n Stack trace: ${stack}`);
    }
    
}