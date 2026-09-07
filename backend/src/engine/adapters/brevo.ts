import { IEmailAdapter, EmailPayload, SendResult } from './types.js';

export class BrevoAdapter implements IEmailAdapter {
  providerName = 'brevo';
  private apiKey: string;

  constructor(config: { apiKey: string }) {
    this.apiKey = config.apiKey;
  }

  async send(payload: EmailPayload): Promise<SendResult> {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { email: payload.from || 'noreply@lulumails.org', name: 'LuluMails' },
          to: payload.to.map(email => ({ email })),
          subject: payload.subject,
          htmlContent: payload.html,
          textContent: payload.text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        return {
          success: false,
          provider: this.providerName,
          error: `Brevo HTTP ${response.status}: ${JSON.stringify(errorData)}`,
        };
      }

      const data = await response.json() as { messageId: string };
      return {
        success: true,
        provider: this.providerName,
        messageId: data.messageId,
      };
    } catch (err: any) {
      return {
        success: false,
        provider: this.providerName,
        error: err.message || 'Brevo connection failed',
      };
    }
  }
}
