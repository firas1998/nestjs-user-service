import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../Entities/user.entity';
import { Gender } from '../Enums/gender.enum';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { AuthenticationService } from '../../Authentication/Services/authentication.service';
import { v4 } from 'uuid';

describe('UserContoller', () => {
    let app: INestApplication;
    let userRepo: Repository<User>;
    let authService: AuthenticationService;
    let idToken: string;
    const uuid = v4();

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
        userRepo = app.get<Repository<User>>(getRepositoryToken(User));
        authService = app.get<AuthenticationService>(AuthenticationService);
        idToken =
            'Bearer ' + (await authService.generateIdTokenForTesting(uuid));
    });

    afterEach(async (done) => {
        jest.clearAllMocks();
        await userRepo.query('DELETE FROM users WHERE 1=1');
        done();
    });

    describe('Create user', () => {
        it('POST /user', () => {
            return request(app.getHttpServer())
                .post('/user/create')
                .set({ Authorization: idToken })
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
                uuid: uuid,
                firstName: 'test',
                lastName: 'test',
                dateOfBirth: '1999-11-11',
                gender: Gender.FEMALE,
                pushNotificationToken: 'test'
            });

            return request(app.getHttpServer())
                .post('/user/create')
                .set({ Authorization: idToken })
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
                uuid: uuid,
                firstName: 'test',
                lastName: 'test',
                dateOfBirth: '1999-11-11',
                gender: Gender.FEMALE,
                pushNotificationToken: 'test'
            });

            return request(app.getHttpServer())
                .post('/user/create')
                .set({ Authorization: idToken })
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
                uuid: uuid,
                firstName: 'test',
                lastName: 'test',
                dateOfBirth: '1999-11-11',
                gender: Gender.FEMALE,
                pushNotificationToken: 'test'
            });

            return request(app.getHttpServer())
                .get('/user')
                .set({ Authorization: idToken })
                .expect(200)
                .expect((res) => {
                    expect(res.body.uuid).toBe(uuid);
                });
        });

        it('GET /user fail', () => {
            return request(app.getHttpServer())
                .get('/user')
                .set({ Authorization: idToken })
                .expect(404);
        });
    });

    describe('Update user', () => {
        it('PATCH /user/update', () => {
            userRepo.insert({
                uuid: uuid,
                firstName: 'test',
                lastName: 'test',
                dateOfBirth: '1999-11-11',
                gender: Gender.FEMALE,
                pushNotificationToken: 'test'
            });

            return request(app.getHttpServer())
                .patch('/user/update')
                .set({ Authorization: idToken })
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
                .set({ Authorization: idToken })
                .send({
                    pushNotificationToken: 'test'
                })
                .expect(404);
        });

        it('PATCH /user/update validation fail', () => {
            return request(app.getHttpServer())
                .patch('/user/update')
                .set({ Authorization: idToken })
                .send({})
                .expect(400);
        });
    });

    afterAll(async (done) => {
        await app.close();
        done();
    });
});
