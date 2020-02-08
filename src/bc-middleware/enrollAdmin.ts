/*
 * SPDX-License-Identifier: Apache-2.0
 */

import * as log4js from 'log4js';
import * as hfc from 'fabric-client';
import { FileSystemWallet, X509WalletMixin } from 'fabric-network';
import { InternalServerErrorException } from '@nestjs/common';
import { UtilsConfig } from './utilsconfig';
import { AppLogger } from '../logger/logger';

const controller = 'EnrollAdmin';
const logger = log4js.getLogger('enrollAdmin');
const Logger = new AppLogger();

export async function enrollAdmin() {
    Logger.log(`${new Date().toLocaleString()}: [${controller}] Start enroll admin.`);
    try {
        const utilsConfig = UtilsConfig.getInstance();
        const client = await utilsConfig.getClient();
        const ca = await client.getCertificateAuthority();
        // Create a new file system based wallet for managing identities.
        const walletPath = hfc.getConfigSetting('client').credentialStore.path;
        var admins = hfc.getConfigSetting('admins');
        const wallet = new FileSystemWallet(walletPath);
        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (adminExists) {
            Logger.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }
        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: admins[0].username, enrollmentSecret: admins[0].secret });
        console.log(client.getMspid());
        const identity = X509WalletMixin.createIdentity(client.getMspid(), enrollment.certificate, enrollment.key.toBytes());
        await wallet.import('admin', identity);
        Logger.log(`${new Date().toLocaleString()}: [${controller}] Successfully enrolled admin user "admin" and imported it into the wallet.`);
        Logger.log('Successfully enrolled admin user "admin" and imported it into the wallet');

    } catch (error) {
        Logger.error(`${new Date().toLocaleString()}: [${controller}] Failed to enroll admin user admin.`, error);
        console.error(`Failed to enroll admin user "admin": ${error}`);
        throw new InternalServerErrorException(`Failed to enroll admin user "admin": ${error}`);
    }
}

// enrollAdmin();
