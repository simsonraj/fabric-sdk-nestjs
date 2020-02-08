import * as log4js from 'log4js';
import * as hfc from 'fabric-client';
import * as config from '../../config/config';
const logger = log4js.getLogger('RegisterUsers');
import { FileSystemWallet, Gateway } from 'fabric-network';
import { InternalServerErrorException } from '@nestjs/common';
hfc.setLogger(logger);

export class UtilsConfig {
    private static instance: UtilsConfig;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): UtilsConfig {
        if (!UtilsConfig.instance) {
            UtilsConfig.instance = new UtilsConfig();
        }

        return UtilsConfig.instance;
    }

    public async getClient() {
        console.log('============ START getClient for org');
        // Load the connection profiles. First load the network settings, then load the client specific settings
        const client = hfc.loadFromConfig(config.getNetworkPath());
        client.loadFromConfig(config.getEnvPath());
        // Create the state store and the crypto store
        await client.initCredentialStores();
        // Try and obtain the user from persistence if the user has previously been
        // registered and enrolled
        console.log('============ END getClient for org');
        return client;
    }

    public async getContract(username) {
        const client = await this.getClient();
        // Create a new file system based wallet for managing identities.
        const walletPath = hfc.getConfigSetting('client').credentialStore.path;
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        username = username ? username : 'admin';
        const identity = await wallet.exists(username);
        if (!identity) {
            console.log('Run the registerUser.ts application before retrying');
            throw new Error('An identity for the user ' + username + ' does not exist in the wallet');
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(client, { wallet, identity: username, discovery: { enabled: false, asLocalhost: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(client.getChannel().getName());
        const contractName = hfc.getConfigSetting('contractName');
        const contract = network.getContract(contractName);
        return contract;
    }

    public async getByTxID(txID) {

        try {
            const client = await this.getClient();
            const channel = client.getChannel();
            let username;
            // Create a new file system based wallet for managing identities.
            const walletPath = hfc.getConfigSetting('client').credentialStore.path;
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            username = username ? username : 'admin';
            const identity = await wallet.exists(username);
            if (!identity) {
                console.log('Run the registerUser application before retrying');
                throw new Error('An identity for the user ' + username + ' does not exist in the wallet');
            }
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(client, { wallet, identity: username, discovery: { enabled: false, asLocalhost: false } });
            const resp = await channel.queryTransaction(txID);
            const rees = await channel.queryBlockByTxID(txID);
            console.log(resp.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[0].value);
            return resp.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[0].value;
        } catch (error) {
            throw new InternalServerErrorException(`Failed to query by transaction ID": ${error}`);
        }
    }

}
