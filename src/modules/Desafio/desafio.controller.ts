import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { CreateDesafioDTO, PurchaseDataSchema } from './schemas';
import { RequestSchemaDTO } from '../Users/schemas';
import {
  // RegisterUserDesafioUseCase,
  CreateDesafioUseCase,
  // GetUserDesafioUseCase,
  GetDesafioUseCase,
  GetAllDesafioUseCase,
  GetPurchaseDataUseCase,
} from './useCase';
import { ZodValidationPipe } from 'nestjs-zod';
import { FastifyRequest } from 'fastify';
import { FilesFastifyInterceptor } from 'fastify-file-interceptor';

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
    // private readonly registerUserDesafio: RegisterUserDesafioUseCase,
    // private readonly getUserDesafio: GetUserDesafioUseCase,
    private readonly desafio: GetDesafioUseCase,
    private readonly getAllDesafioUseCase: GetAllDesafioUseCase,
    private readonly getPurchaseDataUseCase: GetPurchaseDataUseCase,
  ) {}

  @Post('/create')
  // @UseGuards(AuthGuard)
  @UseInterceptors(FilesFastifyInterceptor('images'))
  async createDesafio(
    @Body() body: CreateDesafioDTO,
    @Request() req: FastifyRequest,
  ) {
    const { name, location, distance, purchaseData, active, priceId } = body;

    const purchaseJSON = JSON.parse(purchaseData);
    const validatedPurchaseData = PurchaseDataSchema.parse(purchaseJSON);

    const parsedLocation = JSON.parse(location);

    const files = req.files as unknown as MulterLikeFile[];

    return this.createDesafioUseCase.createDesafio(
      name,
      parsedLocation,
      Number(distance),
      active,
      priceId,
      validatedPurchaseData,
      files,
    );
  }

  // @Post('/register-user-desafio/:id')
  // @UseGuards(AuthGuard)
  // async registerDesafio(
  //   @Param('id') idDesafio: string,
  //   @Request() req: RequestSchemaDTO,
  // ) {
  //   return this.registerUserDesafio.registerUserDesafio(idDesafio, req.user.id);
  // }

  // @Get('/get-user-desafio')
  // @UseGuards(AuthGuard)
  // async getDesafio(@Request() req: RequestSchemaDTO) {
  //   return this.getUserDesafio.getDesafio(req.user.id);
  // }

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

  @Get('purchase-data/:id')
  @UseGuards(AuthGuard)
  async getPurchaseData(@Param('id') idDesafio: string) {
    return this.getPurchaseDataUseCase.getPurchaseData(idDesafio);
  }
}
