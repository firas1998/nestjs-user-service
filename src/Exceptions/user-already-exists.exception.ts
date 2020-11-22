import { HttpException, HttpStatus } from '@nestjs/common';
import { Constants } from '../constants';

export class UserAlreadyExistsException extends HttpException {
    constructor() {
        super(
            Constants.EXCEPTIONS.USER_ALREADY_EXISTS,
            HttpStatus.UNPROCESSABLE_ENTITY
        );
    }
}
