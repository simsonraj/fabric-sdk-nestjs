import * as log4js from 'log4js';
import * as hfc from 'fabric-client';
import { FileSystemWallet, Gateway, X509WalletMixin } from 'fabric-network';
import { UtilsConfig } from './utilsconfig';
import { InternalServerErrorException } from '@nestjs/common';
import { AppLogger } from '../logger/logger';
import * as appService from '../app.service';
const controller = 'User';
const Logger = new AppLogger();
const logger = log4js.getLogger('RegisterUsers');
hfc.setLogger(logger);
export async function registerUser(userName) {

    Logger.log(`${new Date().toLocaleString()}: [${controller}] Start registering user.`);
    try {
        const utilsConfig = UtilsConfig.getInstance();
        const client = await utilsConfig.getClient();
        // Create a new file system based wallet for managing identities.
        const walletPath = hfc.getConfigSetting('client').credentialStore.path;
        const wallet = new FileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (userExists) {
            Logger.log('An identity for the user ' + userName + ' already exists in the wallet');
            throw new InternalServerErrorException(`An identity for the user ${userName} already exists in the wallet`);
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            Logger.log('An identity for the admin user "admin" does not exist in the wallet');
            Logger.log('Run the enrollAdmin.ts application before retrying');
            throw new InternalServerErrorException(`An identity for the admin user "admin" does not exist in the wallet`);
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(client, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: userName, role: 'client' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: userName, enrollmentSecret: secret });
        console.log(client.getMspid());
        const userIdentity = X509WalletMixin.createIdentity(client.getMspid(), enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(userName, userIdentity);
        Logger.log(`${new Date().toLocaleString()}: [${controller}] Successfully registered user.`);
    } catch (error) {
        Logger.error(`${new Date().toLocaleString()}: [${controller}] Failed to register user.`, error);
        console.error(`Failed to register user ${userName}: ${error}`);
        // throw new InternalServerErrorException(error);
        throw appService.buildAPIResponse(500, 'Failed to Register User', {}, error);

    }
}
