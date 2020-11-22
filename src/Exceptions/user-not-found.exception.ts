import { HttpException, HttpStatus } from '@nestjs/common';
import { Constants } from '../constants';

export class UserNotFoundException extends HttpException {
    constructor() {
        super(Constants.EXCEPTIONS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
}
