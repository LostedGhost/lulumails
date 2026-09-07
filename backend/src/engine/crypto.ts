import crypto from 'node:crypto';
import { env } from '../config/env.js';

const ALGORITHM = 'aes-256-gcm';

export function encryptSecret(plainText: string): string {
  const iv = crypto.randomBytes(12);
  const key = Buffer.from(env.ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decryptSecret(encryptedString: string): string {
  const [ivHex, authTagHex, encryptedText] = encryptedString.split(':');
  if (!ivHex || !authTagHex || !encryptedText) {
    throw new Error('Invalid encrypted text format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const key = Buffer.from(env.ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}
