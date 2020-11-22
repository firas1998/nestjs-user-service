import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class LoggerService extends Logger {
    private readonly fileType = 'log';
    private readonly errorFile = 'error';
    private readonly infoFile = 'info';
    private readonly path = 'src/Logger/Logs/';

    private fullPathInfoFile: string;
    private fullPathErrorFile: string;

    /**
     *Creates an instance of LoggerService.
     * @param {string} [context]
     * @memberof LoggerService
     */
    public constructor(context?: string) {
        super(context);
        this.context = context;
        this.fullPathInfoFile = `${this.path}/${
            this.infoFile
        }-${this.prepareDate()}.${this.fileType}`;
        this.fullPathErrorFile = `${this.path}/${
            this.errorFile
        }-${this.prepareDate()}.${this.fileType}`;
    }

    /**
     *
     *
     * @param {string} message
     * @param {string} [context]
     * @returns {*}
     * @memberof LoggerService
     */
    public log(message: string, context?: string): void {
        fs.appendFile(
            this.fullPathInfoFile,
            this.prepareMessage(message),
            'utf-8',
            this.onError
        );
        super.log(message, context);
    }

    /**
     *
     *
     * @param {string} message
     * @param {string} [trace]
     * @param {string} [context]
     * @returns {*}
     * @memberof LoggerService
     */
    public error(message: string, trace?: string, context?: string): void {
        fs.appendFile(
            this.fullPathErrorFile,
            this.prepareMessage(message),
            'utf-8',
            this.onError
        );
        super.error(message, trace, context);
    }

    /**
     *
     *
     * @param {string} message
     * @param {string} [context]
     * @returns {*}
     * @memberof LoggerService
     */
    public warn(message: string, context?: string): void {
        fs.appendFile(
            this.fullPathInfoFile,
            this.prepareMessage(message),
            'utf-8',
            this.onError
        );
        super.warn(message, context);
    }

    /**
     *
     *
     * @param {string} message
     * @param {string} [context]
     * @returns {*}
     * @memberof LoggerService
     */
    public debug(message: string, context?: string): void {
        fs.appendFile(
            this.fullPathInfoFile,
            this.prepareMessage(message),
            'utf-8',
            this.onError
        );
        super.debug(message, context);
    }

    /**
     *
     *
     * @private
     * @param {string} message
     * @returns {string}
     * @memberof LoggerService
     */
    private prepareMessage(message: string): string {
        const date = this.prepareDateTime();

        return `\n${date} (${this.context}): ${message}`;
    }

    /**
     *
     *
     * @private
     * @returns {string}
     * @memberof LoggerService
     */
    private prepareDate(): string {
        const date = new Date();
        return date.toISOString().substr(0, 10);
        //return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    }

    /**
     *
     *
     * @private
     * @returns {string}
     * @memberof LoggerService
     */
    private prepareDateTime(): string {
        const date = new Date();
        return date.toISOString();
        //return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

    /**
     *
     *
     * @private
     * @param {*} err
     */
    private onError(err: any): void {
        if (err) {
            throw err;
        }
    }
}
