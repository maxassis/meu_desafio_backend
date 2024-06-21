import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { CreateDesafioUseCase } from './useCases/createDesafio.usecase';
import { CreateDesafioDTO } from './schemas/createDesafio.schema';
// import { RequestSchemaDTO } from '../Users/schemas';

@Controller('/desafio')
export class DesafioController {
  constructor(private readonly createDesafioUseCase: CreateDesafioUseCase) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  async createDesafio(@Body() body: CreateDesafioDTO) {
    return this.createDesafioUseCase.createDesafio(
      body.name,
      body.description,
      body.location,
    );
  }
}
