import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateUserSchemaDTO } from '../schemas/create-user-schema';

@Injectable()
export class CreateUserValidationPipe implements PipeTransform {
  transform(
    { email, password, name }: CreateUserSchemaDTO,
    // metadata: ArgumentMetadata,
  ) {
    if (!email || !password || !name) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return { name, email, password };
  }
}
