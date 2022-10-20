import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTPayloadWithRT } from '../types/jwtPayloadWithRT.type';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JWTPayloadWithRT | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
