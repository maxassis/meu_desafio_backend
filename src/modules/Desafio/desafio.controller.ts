import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
  GetAllDesafioUseCase,
} from './useCase';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/desafio/')
@UsePipes(ZodValidationPipe)
export class DesafioController {
  constructor(
    private readonly createDesafioUseCase: CreateDesafioUseCase,
    private readonly registerUserDesafio: RegisterUserDesafioUseCase,
    private readonly getUserDesafio: GetUserDesafioUseCase,
    private readonly desafio: GetDesafioUseCase,
    private readonly getAllDesafioUseCase: GetAllDesafioUseCase,
  ) {}

  @Post('/create')
  // @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createDesafio(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateDesafioDTO,
  ) {
    const { name, description, location, distance } = body;
    const parsedLocation = JSON.parse(location);

    return this.createDesafioUseCase.createDesafio(
      name,
      description,
      parsedLocation,
      Number(distance),
      file,
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

  @Get('/getAllDesafio')
  @UseGuards(AuthGuard)
  async getAllDesafio(@Request() req: RequestSchemaDTO) {
    return this.getAllDesafioUseCase.getAllDesafio(req.user.id);
  }

  @Get('/getDesafio/:id')
  @UseGuards(AuthGuard)
  async getDesafioById(@Param('id') idDesafio: string) {
    return this.desafio.getDesafio(idDesafio);
  }
}
