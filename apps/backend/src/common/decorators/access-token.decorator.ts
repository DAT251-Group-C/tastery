import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthUser } from '@supabase/supabase-js';
import { JwtPayload } from 'jsonwebtoken';

export type IAccessToken = AuthUser & Required<Omit<JwtPayload, 'jti' | 'nbf'>> & Pick<JwtPayload, 'jti' | 'nbf'>;

export const AccessToken = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const user: IAccessToken = request.user;

  if (!user) {
    throw new UnauthorizedException('Access token not provided');
  }

  return user;
});
