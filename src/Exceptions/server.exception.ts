import { HttpException, HttpStatus } from '@nestjs/common';
import { Constants } from '../constants';

export class ServerException extends HttpException {
    constructor() {
        super(Constants.EXCEPTIONS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
