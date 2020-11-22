import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { MicroserviceOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { AppModule } from './app.module';
import { LoggerService } from './Logger/Services/logger.service';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

const microServiceOptions = {
    transport: Transport.REDIS,
    options: {
        url: `${process.env.DATABASE_REDIS}://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    }
} as MicroserviceOptions;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.connectMicroservice<MicroserviceOptions>(microServiceOptions);
    app.useLogger(app.get(LoggerService));
    app.use(helmet());
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // limit each IP to 100 requests per windowMs
        })
    );
    app.startAllMicroservicesAsync();
    app.listen(8081, () => {
        Logger.log('user service is listening...');
    });
}
bootstrap();
