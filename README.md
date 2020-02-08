# fabric-sdk-nestjs

An elegant opensource boilerplate framework for Hyperledger Fabric NODE Client. The Client is written in typescript on top of Nest.js giving lots of plugin functionalities. Meticulously crafted for Hyperledger Fabric middleware developers, after going through the pains of writing the client for multiple Fabric project for around 2 years. 

Read the features list below.
Please feel free to enhance or let me know the features that could be added.

## Features of the Client SDK
The Client SDK is written with Typescript offered by Nest.js which makes it easy to plugin lots of predefined functionalites.
Like the ones mentioned Below.
For more details about [Nest.js](https://nestjs.com/)
- Boiler Plate which lets through the requests directly to chaincode, without ever having to make any changes in Client SDK
- Abstration of the Fabric-client logics from the APIs for better code readability. Hiding complicated Fabric codes from the user.
- Standardized Request, Response & Error Formats (Based on the Cloud SDK implemtations like oracle Blockchain APIs , easy to plugin to any app just with API.)
- Basic Authentication implemented
- Logger Enabled
- Changes needed only on configuration files
- Swagger Enabled
- Basic e2e test files included with jest framework
- Linted
- Basic Vulnerabilities fixes and security using helmet
- Config Folders for multiple environments (DEV || LOCAL || PROD)
- Message queue (For MVCC error fix, with Redis Queue) & Caching implemented (With Redis & Bull), but stripped out for simplicity. (Please send a request if you need it)

## How to setup the Boiler plate with Hyperledger Fabric basic-network

Check out the Fabric-samples from the hyperledger repository and checkout appropritate Tags & then ./start.sh to start the Basic Network which will create the crypto-config folder

###### Copy the certificates

Copy the folder contents from <fabric-samples/basic-network/crypto-config> to the SDK path "(/artifacts/crypto)"

###### Change the [config.json](/config/local/config.json) values & [network.yaml](/config/local/network.yaml)

Under the config folder , we can find three folders dev, local and prod.
Please choose the folder based on your environment
We are sticking to local for the setup tutorial.

__1. Carefully Change the JSON fields as per the needs__

```javascript
{
   "name": "basic",
   "x-type": "hlfv1",
   "description": "Description for the network",
   "version": "1.0",
   "host": "localhost",
   "port": "3000",
   "contractName":"chaincodename", // CHange to the change code name as per installed chaincode
   "access":{
      "username":"admin",
      "password":"adminpw"
   }, // The username & password for the basic authentication to unlock APIs with swagger/postman
   "client": {
      "organization": "Org1MSP",
      "credentialStore": {
        "path": "/Users/hlfdev/bc_files/fabric-client", //folder to store the credential certifcates
        "cryptoStore": {
            "path": "/Users/user/hlfdev/fabric-client"
         }
      }
   },
   "admins": [ // user name & pwd for the ca admin 
      {
        "username": "admin",
        "secret": "adminpw"
      }
   ],
   "logs": { 
        "path": "/Users/hlfdev/bc_files/logs"
   },
    "swagger":{
        "title": "API",
        "description": "The API endpoints for Chaincode",
        "version": "1.0",
        "tag": "API endpoints",
        "url": "api-docs"
    }
}
```

__2. Change the `<sk_file_name>` to the proper admin certificate of the organization under network.yaml__

```yaml
 adminPrivateKey:
      path: artifacts/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/<sk_file_name>
```      


###### Setup NODE_ENV

The client chooses the config folder based on the NODE_ENV variable set on the running host

`
export NODE_ENV="LOCAL"
`
The possible values for the env variable is `LOCAL`,`DEV`,`PROD` all case sensitive.

###### Running the App

The Client requires Node 8.9 - 8.xx version as per the Hyperledger requirement

- Set the node version to 8.x using NVM if needed
- `npm install`
- `npm run start` for local
- `npm run build` for prod & run `node dist/src/main.js`
- Use pm2 process management for production version.

go to http://localhost:3000/api-docs on your browser to access the swagger documentation

- __After running the app, the first step is to run the enrollAdmin API to further use other URLS__
- Unlock the APIs in the swagger with Authorize button on the top right corner
 and enter 
 __
 username : admin
 password : adminpw
__
- Run enrollAdmin either from Swagger or run the curl command below

```
curl -X GET "http://localhost:3000/enrollAdmin" -H "accept: */*" -H "Authorization: Basic YWRtaW46YWRtaW5wdw=="
```

## Standard Request Response & Error format

###### Request Format

Note : the method name in the request corresponds to the chaincode Method Name:

- __Register User API:__
URL: http://localhost:3000/registerUser

    ```javascript
    {
        "method": "registerUser", 
        "Args":{
            "userName": "00000"
        }
    }
    ```


- __Invoke API__
URL: http://localhost:3000/invoke

    ```javascript
    {
        "method": "putData", 
        "Args":{
            "id": "0"
            "value": "ABC"
        }
    }
    ```

- __Query API__
URL: http://localhost:3000/query

    ```javascript
    {
        "method": "getData", 
        "Args":{
            "id": "0"
        }
    }
    ```

- __Sample Response__

    ```javascript
    {
        "statusCode": 200,
        "message": "Invoke Successful!", "data":
        "61a9fc1728617da8bcc8a0449fe9ffebc5e25c912bafcf36b0bc100b6cffea8b", "error": {}
    }
    ```


- __Sample Error__

    ```javascript
    {
        "code": 500,
        "timestamp": "2020-1-28",
        "path": "/invoke?=",
        "method": "POST",
        "message": "No valid responses from any peers. 1 peer error responses:\n
        peer=peer1, status=500, message=The key does not exist. Please check." 
    }
    ```
