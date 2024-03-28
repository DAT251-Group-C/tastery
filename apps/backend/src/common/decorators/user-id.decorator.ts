import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { IAccessToken } from './access-token.decorator';

export const UserId = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const user: IAccessToken = request.user;

  if (!user) {
    throw new UnauthorizedException('Access token not provided');
  }

  return user.sub;
});
