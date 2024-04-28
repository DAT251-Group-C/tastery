import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { BadRequestException, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { FavoriteEntity, UserEntity } from '../../entities';
import { DeleteResult } from 'typeorm';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';

describe('FavoriteController', () => {
  let controller: FavoriteController;
  let service: jest.Mocked<FavoriteService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteController],
      providers: [
        {
          provide: FavoriteService,
          useValue: {
            checkFavorite: jest.fn().mockImplementation((userId: string, recipeId: string) => of(true)),
            createFavorite: jest.fn().mockImplementation((userId: string, recipeId: string) => of(new FavoriteEntity())),
            deleteFavorite: jest.fn().mockImplementation((userId: string, recipeId: string) => of({ affected: 1 })),
          },
        },
      ],
    }).compile();

    controller = module.get<FavoriteController>(FavoriteController);
    service = module.get<FavoriteService>(FavoriteService) as jest.Mocked<FavoriteService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkFavorite', () => {
    it('should return true if the user has favorited the recipe', async () => {
      service.checkFavorite.mockReturnValue(of(true)); // Mock service to return true
      const result = await controller.checkFavorite('user1', 'recipe1');
      expect(result).toBeTruthy();
      expect(service.checkFavorite).toHaveBeenCalledWith('user1', 'recipe1');
    });

    it('should handle errors by throwing BadRequestException', async () => {
      service.checkFavorite.mockReturnValue(throwError(() => new Error('Unexpected error')));
      await expect(controller.checkFavorite('user1', 'recipe1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('createFavorite', () => {
    it('should successfully create a favorite', async () => {
      const favorite: FavoriteEntity = {
        id: '1',
        userId: 'user1',
        recipeId: 'recipe1',
        user: {
          id: '',
          email: '',
          name: '',
          createdAt: '',
          updatedAt: '',
          favorites: Promise.resolve([]),
        },
        recipe: {
          id: '',
          userId: '',
          name: '',
          description: '',
          instructions: '',
          createdAt: '',
          tags: [],
          ingredients: [],
          favorites: Promise.resolve([]),
          user: Promise.resolve({} as UserEntity),
          updatedAt: '',
        },
        createdAt: new Date().toISOString(),
      };
      service.createFavorite.mockReturnValue(of(favorite));
      const result = await controller.createFavorite('user1', 'recipe1');
      expect(result).toEqual(favorite);
      expect(service.createFavorite).toHaveBeenCalledWith('user1', 'recipe1');
    });

    it('should throw BadRequestException when creation fails', async () => {
      service.createFavorite.mockReturnValue(throwError(() => new Error('Failed')));
      await expect(controller.createFavorite('user1', 'recipe1')).rejects.toThrow(BadRequestException);
    });
  });
  describe('deleteFavorite', () => {
    it('should delete a favorite successfully', async () => {
      service.deleteFavorite.mockReturnValue(of({ affected: 1 } as DeleteResult)); // Add 'as DeleteResult' to cast the object
      const result = await controller.deleteFavorite('user1', 'recipe1');
      expect(result.affected).toEqual(1);
      expect(service.deleteFavorite).toHaveBeenCalledWith('user1', 'recipe1');
    });

    it('should throw NotFoundException if no favorite found', async () => {
      service.deleteFavorite.mockReturnValue(throwError(() => new ResourceNotFoundException('Not found')));
      await expect(controller.deleteFavorite('user1', 'recipe1')).rejects.toThrow(NotFoundException);
    });
  });
});
