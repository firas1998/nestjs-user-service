import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../../Logger/Services/logger.service';
import { InsertResult, Repository } from 'typeorm';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../Entities/user.entity';
import { Gender } from '../Enums/gender.enum';
import { UserAlreadyExistsException } from '../../Exceptions/user-already-exists.exception';
import { UserNotFoundException } from '../../Exceptions/user-not-found.exception';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../constants';

describe('UserService', () => {
    let userService: UserService;
    let userRepo: Repository<User>;
    let clientProxy: ClientProxy;

    const userRepoMock = {
        insert: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn()
    };

    const clientProxyMock = {
        emit: jest.fn()
    };

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                LoggerService,
                {
                    provide: getRepositoryToken(User),
                    useValue: userRepoMock
                },
                {
                    provide: Constants.MICROSERVICE_NAME,
                    useValue: clientProxyMock
                }
            ]
        }).compile();

        userService = app.get<UserService>(UserService);
        userRepo = app.get<Repository<User>>(getRepositoryToken(User));
        clientProxy = app.get<ClientProxy>(Constants.MICROSERVICE_NAME);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create user', () => {
        it('should return true', async () => {
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
            jest.spyOn(clientProxy, 'emit');
            jest.spyOn(userRepo, 'insert').mockResolvedValue({
                identifiers: [],
                generatedMaps: [],
                raw: 'workingg'
            } as InsertResult);

            const user = await userService.createUser({
                uuid: '123123213-123123',
                firstName: 'test',
                lastName: 'test',
                dateOfBirth: new Date(),
                gender: Gender.FEMALE,
                pushNotificationToken: 'test'
            });

            expect(user).toBeTruthy();
        });

        it('should throw user already exists exception', async () => {
            jest.spyOn(userRepo, 'findOne').mockResolvedValue({
                uuid: '123123213-123123',
                firstName: 'test',
                lastName: 'test',
                dateOfBirth: new Date(),
                gender: Gender.FEMALE,
                pushNotificationToken: 'test'
            } as User);

            try {
                await userService.createUser({
                    uuid: '123123213-123123',
                    firstName: 'test',
                    lastName: 'test',
                    dateOfBirth: new Date(),
                    gender: Gender.FEMALE,
                    pushNotificationToken: 'test'
                });
            } catch (error) {
                expect(error).toMatchObject(new UserAlreadyExistsException());
            }
        });
    });

    describe('get user by uuid', () => {
        it('should return user', async () => {
            jest.spyOn(userRepo, 'findOne').mockResolvedValue({
                uuid: '123123213-123123',
                firstName: 'test',
                lastName: 'test',
                dateOfBirth: new Date(),
                gender: Gender.FEMALE,
                pushNotificationToken: 'test'
            } as User);

            const user = await userService.getUser('123213123-123123');

            expect(user).toBeTruthy();
        });

        it('should throw UserNotFoundException', async () => {
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

            try {
                await userService.getUser('123213123-123123');
            } catch (error) {
                expect(error).toMatchObject(new UserNotFoundException());
            }
        });
    });

    describe('update user', () => {
        it('should return updated user', async () => {
            jest.spyOn(userRepo, 'findOne').mockResolvedValue({
                uuid: '123123213-123123',
                firstName: 'test',
                lastName: 'test',
                dateOfBirth: new Date(),
                gender: Gender.FEMALE,
                pushNotificationToken: 'test'
            } as User);
            jest.spyOn(userRepo, 'save').mockResolvedValue({
                uuid: '123123213-123123',
                firstName: 'test',
                lastName: 'test',
                dateOfBirth: new Date(),
                gender: Gender.FEMALE,
                pushNotificationToken: 'test111'
            } as User);

            const user = await userService.updateUser('123123213-123123', {
                uuid: '123123213-123123',
                firstName: 'test',
                lastName: 'test',
                dateOfBirth: new Date(),
                gender: Gender.FEMALE,
                pushNotificationToken: 'test111'
            });

            expect(user).toBeTruthy();
        });

        it('should throw user not found exception', async () => {
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

            try {
                await userService.createUser({
                    uuid: '123123213-123123',
                    firstName: 'test',
                    lastName: 'test',
                    dateOfBirth: new Date(),
                    gender: Gender.FEMALE,
                    pushNotificationToken: 'test'
                });
            } catch (error) {
                expect(error).toMatchObject(new UserNotFoundException());
            }
        });
    });
});
