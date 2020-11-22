import { Module } from '@nestjs/common';
import { LoggerService } from '../Services/logger.service';

@Module({
    providers: [LoggerService],
    exports: [LoggerService]
})
export class LoggerModule {}
