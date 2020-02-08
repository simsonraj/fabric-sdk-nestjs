import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
// import { config } from '../config';
import * as path from 'path';
import * as config from '../../config/config';

export class AppLogger implements LoggerService {
    private info: winston.Logger;
    private err: winston.Logger;
    private http: winston.Logger;

    constructor(label?: string) {
        this.initializeLogger(label);
    }

    initializeLogger(label?: string) {
        this.info = winston.createLogger({
            level: '1',
            format: winston.format.simple(),
            transports: [
                // new winston.transports.File({ dirname: config.getEnv().logs.path, filename: 'error.log', level: 'error' }),
                new winston.transports.File({ dirname: config.getEnv().logs.path, filename: 'info.log', level: 'info' }),
                // new winston.transports.File({ dirname: config.getEnv().logs.path, filename: 'api.log', level: 'http' }),
            ],
        });

        this.err = winston.createLogger({
            level: '1',
            format: winston.format.simple(),
            transports: [
                new winston.transports.File({ dirname: config.getEnv().logs.path, filename: 'error.log', level: 'error'}),
            ],
        });

        this.http = winston.createLogger({
            level: '1',
            format: winston.format.simple(),
            transports: [
                new winston.transports.File({ dirname: config.getEnv().logs.path, filename: 'api.log', level: 'http'}),
            ],
        });

        if ( process.env.NODE_ENV !== 'production' ) {
            this.info.add(
                new winston.transports.Console({
                    format: winston.format.simple(),
                }),
            );
        }
    }
    error( message: string, trace: string ) {
        // this.info.log('error', message);
        this.err.error(message, trace);
    }

    warn( message: string ) {
        this.info.log('warn', message);
    }

    log( message: string ) {
        this.info.log('info', message);
    }

    api(message: string) {
        this.http.log('http', message);
    }
}
