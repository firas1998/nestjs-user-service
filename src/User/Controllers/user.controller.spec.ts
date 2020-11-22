import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import {
    getRepositoryToken,
    TypeOrmModule,
    TypeOrmModuleOptions
} from '@nestjs/typeorm';
import { User } from '../Entities/user.entity';
import { Gender } from '../Enums/gender.enum';
import { UserModule } from '../Modules/user.module';
import { Constants } from '../../constants';
import { INestApplication } from '@nestjs/common';
import { EventModule } from '../../Events/Modules/event.module';

describe('UserContoller', () => {
    let app: INestApplication;
    let userRepo: Repository<User>;
    const options: TypeOrmModuleOptions = Constants.TESTING_DATABASE_DATA as TypeOrmModuleOptions;

    const clientProxyMock = {
        emit: () => true
    };

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [TypeOrmModule.forRoot(options), UserModule, EventModule]
        })
            .overrideProvider(Constants.MICROSERVICE_NAME)
            .useValue(clientProxyMock)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
        userRepo = app.get<Repository<User>>(getRepositoryToken(User));
    });

    afterEach(async (done) => {
        jest.clearAllMocks();
        await userRepo.clear();
        done();
    });

    describe('Create user', () => {
        it('POST /user', () => {
            return request(app.getHttpServer())
                .post('/user/create')
                .set({ user_id: '123-123-123-123' })
                .send({
                    firstName: 'test',
                    lastName: 'test',
                    dateOfBirth: '1999-11-11',
                    gender: Gender.FEMALE,
                    pushNotificationToken: 'test'
                })
                .expect(200);
        });

        it('POST /user fail', () => {
            userRepo.insert({
                uuid: '123-123-123-123',
                firstName: 'test',
                lastName: 'test',
                dateOfBirth: '1999-11-11',
                gender: Gender.FEMALE,
                pushNotificationToken: 'test'
            });

            return request(app.getHttpServer())
                .post('/user/create')
                .set({ user_id: '123-123-123-123' })
                .send({
                    firstName: 'test',
                    lastName: 'test',
                    dateOfBirth: '1999-11-11',
                    gender: Gender.FEMALE,
                    pushNotificationToken: 'test'
                })
                .expect(422);
        });

        it('POST /user validation fail', () => {
            userRepo.insert({
                uuid: '123-123-123-123',
                firstName: 'test',
                lastName: 'test',
                dateOfBirth: '1999-11-11',
                gender: Gender.FEMALE,
                pushNotificationToken: 'test'
            });

            return request(app.getHttpServer())
                .post('/user/create')
                .set({ user_id: '123-123-123-123' })
                .send({
                    lastName: 'test',
                    dateOfBirth: '1999-11-11',
                    gender: Gender.FEMALE,
                    pushNotificationToken: 'test'
                })
                .expect(400);
        });
    });

    describe('get user', () => {
        it('GET /user', () => {
            userRepo.insert({
                id: 1,
                uuid: '123-123-123-123',
                firstName: 'test',
                lastName: 'test',
                dateOfBirth: '1999-11-11',
                gender: Gender.FEMALE,
                pushNotificationToken: 'test'
            });

            return request(app.getHttpServer())
                .get('/user')
                .set({ user_id: '123-123-123-123' })
                .expect(200)
                .expect((res) => {
                    expect(res.body.uuid).toBe('123-123-123-123');
                });
        });

        it('GET /user fail', () => {
            return request(app.getHttpServer())
                .get('/user')
                .set({ user_id: '123-123-123-123' })
                .expect(404);
        });
    });

    describe('Update user', () => {
        it('PATCH /user/update', () => {
            userRepo.insert({
                uuid: '123-123-123-123',
                firstName: 'test',
                lastName: 'test',
                dateOfBirth: '1999-11-11',
                gender: Gender.FEMALE,
                pushNotificationToken: 'test'
            });

            return request(app.getHttpServer())
                .patch('/user/update')
                .set({ user_id: '123-123-123-123' })
                .send({
                    pushNotificationToken: 'test1'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.pushNotificationToken).toBe('test1');
                });
        });

        it('PATCH /user/update fail', () => {
            return request(app.getHttpServer())
                .patch('/user/update')
                .set({ user_id: '123-123-123-123' })
                .send({
                    pushNotificationToken: 'test'
                })
                .expect(404);
        });

        it('PATCH /user/update validation fail', () => {
            return request(app.getHttpServer())
                .patch('/user/update')
                .set({ user_id: '123-123-123-123' })
                .send({})
                .expect(400);
        });
    });

    afterAll(async (done) => {
        await app.close();
        done();
    });
});
