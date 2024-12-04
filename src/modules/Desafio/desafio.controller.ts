import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { CreateDesafioDTO } from './schemas';
import { RequestSchemaDTO } from '../Users/schemas';
import {
  RegisterUserDesafioUseCase,
  CreateDesafioUseCase,
  GetUserDesafioUseCase,
  GetDesafioUseCase,
} from './useCase';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@Controller('/desafio/')
@UsePipes(ZodValidationPipe)
export class DesafioController {
  constructor(
    private readonly createDesafioUseCase: CreateDesafioUseCase,
    private readonly registerUserDesafio: RegisterUserDesafioUseCase,
    private readonly getUserDesafio: GetUserDesafioUseCase,
    private readonly desafio: GetDesafioUseCase,
  ) {}

  @Post('/create')
  // @UseGuards(AuthGuard)
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
    return this.registerUserDesafio.registerUserDesafio(idDesafio, req.user.id);
  }

  @Get('/getUserDesafio')
  @UseGuards(AuthGuard)
  async getDesafio(@Request() req: RequestSchemaDTO) {
    return this.getUserDesafio.getDesafio(req.user.id);
  }

  @Get('/getDesafio/:id')
  @UseGuards(AuthGuard)
  async getDesafioById(@Param('id') idDesafio: string) {
    return this.desafio.getDesafio(idDesafio);
  }
}
