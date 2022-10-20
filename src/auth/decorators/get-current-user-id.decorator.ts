import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTPayload } from '../types/jwtPayload.type';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JWTPayload;
    return user.sub;
  },
);
