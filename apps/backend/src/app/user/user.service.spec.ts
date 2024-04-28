import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserEntity } from '../../entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getUserById', () => {
    it('should return a user if found', done => {
      const mockUser: UserEntity = {
        id: '1',
        name: 'Test User',
        email: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorites: Promise.resolve([]),
      };

      userRepository.findOneBy.mockReturnValue(Promise.resolve(mockUser));

      service.getUserById('1').subscribe({
        next: user => {
          expect(user).toEqual(mockUser);
          done();
        },
        error: done.fail,
      });
    });

    it('should throw NotFoundException if no user is found', done => {
      userRepository.findOneBy.mockReturnValue(Promise.resolve(null));

      service.getUserById('nonexistent').subscribe({
        next: () => done.fail('User not found'),
        error: error => {
          expect(error).toBeInstanceOf(ResourceNotFoundException);
          expect(error.message).toContain('User with id nonexistent not found');
          done();
        },
      });
    });
  });
  describe('updateUser', () => {
    it('should update a user successfully', done => {
      const updateResult: UpdateResult = { generatedMaps: [], raw: [], affected: 1 };
      userRepository.update.mockReturnValue(Promise.resolve(updateResult));

      service.updateUser('1', { name: 'Updated Name' }).subscribe({
        next: result => {
          expect(result.affected).toEqual(1);
          done();
        },
        error: done.fail,
      });
    });

    it('should throw NotFoundException if the update affects no rows', done => {
      userRepository.update.mockReturnValue(Promise.resolve({ generatedMaps: [], raw: [], affected: 0 }));

      service.updateUser('nonexistent', { name: 'Updated Name' }).subscribe({
        next: () => done.fail('User not found'),
        error: error => {
          expect(error).toBeInstanceOf(ResourceNotFoundException);
          expect(error.message).toContain('User with id nonexistent not found');
          done();
        },
      });
    });
  });
  describe('deleteUser', () => {
    it('should delete a user successfully', done => {
      const deleteResult: DeleteResult = { raw: [], affected: 1 };
      userRepository.delete.mockReturnValue(Promise.resolve(deleteResult));

      service.deleteUser('1').subscribe({
        next: result => {
          expect(result.affected).toEqual(1);
          done();
        },
        error: done.fail,
      });
    });

    it('should throw NotFoundException if no user is deleted', done => {
      userRepository.delete.mockReturnValue(Promise.resolve({ raw: [], affected: 0 }));

      service.deleteUser('nonexistent').subscribe({
        next: () => done.fail(),
        error: error => {
          expect(error).toBeInstanceOf(ResourceNotFoundException);
          expect(error.message).toContain('User with id nonexistent not found');
          done();
        },
      });
    });
  });
});
