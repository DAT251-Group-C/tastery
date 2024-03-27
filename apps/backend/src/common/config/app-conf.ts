import { registerAs } from '@nestjs/config';

const appConfig = registerAs('appConfig', () => ({
  app: {
    port: 3000,
    version: 'v1',
    env: 'development',
  },
  openai: {
    apiKey: process.env.NX_OPENAI_API_KEY,
    organization: process.env.NX_OPENAI_ORGANIZATION,
  },
  jwt: {
    secret: process.env.NX_JWT_SECRET,
  },
  database: {
    host: process.env.NX_POSTGRES_HOST,
    port: Number(process.env.NX_POSTGRES_PORT) || 5432,
    user: process.env.NX_POSTGRES_USER,
    password: process.env.NX_POSTGRES_PASSWORD,
    database: process.env.NX_POSTGRES_DATABASE,
  },
  encryption: {
    hashIterations: process.env.NX_ENCRYPTION_HASH_ITERATIONS,
    hashKeyLength: process.env.NX_ENCRYPTION_HASH_KEY_LENGTH,
    hashDigest: process.env.NX_ENCRYPTION_HASH_DIGEST,
    authEncryptedKey: process.env.NX_ENCRYPTION_AUTH_ENCRYPTED_KEY,
    ivKey: process.env.NX_ENCRYPTION_IV_KEY,
    salt: process.env.NX_ENCRYPTION_SALT,
  },
}));

export default appConfig;
