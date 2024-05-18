import {
  Body,
  Get,
  Controller,
  Post,
  UsePipes,
  UseGuards,
  RequestMapping,
  Request,
} from '@nestjs/common';
import { CreateUserUseCase } from './useCases/create-user.usecase';
// import { CreateUserDTO } from './dto/user.dto';
import { CreateUserValidationPipe } from './pipe/create-user.validation.pipe';
import { CreateUserSchemaDTO } from './schemas/create-user-schema';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';

@Controller('/users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @UsePipes(new CreateUserValidationPipe())
  async create(@Body() data: CreateUserSchemaDTO) {
    return await this.createUserUseCase.execute(data);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async profile(@Request() req) {
    console.log(req.user);
  }
}
