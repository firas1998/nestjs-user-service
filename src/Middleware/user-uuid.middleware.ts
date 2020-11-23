import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Constants } from '../constants';
import { AuthenticationService } from '../Authentication/Services/authentication.service';

@Injectable()
export class UserUuidMiddleware implements NestMiddleware {
    public constructor(
        private readonly authenticationService: AuthenticationService
    ) {}

    // eslint-disable-next-line @typescript-eslint/ban-types
    public async use(
        req: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/ban-types
        next: Function
    ): Promise<void> {
        const userId = await this.authenticationService.getUserIdFromRequest(
            req
        );
        req.headers[Constants.USER_HEADER] = userId;
        next();
    }
}
