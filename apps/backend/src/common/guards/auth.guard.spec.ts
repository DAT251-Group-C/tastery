import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import appConfig from '../config/app-conf';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  const jwtService: MockProxy<JwtService> = mock<JwtService>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [appConfig] })],
      providers: [AuthGuard, { provide: JwtService, useValue: jwtService }],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('should return true if jwt token is valid', done => {
    const context = getMockedContext('invalid-token');
    jwtService.verifyAsync.mockResolvedValue({ sub: '123', email: 'email@feedapp.no' });

    authGuard.canActivate(context).then(response => {
      expect(response).toBe(true);
      done();
    });
  });

  it('should throw if the jwt token is invalid', done => {
    const context = getMockedContext('invalid-token');
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid token'));

    authGuard.canActivate(context).catch(error => {
      expect(error).toBeInstanceOf(UnauthorizedException);
      done();
    });
  });

  function getMockedContext(jwtToken?: string): ExecutionContext {
    const request = {
      headers: {
        ...(jwtToken && { authorization: `Bearer ${jwtToken}` }),
      },
    };

    const context: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    return context;
  }
});
