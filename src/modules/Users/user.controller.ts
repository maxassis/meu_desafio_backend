import {
  Body,
  Get,
  Controller,
  Post,
  UsePipes,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateUserUseCase } from './useCases/create-user.usecase';
// import { CreateUserDTO } from './dto/user.dto';
import { CreateUserValidationPipe } from './pipe/create-user.validation.pipe';
import { CreateUserSchemaDTO } from './schemas/create-user-schema';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { RedisService } from 'src/infra/database/redis.service';

@Controller('/users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly redis: RedisService,
  ) {}

  @Post()
  @UsePipes(new CreateUserValidationPipe())
  async create(@Body() data: CreateUserSchemaDTO) {
    return await this.createUserUseCase.create(data);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async profile(@Request() req) {
    console.log(req.user);

    await this.redis.set('chave', 'consegui usar o redis hehehehh !!!!!');
  }
}
