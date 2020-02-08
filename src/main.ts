import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as config from '../config/config';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(helmet());
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
        }),
    );

    app.enableCors();

    // app.use(function (err, req, res, next) {
    //     if (err.code !== 'EBADCSRFTOKEN') return next(err)

    //     // handle CSRF token errors here
    //     res.status(403)
    //     res.send('form tampered with')
    // });

    const options = new DocumentBuilder()
        .setTitle(config.getEnv().swagger.title)
        .setDescription(config.getEnv().swagger.description)
        .setVersion(config.getEnv().swagger.version)
        .addTag(config.getEnv().swagger.tag)
        .addBasicAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(config.getEnv().swagger.url, app, document);

    await app.listen(config.getEnv().port);
}
bootstrap();
