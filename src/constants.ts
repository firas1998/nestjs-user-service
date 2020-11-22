export const Constants = {
    MICROSERVICE_NAME: 'user-service',
    EVENTS: {
        USER_CREATED_EVENT: 'USER_CREATED',
        USER_UPDATED_EVENT: 'USER_UPDATED'
    },
    EXCEPTIONS: {
        USER_ALREADY_EXISTS: 'User already exists',
        USER_NOT_FOUND: 'User not found',
        UNAUTHORIZED: 'This is not yours !',
        SERVER: 'Somehting went wrong'
    },
    USER_HEADER: 'user_id',
    TESTING_DATABASE_DATA: {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'testuser',
        password: 'password',
        database: 'user-service-test',
        entities: ['src/**/*.entity.ts'],
        synchronize: true
    }
};
