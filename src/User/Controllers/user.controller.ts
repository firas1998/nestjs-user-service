import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Patch,
    Post,
    Req,
    Res,
    UseFilters,
    UsePipes
} from '@nestjs/common';
import { Constants } from '../../constants';
import { LoggerService } from '../../Logger/Services/logger.service';
import { Response, Request } from 'express';
import { UserService } from '../Services/user.service';
import { UserDTO } from '../DTOs/user.dto';
import { HttpExceptionFilter } from '../../Exceptions/Filters/http.exception.filter';
import { UserValidationPipe } from '../Validation/Pipes/user-validation.pipe';
import { CreateUserValidationSchema } from '../Validation/ValidationSchemas/create-user.validation-schema';
import { UpdateUserValidationSchema } from '../Validation/ValidationSchemas/update.user.validation';

@UseFilters(HttpExceptionFilter)
@Controller('/user')
export class UserController {
    public constructor(
        private readonly loggerService: LoggerService,
        private readonly userService: UserService
    ) {
        this.loggerService.setContext(this.constructor.name);
    }

    @Get('/')
    public async getUser(
        @Req() req: Request,
        @Res() res: Response
    ): Promise<Response> {
        const user = await this.userService.getUser(
            req.header(Constants.USER_HEADER)
        );

        return res.status(HttpStatus.OK).json(user);
    }

    @UsePipes(new UserValidationPipe(CreateUserValidationSchema))
    @Post('/create')
    public async createUser(
        @Req() req: Request,
        @Res() res: Response,
        @Body() userDTO: UserDTO
    ): Promise<Response> {
        const user = userDTO;
        user.uuid = req.header(Constants.USER_HEADER);
        const isUserCreated = await this.userService.createUser(user);

        return res.status(HttpStatus.OK).json(isUserCreated);
    }

    @UsePipes(new UserValidationPipe(UpdateUserValidationSchema))
    @Patch('/update')
    public async updateUser(
        @Req() req: Request,
        @Res() res: Response,
        @Body() userDTO: UserDTO
    ): Promise<Response> {
        const user = userDTO;
        user.uuid = req.header(Constants.USER_HEADER);
        const updatedUser = await this.userService.updateUser(user.uuid, user);

        return res.status(HttpStatus.OK).json(updatedUser);
    }
}
