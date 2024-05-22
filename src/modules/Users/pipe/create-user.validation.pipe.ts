import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateUserDTO } from '../dto/user.dto';

@Injectable()
export class CreateUserValidationPipe implements PipeTransform {
  transform(
    { email, password, name }: CreateUserDTO,
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
