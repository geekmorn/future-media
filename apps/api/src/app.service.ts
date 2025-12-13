import { Injectable } from '@nestjs/common';
import { User } from '@repo/types';


@Injectable()
export class AppService {
  getHello(user?: User): string {
    return 'Hello World!';
  }
}
