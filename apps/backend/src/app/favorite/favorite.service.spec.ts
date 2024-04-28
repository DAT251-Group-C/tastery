import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FavoriteService } from './favorite.service';
import { FavoriteEntity } from '../../entities';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let favoriteRepository: jest.Mocked<Repository<FavoriteEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: getRepositoryToken(FavoriteEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            create: jest.fn().mockImplementation(dto => dto), 
          },
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    favoriteRepository = module.get(getRepositoryToken(FavoriteEntity));
  });

  describe('createFavorite', () => {
    it('should create a new favorite if not already exists', (done) => {
      const userId = 'user123';
      const recipeId = 'recipe123';
      const favoriteEntity = new FavoriteEntity();
      favoriteEntity.userId = userId;
      favoriteEntity.recipeId = recipeId;

      favoriteRepository.findOne.mockReturnValue(Promise.resolve(null)); 
      favoriteRepository.save.mockResolvedValue(favoriteEntity); 

      service.createFavorite(userId, recipeId).subscribe(result => {
        expect(result).toEqual(favoriteEntity);
        done();
      }, done.fail);
    });

    it('should not create a new favorite if already exists', (done) => {
        const userId = 'user123';
        const recipeId = 'recipe123';
        const existingFavorite = new FavoriteEntity();
        existingFavorite.userId = userId;
        existingFavorite.recipeId = recipeId;

        favoriteRepository.findOne.mockReturnValue(Promise.resolve(existingFavorite));

        service.createFavorite(userId, recipeId).subscribe((value: FavoriteEntity) => {
            done.fail('Expected an error to be thrown.');
        }, error => {
            expect(error.message).toContain('Favorite already exists');
            done();
        });
    });
    describe('checkFavorite', () => {
        it('should return true if favorite exists', (done) => {
          const userId = 'user123';
          const recipeId = 'recipe456';
          const favorite = new FavoriteEntity();
          favorite.userId = userId;
          favorite.recipeId = recipeId;
    
          favoriteRepository.findOne.mockReturnValue(Promise.resolve(favorite));
    
          service.checkFavorite(userId, recipeId).subscribe(result => {
            expect(result).toBe(true);
            done();
          }, done.fail);
        });
    
        it('should return false if no favorite exists', (done) => {
          const userId = 'user123';
          const recipeId = 'recipe456';
    
          favoriteRepository.findOne.mockReturnValue(Promise.resolve(null));
    
          service.checkFavorite(userId, recipeId).subscribe(result => {
            expect(result).toBe(false);
            done();
          }, done.fail);
        });
      });
  });
  
});
