import {
    Injectable,
    CanActivate,
    ExecutionContext,
    Inject
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { AuthenticationService } from '../Services/authentication.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    public constructor(
        @Inject('AuthenticationService')
        private readonly authenticationService: AuthenticationService
    ) {}

    /**
     *
     *
     * @param {ExecutionContext} context
     * @returns {(boolean | Promise<boolean> | Observable<boolean>)}
     * @memberof AuthGuard
     */
    public canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        return this.validateRequest(request);
    }

    /**
     *
     *
     * @private
     * @param {Request} request
     * @returns {boolean}
     * @memberof AuthGuard
     */
    private async validateRequest(request: Request): Promise<boolean> {
        return this.authenticationService.verifyToken(request);
    }
}
