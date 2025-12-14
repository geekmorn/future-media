import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  name: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload;

    if (data) {
      return user?.[data];
    }

    return user;
  },
);
