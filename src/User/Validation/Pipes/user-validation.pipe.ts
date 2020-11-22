import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ObjectSchema } from '@hapi/joi';
import { ValidationException } from '../../../Exceptions/validation.exception';

@Injectable()
export class UserValidationPipe implements PipeTransform {
    constructor(private schema: ObjectSchema) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(value: any, _metadata: ArgumentMetadata) {
        const { error } = this.schema.validate(value);
        if (error) {
            throw new ValidationException(error.message);
        }
        return value;
    }
}
