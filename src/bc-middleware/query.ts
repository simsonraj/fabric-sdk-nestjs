/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { UtilsConfig } from './utilsconfig';
import { InternalServerErrorException } from '@nestjs/common';
import { AppLogger } from '../logger/logger';

const controller = 'Query';
const logger = new AppLogger();

export async function query(username, methodName, args) {
    logger.log(`${new Date().toLocaleString()}: [${controller}] Start query data.`);
    try {
        const utilsConfig = UtilsConfig.getInstance();
        const contract = await utilsConfig.getContract(username);
        const result = await contract.evaluateTransaction(methodName, args);
        logger.log(`${new Date().toLocaleString()}: [${controller}] Query data successfully.`);
        return result.toString() === '' ? [] : JSON.parse(result.toString());
    } catch (error) {
        logger.error(`${new Date().toLocaleString()}: [${controller}] Failed to query transaction.`, error);
        console.error(`Failed to evaluate transaction: ${error}`);
        throw new InternalServerErrorException(`Failed to evaluate transaction: ${error}`);
    }
}

// main();
