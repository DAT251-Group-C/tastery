import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { UserEntity } from '../../models';
import { MockProxy, mock, mockClear } from 'jest-mock-extended';
import { of, throwError } from 'rxjs';
import { AccessTokenData } from '../../common/interfaces/access-token.type';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let userController: UserController;
  const userService: MockProxy<UserService> = mock<UserService>();
  const jwtService: MockProxy<JwtService> = mock<JwtService>();
  const configService: MockProxy<ConfigService> = mock<ConfigService>();
  const mockAccessToken: AccessTokenData = { sub: 'user-id', email: 'user@feedapp.no' };

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  afterEach(() => {
    mockClear(userService);
  });

  it('should be defined', async () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('GET User', () => {
    it('should return user', done => {
      const user = { id: '123' } as UserEntity;
      userService.getUserById.mockReturnValue(of(user));

      userController.getUser(mockAccessToken).then(response => {
        expect(response).toBe(user);
        done();
      });
    });

    it('should throw bad request error of there was an error', done => {
      userService.getUserById.mockReturnValue(throwError(() => new Error('error')));

      userController.getUser(mockAccessToken).catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        expect(error).toBeDefined();
        done();
      });
    });

    it('should throw a not found error if user is not found', done => {
      userService.getUserById.mockReturnValue(throwError(() => new ResourceNotFoundException('error')));

      userController.getUser(mockAccessToken).catch(error => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('error');
        expect(error).toBeDefined();
        done();
      });
    });
  });

  describe('GET User by ID', () => {
    it('should return user', done => {
      const user = { id: '123' } as UserEntity;
      userService.getUserById.mockReturnValue(of(user));

      userController.getUserById(user.id).then(response => {
        expect(response).toBe(user);
        done();
      });
    });

    it('should throw bad request error of there was an error', done => {
      userService.getUserById.mockReturnValue(throwError(() => new Error('error')));

      userController.getUserById('123').catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        expect(error).toBeDefined();
        done();
      });
    });

    it('should throw a not found error if user is not found', done => {
      userService.getUserById.mockReturnValue(throwError(() => new ResourceNotFoundException('error')));

      userController.getUserById('123').catch(error => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('error');
        expect(error).toBeDefined();
        done();
      });
    });
  });

  describe('PUT Update User', () => {
    it('should update the user', done => {
      const result = { affected: 1 } as UpdateResult;
      const body = { name: 'Name' } as UpdateUserDto;
      userService.updateUser.mockReturnValue(of(result));

      userController.updateUser(mockAccessToken, body).then(response => {
        expect(response).toBe(result);
        done();
      });
    });

    it('should throw bad request error of there was an error', done => {
      userService.updateUser.mockReturnValue(throwError(() => new Error('error')));

      userController.updateUser(mockAccessToken, {} as UpdateUserDto).catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        expect(error).toBeDefined();
        done();
      });
    });

    it('should throw a not found error if user is not found', done => {
      userService.updateUser.mockReturnValue(throwError(() => new ResourceNotFoundException('error')));

      userController.updateUser(mockAccessToken, {} as UpdateUserDto).catch(error => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('error');
        expect(error).toBeDefined();
        done();
      });
    });
  });

  describe('DELETE User', () => {
    it('should delete the user', done => {
      const result = { affected: 1 } as DeleteResult;
      userService.deleteUser.mockReturnValue(of(result));

      userController.deleteUser(mockAccessToken).then(response => {
        expect(response).toBe(result);
        done();
      });
    });

    it('should throw bad request error of there was an error', done => {
      userService.deleteUser.mockReturnValue(throwError(() => new Error('error')));

      userController.deleteUser(mockAccessToken).catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        expect(error).toBeDefined();
        done();
      });
    });

    it('should throw a not found error if user is not found', done => {
      userService.deleteUser.mockReturnValue(throwError(() => new ResourceNotFoundException('error')));

      userController.deleteUser(mockAccessToken).catch(error => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('error');
        expect(error).toBeDefined();
        done();
      });
    });
  });
});
