import { DateTime } from "luxon";
import { LoggingLevelsEnum } from "../enums/logging-level.enum";

export namespace Logger {

    // Determine the logging level from environment variable or default to WARN
    const loggingLevel = process.env.NEXT_PUBLIC_LOGGING_LEVEL 
        ? Number(process.env.NEXT_PUBLIC_LOGGING_LEVEL) 
        : LoggingLevelsEnum.WARN;

    // Helper functions to check if a certain logging level should be shown
    const showDebug = (): boolean => loggingLevel <= LoggingLevelsEnum.DEBUG;
    const showInfo = (): boolean => loggingLevel <= LoggingLevelsEnum.INFO;
    const showWarn = (): boolean => loggingLevel <= LoggingLevelsEnum.WARN;
    const showError = (): boolean => loggingLevel <= LoggingLevelsEnum.ERROR;

    /**
     * Logs a debug message if the logging level is set to DEBUG or lower.
     * @param message - The message to log.
     */
    export const debug = async (message: any) => {
        if (showDebug()) {
            console.debug(`${DateTime.now().toISO()} [DEBUG] : ${message}`);
        }
    }

    /**
     * Logs an info message if the logging level is set to INFO or lower.
     * @param message - The message to log.
     */
    export const info = async (message: any) => {
        if (showInfo()) {
            console.info(`${DateTime.now().toISO()} [INFO] : ${message}`);
        }
    }

    /**
     * Logs a warning message if the logging level is set to WARN or lower.
     * @param message - The message to log.
     */
    export const warn = async (message: any) => {
        if (showWarn()) {
            console.warn(`${DateTime.now().toISO()} [WARN] : ${message}`);
        }
    }

    /**
     * Logs an error message and stack trace if the logging level is set to ERROR or lower.
     * @param error - The error to log, can be an Error object or a string.
     */
    export const error = (error: Error | string) => {
        if (!showError()) return;
        const message = typeof error === 'string' ? error : error.message;
        const stack = typeof error === 'string' ? new Error().stack as string : error.stack as string;
        console.error(`${DateTime.now().toISO()} [ERROR] : ${message}\r\n Stack trace: ${shortenStackTrace(stack)}`);
    }

    /**
     * Shortens the stack trace to the first 10 lines.
     * @param stackTrace - The full stack trace.
     * @returns The shortened stack trace.
     */
    const shortenStackTrace = (stackTrace: string): string => {
        const lines = stackTrace.split('\n');
        return lines.slice(0, 10).join('\n');
    }
}