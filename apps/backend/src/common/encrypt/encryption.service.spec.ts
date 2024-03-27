import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import appConfig from '../config/app-conf';
import { EncryptionModule } from './encryption.module';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  const hash =
    '1a1d0afb80957218d43b0d5338919ca365101c1bc21b7f576f53443c0dc268219f84eb1179a21f2e0702bfad8c4dfc02a1f43e922ba99664efb71669d9c901ac';
  let encryptionService: EncryptionService;

  jest.mock('crypto', () => {
    return {
      ...jest.requireActual('crypto'),
      pbkdf2Sync: jest.fn().mockReturnValue({
        toString: () => hash,
      }),
    };
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EncryptionModule, ConfigModule.forRoot({ load: [appConfig] })],
    }).compile();

    encryptionService = module.get<EncryptionService>(EncryptionService);
  });

  it('should create a hashWithCrypto', () => {
    expect(encryptionService.hashWithCrypto('test_stingToHash')).toBe(hash);
  });

  describe('encryptAESObj', () => {
    const mockDecryptedObject = { name: 'John Doe', age: 30 };

    it('should encrypt the object using AES', () => {
      const expectedCipherText = 'bKSxg7Pq9cCOVXPTrbEV8rWGIpD8S0u39ixZslhjg44=';
      const actualCipherText = encryptionService.encryptAESObj(mockDecryptedObject);
      expect(actualCipherText).toEqual(expectedCipherText);
    });
  });

  describe('decryptAESSting', () => {
    const mockDecryptedObject = { name: 'John Doe', age: 30 };
    const expectedCipherText = 'bKSxg7Pq9cCOVXPTrbEV8rWGIpD8S0u39ixZslhjg44=';

    it('should encrypt the object using AES', () => {
      const actualCipherText = encryptionService.decryptAES(expectedCipherText);
      expect(actualCipherText).toEqual(mockDecryptedObject);
    });
  });
});
