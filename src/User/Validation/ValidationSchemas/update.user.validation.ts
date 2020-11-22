import * as joi from '@hapi/joi';

export const UpdateUserValidationSchema = joi.object({
    uuid: joi.string().optional(),
    pushNotificationToken: joi.string().required()
});
