import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { HttpErrorFilter } from './shared/http-error.filter';
import { AppLogger } from './logger/logger';
import { ConfigModule } from '@nestjs/config';
import * as config from '../config/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config.getEnv],
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        AppLogger,
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule {}
