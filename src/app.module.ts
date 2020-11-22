import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './Events/Modules/event.module';
import { GuardModule } from './Authentication/Modules/authentication.module';
import { LoggerModule } from './Logger/Modules/logger.module';
import { UserUuidMiddleware } from './Middleware/user-uuid.middleware';
import { UserModule } from './User/Modules/user.module';

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
