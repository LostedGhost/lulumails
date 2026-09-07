import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000'),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().default('postgres://postgres:postgres@localhost:5432/lulumails'),
  JWT_SECRET: z.string().default('super-secret-lulumails-key-change-in-prod'),
  ENCRYPTION_KEY: z.string().default('12345678901234567890123456789012'), // 32 chars
});

export const env = envSchema.parse(process.env);
