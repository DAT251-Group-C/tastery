import { CanActivate, ExecutionContext, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable, catchError, from, map, of, tap, throwError } from 'rxjs';
import appConfig from '../../config/app-conf';
import { IAccessToken } from '../../decorators/access-token.decorator';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';

interface IRequest {
  headers: {
    authorization?: string;
  };
  user?: IAccessToken;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(appConfig.KEY) private config: ConfigType<typeof appConfig>,
    private reflector: Reflector,
  ) {}

  public canActivate(context: ExecutionContext): Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      return of(true);
    }

    return this.getAccessTokenFromRequest(context).pipe(
      tap(accessToken => {
        const request = context.switchToHttp().getRequest<IRequest>();
        request.user = accessToken;
      }),
      map(() => true),
    );
  }

  public getAccessTokenFromRequest(context: ExecutionContext): Observable<IAccessToken> {
    const { secret } = this.config.jwt;

    if (!secret) {
      throw new InternalServerErrorException('An error occurred');
    }

    const request = context.switchToHttp().getRequest<IRequest>();
    const [type, jwt] = request.headers.authorization?.split(' ') ?? [];
    const token = type === 'Bearer' ? jwt : undefined;

    if (!token) {
      throw new UnauthorizedException('No token in header');
    }

    return from(this.jwtService.verifyAsync<IAccessToken>(token, { secret })).pipe(
      catchError(() => throwError(() => new UnauthorizedException('Invalid token'))),
    );
  }
}
