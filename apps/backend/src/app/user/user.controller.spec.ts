import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException, BadRequestException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { UserEntity } from '../../entities'; // Import the UserEntity
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { DeleteResult, UpdateResult } from 'typeorm';

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService) as jest.Mocked<UserService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getUserById', () => {
    it('should return a user if found', async () => {
      const mockUser: UserEntity = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date().toISOString(), // Convert Date to string
        updatedAt: new Date().toISOString(), // Convert Date to string
        favorites: Promise.resolve([]), // Change the type of favorites to Promise<FavoriteEntity[]>
      };
      service.getUserById.mockReturnValue(of(mockUser)); // Mock service to return user

      const result = await controller.getUserById('1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should successfully update a user', async () => {
      const updateResult: UpdateResult = { affected: 1, raw: null, generatedMaps: [] };
      service.updateUser.mockReturnValue(of(updateResult));

      const result = await controller.updateUser('1', { name: 'Updated Name' });
      expect(result).toEqual(updateResult);
    });

    it('should throw NotFoundException if the update affects no rows', async () => {
      service.updateUser.mockReturnValue(throwError(() => new ResourceNotFoundException('User not found')));

      await expect(controller.updateUser('nonexistent', { name: 'Updated Name' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const deleteResult: DeleteResult = { affected: 1, raw: null };
      service.deleteUser.mockReturnValue(of(deleteResult));

      const result = await controller.deleteUser('1');
      expect(result).toEqual(deleteResult);
    });

    it('should throw NotFoundException if no user is deleted', async () => {
      service.deleteUser.mockReturnValue(throwError(() => new ResourceNotFoundException('User not found')));

      await expect(controller.deleteUser('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // Additional test cases will go here
});
