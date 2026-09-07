export interface LuluMailsConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject?: string;
  html?: string;
  text?: string;
  templateId?: string;
  variables?: Record<string, any>;
}

export interface SendEmailResponse {
  id: string;
  status: 'sent' | 'failed';
  provider: string;
  messageId?: string;
}

export class LuluMails {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: LuluMailsConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'http://localhost:4000';
  }

  public emails = {
    send: async (options: SendEmailOptions): Promise<SendEmailResponse> => {
      const response = await fetch(`${this.baseUrl}/v1/emails/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(`LuluMails Error ${response.status}: ${JSON.stringify(errData)}`);
      }

      return await response.json() as SendEmailResponse;
    },
  };
}
