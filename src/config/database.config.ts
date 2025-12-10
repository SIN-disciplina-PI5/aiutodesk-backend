import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DB_URL ?? null,

  host: process.env.DB_HOST ?? null,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  user: process.env.DB_USER ?? null,
  password: process.env.DB_PWD ?? null,
  name: process.env.DB_NAME ?? null,

  synchronize: (process.env.DB_SYNC ?? 'false') === 'true',
  logging: (process.env.DB_LOGGING ?? 'false') === 'true',
}));
