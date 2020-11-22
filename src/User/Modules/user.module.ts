import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../../Logger/Modules/logger.module';
import { UserController } from '../Controllers/user.controller';
import { User } from '../Entities/user.entity';
import { UserService } from '../Services/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), LoggerModule],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
