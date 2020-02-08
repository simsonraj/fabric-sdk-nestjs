import { Injectable } from '@nestjs/common';
import * as log4js from 'log4js';
import * as hfc from 'fabric-client';
import { ApiResponse } from './models/api-response';
import { ErrorResponse } from './models/error-response';
import * as config from '../config/config';

const logger = log4js.getLogger('Connection');
hfc.setLogger(logger);
hfc.addConfigFile(config.getEnvPath());
@Injectable()
export class AppService {

    getLogger(moduleName) {
        const log = log4js.getLogger(moduleName);
        return log;
    }

    buildAPIResponse(statusCode, message, data, err: Error) {
        return buildAPIResponse(statusCode, message, data, err);
    }
}

export function  buildAPIResponse(statusCode, message, data, err: Error) {
    let errr;
    if (err) {
        const errorMsg = err.message ? err.message : 'Something went wrong. Please contact Admin!';
        statusCode = statusCode ? statusCode : 500;
        errr = new ErrorResponse(statusCode, errorMsg, err.stack);
        return new ApiResponse(statusCode, 'ERROR', {}, errr);
    }
    const resp = new ApiResponse(statusCode, message ? message : 'SUCCESS', data, {});
    return resp;
}
