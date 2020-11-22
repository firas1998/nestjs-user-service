import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from '../Guards/authentication.guard';
import { AuthenticationService } from '../Services/authentication.service';

@Global()
@Module({
    providers: [
        AuthenticationService,
        {
            provide: APP_GUARD,
            useClass: AuthenticationGuard
        }
    ],
    exports: [AuthenticationService]
})
export class GuardModule {}
