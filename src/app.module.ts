import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './Events/Modules/event.module';
import { GuardModule } from './Authentication/Modules/authentication.module';
import { LoggerModule } from './Logger/Modules/logger.module';
import { UserUuidMiddleware } from './Middleware/user-uuid.middleware';
import { UserModule } from './User/Modules/user.module';
import { Constants } from './constants';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(),
        EventModule,
        GuardModule,
        LoggerModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UserUuidMiddleware).forRoutes('/');
    }
}

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(
            Constants.TESTING_DATABASE_DATA as TypeOrmModuleOptions
        ),
        ClientsModule.register([
            {
                name: Constants.MICROSERVICE_NAME,
                transport: Transport.REDIS,
                options: {
                    url: `${process.env.TEST_DATABASE_REDIS}://${process.env.TEST_REDIS_HOST}:${process.env.TEST_REDIS_PORT}`
                }
            }
        ]),
        GuardModule,
        LoggerModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class TestingAppModule implements NestModule {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UserUuidMiddleware).forRoutes('/');
    }
}
