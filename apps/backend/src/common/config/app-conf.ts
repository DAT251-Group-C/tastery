import { registerAs } from '@nestjs/config';

const appConfig = registerAs('appConfig', () => ({
  app: {
    port: 3000,
    version: 'v1',
    env: 'development',
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
}));

export default appConfig;
