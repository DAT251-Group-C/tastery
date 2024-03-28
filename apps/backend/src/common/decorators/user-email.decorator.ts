import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { IAccessToken } from './access-token.decorator';

export const UserEmail = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const user: IAccessToken = request.user;

  if (!user) {
    throw new UnauthorizedException('Access token not provided');
  }

  if (!user.email) {
    throw new UnauthorizedException('User email not provided');
  }

  return user.email;
});
