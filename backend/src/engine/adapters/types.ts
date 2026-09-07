export interface EmailPayload {
  from?: string;
  to: string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  provider: string;
  error?: string;
}

export interface IEmailAdapter {
  providerName: string;
  send(payload: EmailPayload): Promise<SendResult>;
}
