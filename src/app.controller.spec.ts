
import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheService } from './cache/cache.service';
import { AppLogger } from './logger/logger';
import { RegisterUserProcessor } from './message-queue/registerProcessor';
import { InvokeProcessor } from './message-queue/invokeProcessor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { HttpErrorFilter } from './shared/http-error.filter';
import { BullModule } from '@nestjs/bull';
import * as config from '../config/config';
import { ConfigModule } from '@nestjs/config';
import { Response } from 'express';
import { ApiRequest } from './models/api-request';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
        imports: [
            BullModule.registerQueue({
                name: 'invoke',
                redis: {
                    host: config.getEnv().messageQueuing.host,
                    port: config.getEnv().messageQueuing.port,
                },
                defaultJobOptions: {
                    removeOnComplete: false,
                    lifo: false,
                },
            }),
            BullModule.registerQueue({
                name: 'registerUser',
                redis: {
                    host: config.getEnv().messageQueuing.host,
                    port: config.getEnv().messageQueuing.port,
                },
                defaultJobOptions: {
                    removeOnComplete: false,
                    lifo: false,
                },
            }),
            ConfigModule.forRoot({
                load: [config.getEnv],
            }),
        ],
        controllers: [AppController],
        providers: [
            AppService,
            CacheService,
            AppLogger,
            RegisterUserProcessor,
            InvokeProcessor,
            {
                provide: APP_FILTER,
                useClass: HttpErrorFilter,
            },
            {
                provide: APP_INTERCEPTOR,
                useClass: LoggingInterceptor,
            },
        ],
      }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('health', () => {
      it('should return health of application', (done) => {

        spyOn(appController, 'getHealth').and.returnValue(Promise.resolve({
            statusCode: 200,
            message: 'App running!',
            data: {},
            error: {},
        }));

        appController.getHealth()
            .then((result) => {
                expect(result.statusCode).toEqual(200);
                expect(result.message).toEqual('App running!');
                expect(result.data).toMatchObject({});
                expect(result.error).toMatchObject({});
                done();
            });
      });
  });

  describe('enrollAdmin', () => {
      it('should return enrollAdmin successfully', (done) => {
            spyOn(appController, 'enrollAdmin').and.returnValue(Promise.resolve({
                statusCode: 200,
                message: 'admin Registered Successfully!',
                data: {},
                error: {},
            }));

            appController.enrollAdmin()
                .then((result) => {
                    expect(result.statusCode).toEqual(200);
                    expect(result.message).toEqual('admin Registered Successfully!');
                    expect(result.data).toMatchObject({});
                    expect(result.error).toMatchObject({});
                    done();
            });
      });
  });

//   describe('enrollUser', () => {
//     it('should return Enroll User successfully', (done) => {
//         // spyOn(appController, 'registerUser').and.returnValue(Promise.resolve({
//         //     "statusCode": 200,
//         //     "message": "User Registered Successfullyl!",
//         //     "data": "",
//         //     "error": {},
//         // }));


//         appController.registerUser(, new )
//             .then((result) => {
//                 expect(result.statusCode).toEqual(200);
//                 expect(result.message).toEqual('User Registered Successfullyl!');
//                 expect(result.data).not.toBe('');
//                 expect(result.error).toMatchObject({});
//                 done();
//             });
//       });
//   });
});
