import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { CreateDesafioDTO } from './schemas/createDesafio.schema';
import { RequestSchemaDTO } from '../Users/schemas';
import { RegisterUserDesafioUseCase, CreateDesafioUseCase } from './useCase';
import { GetUserDesafioUseCase } from './useCase/getUserDesafio.usecase';

@Controller('/desafio/')
export class DesafioController {
  constructor(
    private readonly createDesafioUseCase: CreateDesafioUseCase,
    private readonly registerUserDesafio: RegisterUserDesafioUseCase,
    private readonly getUserDesafio: GetUserDesafioUseCase,
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

  @Post('/registerUserDesafio/:id')
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

  @Get('/getDesafio')
  @UseGuards(AuthGuard)
  async getDesafio(@Request() req: RequestSchemaDTO) {
    return this.getUserDesafio.getDesafio(req.user.id);
  }
}
