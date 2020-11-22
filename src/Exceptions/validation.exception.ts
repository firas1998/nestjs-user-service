import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
    constructor(error: string | Record<string, any>) {
        super(error, HttpStatus.BAD_REQUEST);
    }
}
