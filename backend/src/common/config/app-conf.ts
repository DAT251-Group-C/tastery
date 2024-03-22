import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  app: {
    port: 3000,
    version: 'v1',
    env: 'development',
  },
  openai: {
    apiKey: process.env.NX_OPENAI_API_KEY,
    organization: process.env.NX_OPENAI_ORGANIZATION,
  },
  database: {
    host: process.env.NX_POSTGRES_HOST,
    port: parseInt(process.env.NX_POSTGRES_PORT, 10) || 5432,
    user: process.env.NX_POSTGRES_USER,
    password: process.env.NX_POSTGRES_PASSWORD,
    database: process.env.NX_POSTGRES_DATABASE,
  },
}));
