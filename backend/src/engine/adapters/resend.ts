import { IEmailAdapter, EmailPayload, SendResult } from './types.js';

export class ResendAdapter implements IEmailAdapter {
  providerName = 'resend';
  private apiKey: string;

  constructor(config: { apiKey: string }) {
    this.apiKey = config.apiKey;
  }

  async send(payload: EmailPayload): Promise<SendResult> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: payload.from || 'LuluMails <onboarding@resend.dev>',
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        return {
          success: false,
          provider: this.providerName,
          error: `Resend HTTP ${response.status}: ${JSON.stringify(errorData)}`,
        };
      }

      const data = await response.json() as { id: string };
      return {
        success: true,
        provider: this.providerName,
        messageId: data.id,
      };
    } catch (err: any) {
      return {
        success: false,
        provider: this.providerName,
        error: err.message || 'Resend connection failed',
      };
    }
  }
}
