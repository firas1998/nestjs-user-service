import { HttpException, HttpStatus } from '@nestjs/common';
import { Constants } from '../constants';

export class UnauthorizedException extends HttpException {
    constructor() {
        super(Constants.EXCEPTIONS.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
}
