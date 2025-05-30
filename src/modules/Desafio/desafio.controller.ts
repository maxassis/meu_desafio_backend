import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  // UploadedFile,
  UseGuards,
  UseInterceptors,
  // UseInterceptors,
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
import { FastifyRequest } from 'fastify';
import { FileFastifyInterceptor } from 'fastify-file-interceptor';

// Define interface for Express.Multer.File compatibility
interface MulterLikeFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

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
  @UseInterceptors(FileFastifyInterceptor('image'))
  async createDesafio(
    @Body() body: CreateDesafioDTO,
    @Request() req: FastifyRequest,
  ) {
    const { name, description, location, distance } = body;
    const parsedLocation = JSON.parse(location);

    const file = req.file as unknown as MulterLikeFile;

    return this.createDesafioUseCase.createDesafio(
      name,
      description,
      parsedLocation,
      Number(distance),
      file,
    );
  }

  @Post('/register-user-desafio/:id')
  @UseGuards(AuthGuard)
  async registerDesafio(
    @Param('id') idDesafio: string,
    @Request() req: RequestSchemaDTO,
  ) {
    return this.registerUserDesafio.registerUserDesafio(idDesafio, req.user.id);
  }

  @Get('/get-user-desafio')
  @UseGuards(AuthGuard)
  async getDesafio(@Request() req: RequestSchemaDTO) {
    return this.getUserDesafio.getDesafio(req.user.id);
  }

  @Get('/get-all-desafio')
  @UseGuards(AuthGuard)
  async getAllDesafio(@Request() req: RequestSchemaDTO) {
    return this.getAllDesafioUseCase.getAllDesafio(req.user.id);
  }

  @Get('/get-desafio/:id')
  @UseGuards(AuthGuard)
  async getDesafioById(@Param('id') idDesafio: string) {
    return this.desafio.getDesafio(idDesafio);
  }
}
