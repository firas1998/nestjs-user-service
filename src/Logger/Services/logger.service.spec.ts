import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';

describe('UserService', () => {
    let loggerService: LoggerService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [LoggerService]
        }).compile();

        loggerService = app.get<LoggerService>(LoggerService);
    });

    describe('Test log', () => {
        it('Test log', () => {
            loggerService.debug('dasdasd');
        });
    });
});
