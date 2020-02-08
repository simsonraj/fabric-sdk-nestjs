import * as dev from './dev/config.json';
import * as local from './local/config.json';
import * as prod from './prod/config.json';

export function getEnv() {
    if (process.env.NODE_ENV === 'DEV') {
        return dev;
    }

    if (process.env.NODE_ENV === 'PROD') {
        return prod;
    }

    if (process.env.NODE_ENV === 'LOCAL') {
        return local;
    }
}

export function getEnvPath() {
    return './config/' + process.env.NODE_ENV.toLowerCase() + '/config.json';
}

export function getNetworkPath() {
    return './config/' + process.env.NODE_ENV.toLowerCase() + '/network.yaml';
}
