import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { MockProxy, mock, mockClear } from 'jest-mock-extended';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../../models';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  const userRepository: MockProxy<Repository<UserEntity>> = mock<Repository<UserEntity>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [{ provide: getRepositoryToken(UserEntity), useValue: userRepository }, UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    mockClear(userRepository);
  });

  it('should be defined', async () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return a user', done => {
      const user = { id: '123' } as UserEntity;
      userRepository.findOneBy.mockResolvedValue(user);

      userService.getUserById(user.id).subscribe(result => {
        expect(result).toBe(user);
        expect(userRepository.findOneBy).toBeCalledWith({ id: user.id });
        done();
      });
    });

    it('should throw an error if user is not found', done => {
      const userId = '123';
      userRepository.findOneBy.mockResolvedValue(null);

      userService.getUserById(userId).subscribe({
        error: err => {
          expect(err).toBeDefined();
          expect(err).toBeInstanceOf(ResourceNotFoundException);
          expect(userRepository.findOneBy).toBeCalledWith({ id: userId });
          done();
        },
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user', done => {
      const userId = '123';
      const body = {} as UpdateUserDto;
      const updateResult = { affected: 1 } as UpdateResult;
      userRepository.update.mockResolvedValue(updateResult);

      userService.updateUser(userId, body).subscribe(result => {
        expect(result).toBe(updateResult);
        expect(userRepository.update).toBeCalledWith({ id: userId }, body);
        done();
      });
    });

    it('should throw an error if user is not found', done => {
      const userId = '123';
      const body = {} as UpdateUserDto;
      userRepository.update.mockResolvedValue({ affected: 0 } as UpdateResult);

      userService.updateUser(userId, body).subscribe({
        error: err => {
          expect(err).toBeDefined();
          expect(err).toBeInstanceOf(ResourceNotFoundException);
          expect(userRepository.update).toBeCalledWith({ id: userId }, body);
          done();
        },
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', done => {
      const userId = '123';
      const deleteResult = { affected: 1 } as UpdateResult;
      userRepository.delete.mockResolvedValue(deleteResult);

      userService.deleteUser(userId).subscribe(result => {
        expect(result).toBe(deleteResult);
        expect(userRepository.delete).toBeCalledWith({ id: userId });
        done();
      });
    });

    it('should throw an error if user is not found', done => {
      const userId = '123';
      userRepository.delete.mockResolvedValue({ affected: 0 } as UpdateResult);

      userService.deleteUser(userId).subscribe({
        error: err => {
          expect(err).toBeDefined();
          expect(err).toBeInstanceOf(ResourceNotFoundException);
          expect(userRepository.delete).toBeCalledWith({ id: userId });
          done();
        },
      });
    });
  });
});
