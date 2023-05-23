/* eslint-disable no-console */

class Logger {
    constructor(private readonly name: string) {}
    log(...data: any[]): void {
        console.log(this.name, ...data);
    }
}
const loggers = new Map<string, Logger>();

export function createLogger(name: string) {
    let logger = loggers.get(name);

    if (!logger) {
        logger = new Logger(name);
        loggers.set(name, logger);
    }

    return logger;
}
