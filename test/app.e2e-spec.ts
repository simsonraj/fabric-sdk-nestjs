import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { RolesGuard } from '../src/gaurds/roles.guard';
import * as config from '../config/config';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    // Change every testing
    const accountNumber = '11';
    const transacID = '00004';

    // Change if desired
    const fromAccount = '6';
    const toAccount = '1';
    const txnID = '5db3c33ce1cb4536a3a0c6e03a97a616bd4d1bf5b4a219c3ac2eb1a2c4227121';

    beforeEach(async() => {
        const module = await Test.createTestingModule({
        imports: [AppModule],
        })
        .overrideGuard(RolesGuard)
        .useValue(config.getEnv().access)
        .compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('/GET health', () => {
        return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect({
            statusCode: 200,
            message: 'App running!',
            data: {},
            error: {},
        });
    });

    it('/GET enrollAdmin', () => {
        return request(app.getHttpServer())
        .get('/enrollAdmin')
        .expect(200)
        .expect({
            statusCode: 200,
            message: 'admin Registered Successfully!',
            data: {},
            error: {},
        });
    });

    it('/POST registerUser', () => {
        return request(app.getHttpServer())
        .post('/registerUser')
        .send({
            method: 'registerUser',
            args: {
                accountNo: accountNumber,
            },
        })
        .expect(201);
    });

    it('/POST invoke issue coins', () => {
        return request(app.getHttpServer())
        .post('/invoke')
        .send({
            method: 'issueCoins',
            args: {
                accountNo: accountNumber,
                balance: '1000',
            },
        })
        .expect(201);
    });

    it('/POST invoke transaction from user to user', () => {
        return request(app.getHttpServer())
        .post('/invoke')
        .send({
            method: 'transact',
            args: {
                from: fromAccount,
                to: toAccount,
                amount: '1000',
            },
        })
        .expect(201);
    });

    it('/POST invoke store transaction outside the wallet', () => {
        return request(app.getHttpServer())
        .post('/invoke')
        .send({
            method: 'storeTransactions',
            args: {
                
            },
        })
        .expect(201);
    });

    it('/POST query by ID', () => {
        return request(app.getHttpServer())
        .post('/query')
        .send({
            method: 'queryByID',
            args: '1',
        })
        .expect(201);
    });

    it('/POST query by Range', () => {
        return request(app.getHttpServer())
        .post('/query')
        .send({
            method: 'queryByRange',
            args: ['1', '3'],
        })
        .expect(201);
    });

    it('/POST query get History for ID', () => {
        return request(app.getHttpServer())
        .post('/query')
        .send({
            method: 'getHistoryForID',
            args: '6',
        })
        .expect(201);
    });

    it('/POST queryByTxnId', () => {
        return request(app.getHttpServer())
        .post('/queryByTxnId')
        .send({
            method: 'getHistoryForID',
            args: {
                txID: txnID,
            },
        })
        .expect(201);
    });
});
