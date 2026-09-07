import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import crypto from 'node:crypto';
import { inMemoryProviders, inMemoryKeys, inMemoryTemplates, inMemoryLogs } from '../auth/auth.routes.js';
import { FailoverEngine } from '../../engine/failover.js';
import { hashApiKey } from '../../engine/crypto.js';

const failoverEngine = new FailoverEngine();

export async function emailRoutes(fastify: FastifyInstance) {
  // Main email sending endpoint
  fastify.post('/v1/emails/send', async (request, reply) => {
    // 1. Authenticate via Bearer API Key or auth token
    const authHeader = request.headers.authorization;
    let apiKeyItem: any = null;

    if (authHeader && authHeader.startsWith('Bearer lm_live_')) {
      const rawKey = authHeader.replace('Bearer ', '').trim();
      const hashed = hashApiKey(rawKey);
      apiKeyItem = inMemoryKeys.find(k => k.keyHash === hashed && k.status === 'active');
      if (!apiKeyItem) {
        return reply.status(401).send({ error: 'Invalid or revoked API Key' });
      }
      apiKeyItem.lastUsedAt = new Date().toISOString();
    }

    const schema = z.object({
      to: z.union([z.string().email(), z.array(z.string().email())]),
      subject: z.string().optional(),
      html: z.string().optional(),
      text: z.string().optional(),
      templateId: z.string().optional(),
      variables: z.record(z.any()).optional(),
    });

    const body = schema.parse(request.body);
    const recipients = Array.isArray(body.to) ? body.to : [body.to];

    let finalSubject = body.subject || '';
    let finalHtml = body.html || '';

    // If templateId is specified, render template
    if (body.templateId) {
      const template = inMemoryTemplates.find(t => t.id === body.templateId || t.slug === body.templateId);
      if (!template) {
        return reply.status(404).send({ error: `Template '${body.templateId}' not found` });
      }
      finalSubject = template.subject;
      finalHtml = template.bodyHtml;

      // Replace {{key}} variables
      if (body.variables) {
        Object.entries(body.variables).forEach(([key, val]) => {
          const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
          finalSubject = finalSubject.replace(regex, String(val));
          finalHtml = finalHtml.replace(regex, String(val));
        });
      }
    }

    if (!finalSubject || !finalHtml) {
      return reply.status(400).send({ error: 'Missing subject or html content' });
    }

    // 2. Select providers for Failover Engine
    // Prioritize active providers
    const activeProviders = inMemoryProviders.filter(p => p.isActive);

    const { result, attemptedProviders } = await failoverEngine.sendWithFailover(activeProviders, {
      to: recipients,
      subject: finalSubject,
      html: finalHtml,
      text: body.text,
    });

    // 3. Log execution
    const logItem = {
      id: crypto.randomUUID(),
      apiKeyId: apiKeyItem?.id || null,
      providerUsed: result.provider,
      recipient: recipients.join(', '),
      subject: finalSubject,
      status: result.success ? 'sent' : 'failed',
      errorMessage: result.error || null,
      attemptedProviders,
      sentAt: new Date().toISOString(),
    };
    inMemoryLogs.unshift(logItem);

    if (!result.success) {
      return reply.status(502).send({
        error: 'Failed to send email via available providers',
        details: result.error,
        attemptedProviders,
      });
    }

    return reply.send({
      id: logItem.id,
      status: 'sent',
      provider: result.provider,
      messageId: result.messageId,
    });
  });

  // Get email logs
  fastify.get('/v1/emails/logs', async (request, reply) => {
    return reply.send({ logs: inMemoryLogs });
  });

  // Get delivery statistics
  fastify.get('/v1/stats', async (request, reply) => {
    const total = inMemoryLogs.length;
    const sent = inMemoryLogs.filter(l => l.status === 'sent').length;
    const failed = inMemoryLogs.filter(l => l.status === 'failed').length;
    const successRate = total > 0 ? Math.round((sent / total) * 100) : 100;

    return reply.send({
      totalEmails: total,
      sentCount: sent,
      failedCount: failed,
      successRate,
      activeProvidersCount: inMemoryProviders.filter(p => p.isActive).length,
    });
  });
}
