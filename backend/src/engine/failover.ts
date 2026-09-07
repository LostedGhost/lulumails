import { IEmailAdapter, EmailPayload, SendResult } from './adapters/types.js';
import { ResendAdapter } from './adapters/resend.js';
import { BrevoAdapter } from './adapters/brevo.js';
import { SMTPAdapter } from './adapters/smtp.js';

export interface ProviderConfigItem {
  id: string;
  providerType: string;
  name: string;
  config: Record<string, any>; // decrypted config
  dailyLimit: number;
  currentDailyUsage: number;
  priority: number;
}

export class FailoverEngine {
  private createAdapter(provider: ProviderConfigItem): IEmailAdapter | null {
    switch (provider.providerType) {
      case 'resend':
        return new ResendAdapter({ apiKey: provider.config.apiKey });
      case 'brevo':
        return new BrevoAdapter({ apiKey: provider.config.apiKey });
      case 'gmail_smtp':
      case 'custom_smtp':
      case 'smtp':
        return new SMTPAdapter({
          host: provider.config.host,
          port: Number(provider.config.port || 587),
          secure: Boolean(provider.config.secure),
          user: provider.config.user,
          pass: provider.config.pass,
        });
      default:
        return null;
    }
  }

  async sendWithFailover(
    providers: ProviderConfigItem[],
    payload: EmailPayload
  ): Promise<{ result: SendResult; attemptedProviders: string[] }> {
    const attemptedProviders: string[] = [];

    // Filter out providers over daily limit & sort by priority (lowest number = highest priority)
    const validProviders = providers
      .filter(p => p.currentDailyUsage < p.dailyLimit)
      .sort((a, b) => a.priority - b.priority);

    if (validProviders.length === 0) {
      return {
        result: {
          success: false,
          provider: 'none',
          error: 'No active email providers available or all daily quotas exceeded',
        },
        attemptedProviders,
      };
    }

    for (const provider of validProviders) {
      attemptedProviders.push(`${provider.providerType} (${provider.name})`);
      const adapter = this.createAdapter(provider);

      if (!adapter) {
        continue;
      }

      const res = await adapter.send(payload);
      if (res.success) {
        return { result: res, attemptedProviders };
      }

      // If it failed, loop continues to next provider in failover sequence
      console.warn(`[LuluMails Failover] ${provider.name} failed: ${res.error}. Trying next provider...`);
    }

    return {
      result: {
        success: false,
        provider: 'all_failed',
        error: `All available providers failed. Tried: ${attemptedProviders.join(', ')}`,
      },
      attemptedProviders,
    };
  }
}
