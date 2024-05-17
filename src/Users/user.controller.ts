import { Controller, Get } from '@nestjs/common';

@Controller()
export class UserController {
  @Get('/hello')
  helloUser() {
    return 'Hello User !!!!';
  }
}
