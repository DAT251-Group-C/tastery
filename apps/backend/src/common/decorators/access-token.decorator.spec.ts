import { UnauthorizedException } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { AccessToken } from './access-token.decorator';

describe('Access token decorator test', () => {
  const getParamDecoratorFactory = () => {
    class TestDecorator {
      public test(@AccessToken() value) {
        return value;
      }
    }

    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');
    return args[Object.keys(args)[0]].factory;
  };

  it('should return access token from request', () => {
    const factory = getParamDecoratorFactory();
    const user = { id: 'userid' };

    const ctxMock = {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
        }),
      }),
    };

    const result = factory(null, ctxMock);

    expect(result).toBe(user);
  });

  it('should throw error if access token is not present', done => {
    const factory = getParamDecoratorFactory();

    const ctxMock = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    };

    try {
      factory(null, ctxMock);
      done.fail('Did not throw error');
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedException);
      done();
    }
  });
});
