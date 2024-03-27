import { CanActivate, ExecutionContext, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import appConfig from '../config/app-conf';
import { IAccessToken } from '../decorators/access-token.decorator';

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
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IRequest>();
    const { secret } = this.config.jwt;

    if (!secret) {
      throw new InternalServerErrorException('An error occurred');
    }

    request.user = await AuthGuard.getUserFromRequest(request, this.jwtService, secret);
    return true;
  }

  public static async getUserFromRequest(request: IRequest, jwtService: JwtService, secret: string): Promise<IAccessToken> {
    const [type, jwt] = request.headers.authorization?.split(' ') ?? [];
    const token = type === 'Bearer' ? jwt : undefined;

    if (!token) {
      throw new UnauthorizedException('No token in header');
    }

    try {
      return await jwtService.verifyAsync<IAccessToken>(token, { secret });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
