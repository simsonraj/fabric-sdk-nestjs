/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { UtilsConfig } from './utilsconfig';
import { InternalServerErrorException } from '@nestjs/common';
import { AppLogger } from '../logger/logger';
import * as appService from '../app.service';
const controller = 'Invoke';
const logger = new AppLogger();

export async function invoke(username, method, args) {
    logger.log(`${new Date().toLocaleString()}: [${controller}] Start invoke new data.`);
    try {
        const utilsConfig = UtilsConfig.getInstance();
        const contract = await utilsConfig.getContract(username);

        const result = await contract.submitTransaction(method, args);
        logger.log(`${new Date().toLocaleString()}: [${controller}] Invoke successful.`);
        return result.toString();
        // Disconnect from the gateway.
        // await gateway.disconnect();
    } catch (error) {
        logger.error(`${new Date().toLocaleString()}: [${controller}] Failed to invoke transaction.`, error);
        console.error(`Failed to submit transaction: ${error}`);
        throw appService.buildAPIResponse(500, 'Failed to Register User', {}, error);
    }
}
