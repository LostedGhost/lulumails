import { describe, it, expect } from 'vitest';
import { encryptSecret, decryptSecret, hashApiKey } from '../crypto.js';
import { FailoverEngine, ProviderConfigItem } from '../failover.js';
import { IEmailAdapter, SendResult, EmailPayload } from '../adapters/types.js';

describe('LuluMails Crypto & Failover Engine', () => {
  it('should encrypt and decrypt provider secrets correctly', () => {
    const original = JSON.stringify({ apiKey: 're_123456789_secret_key' });
    const encrypted = encryptSecret(original);
    
    expect(encrypted).not.toBe(original);
    expect(encrypted).toContain(':');

    const decrypted = decryptSecret(encrypted);
    expect(decrypted).toBe(original);
  });

  it('should generate consistent SHA-256 API key hashes', () => {
    const key = 'lm_live_abcdef123456';
    const hash1 = hashApiKey(key);
    const hash2 = hashApiKey(key);

    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });

  it('should failover to second provider when first provider fails', async () => {
    const engine = new FailoverEngine();

    const mockProviders: ProviderConfigItem[] = [
      {
        id: 'p1',
        providerType: 'resend',
        name: 'Resend Primary',
        config: { apiKey: 'invalid_key' },
        dailyLimit: 100,
        currentDailyUsage: 0,
        priority: 1,
      },
      {
        id: 'p2',
        providerType: 'brevo',
        name: 'Brevo Backup',
        config: { apiKey: 'invalid_key' },
        dailyLimit: 300,
        currentDailyUsage: 0,
        priority: 2,
      },
    ];

    const payload: EmailPayload = {
      to: ['test@example.com'],
      subject: 'Test Subject',
      html: '<p>Test</p>',
    };

    const { result, attemptedProviders } = await engine.sendWithFailover(mockProviders, payload);
    
    expect(attemptedProviders.length).toBe(2);
    expect(result.success).toBe(false);
    expect(result.provider).toBe('all_failed');
  });
});
