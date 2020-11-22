import { Gender } from '../Enums/gender.enum';

export interface UserDTO {
    uuid?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    gender?: Gender;
    pushNotificationToken?: string;
}
