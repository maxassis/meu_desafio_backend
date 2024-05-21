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
import { CreateUserValidationPipe } from './pipe/create-user.validation.pipe';
import { CreateUserSchemaDTO } from './schemas/create-user-schema';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { MailerService } from '@nestjs-modules/mailer';
import Redis from 'ioredis';
import { CreateUserTermplate } from 'src/templates-email/create.user.template';

@Controller('/users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    @InjectRedis() private readonly redis: Redis,
    private readonly mailerService: MailerService,
  ) {}

  @Post()
  @UsePipes(new CreateUserValidationPipe())
  async createUser(@Body() data: CreateUserSchemaDTO) {
    const dt = await this.createUserUseCase.create(data);
    Reflect.deleteProperty(dt, 'password');

    return dt;
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async profile(@Request() req) {
    // console.log(req.user);

    await this.mailerService.sendMail({
      to: 'max.assis@ymail.com',
      from: 'bondis@bondis.com',
      subject: 'Teste email',
      html: CreateUserTermplate('Max'),
    });

    return await this.redis.set('usando a lib222', 'usando a lib222', 'EX', 30); //300
  }
}
