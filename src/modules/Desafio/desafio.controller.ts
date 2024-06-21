import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { CreateDesafioUseCase } from './useCases/createDesafio.usecase';
import { CreateDesafioDTO } from './schemas/createDesafio.schema';
import { RegisterUserDesafioUseCase } from './useCases/registerUserDesafio.usecase';
import { RequestSchemaDTO } from '../Users/schemas';

@Controller('/desafio/')
export class DesafioController {
  constructor(
    private readonly createDesafioUseCase: CreateDesafioUseCase,
    private readonly registerUserDesafio: RegisterUserDesafioUseCase,
  ) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  async createDesafio(@Body() body: CreateDesafioDTO) {
    return this.createDesafioUseCase.createDesafio(
      body.name,
      body.description,
      body.location,
    );
  }

  @Get('/registerDesafio/:id')
  @UseGuards(AuthGuard)
  async registerDesafio(
    @Param('id') idDesafio: string,
    @Request() req: RequestSchemaDTO,
  ) {
    {
      return this.registerUserDesafio.registerUserDesafio(
        idDesafio,
        req.user.id,
      );
    }
  }
}
