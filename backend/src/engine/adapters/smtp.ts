import nodemailer from 'nodemailer';
import { IEmailAdapter, EmailPayload, SendResult } from './types.js';

export interface SMTPConfig {
  host: string;
  port: number;
  secure?: boolean;
  user: string;
  pass: string;
}

export class SMTPAdapter implements IEmailAdapter {
  providerName = 'smtp';
  private transporter: nodemailer.Transporter;
  private defaultFrom: string;

  constructor(config: SMTPConfig) {
    this.defaultFrom = config.user;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure ?? config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  async send(payload: EmailPayload): Promise<SendResult> {
    try {
      const info = await this.transporter.sendMail({
        from: payload.from || this.defaultFrom,
        to: payload.to.join(', '),
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      });

      return {
        success: true,
        provider: this.providerName,
        messageId: info.messageId,
      };
    } catch (err: any) {
      return {
        success: false,
        provider: this.providerName,
        error: err.message || 'SMTP transport failed',
      };
    }
  }
}
