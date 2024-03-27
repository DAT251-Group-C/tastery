import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { pbkdf2Sync } from 'crypto';
import { AES, enc, mode, pad } from 'crypto-js';
import appConfig from '../config/app-conf';

@Injectable()
export class EncryptionService {
  private readonly hashIterations: number;
  private readonly hashKeyLength: number;
  private readonly hashDigest: string;
  private readonly encryptionObject: Parameters<typeof AES.decrypt>[2];
  private readonly authEncryptedKey: ReturnType<typeof enc.Hex.parse>;
  private readonly salt: string;

  constructor(@Inject(appConfig.KEY) { encryption }: ConfigType<typeof appConfig>) {
    const { hashDigest, hashKeyLength, hashIterations, ivKey, authEncryptedKey, salt } = encryption;

    if (!hashDigest || !hashKeyLength || !hashIterations || !ivKey || !authEncryptedKey || !salt) {
      throw new Error('Encryption config is not provided');
    }

    this.salt = salt;
    this.hashDigest = hashDigest;
    this.hashKeyLength = Number(hashKeyLength);
    this.hashIterations = Number(hashIterations);
    this.authEncryptedKey = enc.Hex.parse(authEncryptedKey);
    this.encryptionObject = {
      iv: enc.Hex.parse(ivKey),
      mode: mode.CFB,
      padding: pad.AnsiX923,
    };
  }

  public hashWithCrypto(stingToHash: string, salt = this.salt): string {
    const hash = pbkdf2Sync(stingToHash, salt, this.hashIterations, this.hashKeyLength, this.hashDigest);
    return hash.toString('hex');
  }

  public decryptAES<T>(encryptedText: string): T {
    const decrypted = AES.decrypt(encryptedText, this.authEncryptedKey, this.encryptionObject);
    return JSON.parse(decrypted.toString(enc.Utf8));
  }

  public encryptAESObj(decryptedObject: object): string {
    return AES.encrypt(JSON.stringify(decryptedObject), this.authEncryptedKey, this.encryptionObject).toString();
  }
}
