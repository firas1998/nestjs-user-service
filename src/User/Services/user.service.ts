import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAlreadyExistsException } from '../../Exceptions/user-already-exists.exception';
import { UserNotFoundException } from '../../Exceptions/user-not-found.exception';
import { LoggerService } from '../../Logger/Services/logger.service';
import { Repository } from 'typeorm';
import { UserDTO } from '../DTOs/user.dto';
import { User } from '../Entities/user.entity';
import { Constants } from '../../constants';
import { ClientProxy } from '@nestjs/microservices';
import { UserCreatedEvent } from '../../Events/user-created.event';
import { UserUpdatedEvent } from '../../Events/user-updated.event';

@Injectable()
export class UserService {
    public constructor(
        private readonly loggerService: LoggerService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(Constants.MICROSERVICE_NAME)
        private readonly client: ClientProxy
    ) {
        loggerService.setContext(this.constructor.name);
    }

    /**
     *
     *
     * @param {string} uuid
     * @returns {Promise<User>}
     * @memberof UserService
     */
    public async getUser(uuid: string): Promise<User> {
        const user = await this.getUserByUuid(uuid);

        if (!user) {
            throw new UserNotFoundException();
        }

        return user;
    }

    /**
     *
     *
     * @param {UserDTO} user
     * @returns {Promise<User>}
     * @memberof UserService
     */
    public async createUser(user: UserDTO): Promise<boolean> {
        const oldUser = await this.getUserByUuid(user.uuid);
        if (oldUser) {
            throw new UserAlreadyExistsException();
        }

        const newUser = await this.userRepository.insert(user);

        if (newUser) {
            const userUpdatedEvent: UserCreatedEvent = {
                uuid: user.uuid,
                firstName: user.firstName,
                pushNotificationToken: user.pushNotificationToken
            };

            this.client.emit<any>(
                Constants.EVENTS.USER_CREATED_EVENT,
                userUpdatedEvent
            );

            return true;
        }

        return false;
    }

    /**
     *
     *
     * @param {string} uuid
     * @param {UserDTO} userData
     * @returns {Promise<User>}
     * @memberof UserService
     */
    public async updateUser(uuid: string, userData: UserDTO): Promise<User> {
        const user = await this.getUserByUuid(uuid);

        if (!user) {
            throw new UserNotFoundException();
        }

        if (userData.pushNotificationToken) {
            user.pushNotificationToken = userData.pushNotificationToken;
        }

        const updatedUser = await this.userRepository.save(user);

        if (updatedUser) {
            const userUpdatedEvent: UserUpdatedEvent = {
                uuid: user.uuid,
                pushNotificationToken: user.pushNotificationToken
            };

            this.client.emit<any>(
                Constants.EVENTS.USER_UPDATED_EVENT,
                userUpdatedEvent
            );
        }

        return updatedUser;
    }

    /**
     *
     *
     * @private
     * @param {string} uuid
     * @returns {Promise<User>}
     * @memberof UserService
     */
    private async getUserByUuid(uuid: string): Promise<User> {
        return this.userRepository.findOne({ uuid: uuid });
    }
}
