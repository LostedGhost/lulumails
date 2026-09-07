import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import crypto from 'node:crypto';
import { inMemoryProviders } from '../auth/auth.routes.js';
import { encryptSecret } from '../../engine/crypto.js';

export async function providerRoutes(fastify: FastifyInstance) {
  fastify.post('/v1/providers', async (request, reply) => {
    const schema = z.object({
      providerType: z.enum(['resend', 'brevo', 'mailersend', 'gmail_smtp', 'custom_smtp', 'smtp']),
      name: z.string().min(1),
      config: z.record(z.any()),
      dailyLimit: z.number().default(300),
      priority: z.number().default(1),
    });

    const body = schema.parse(request.body);
    const encryptedConfig = encryptSecret(JSON.stringify(body.config));

    const item = {
      id: crypto.randomUUID(),
      providerType: body.providerType,
      name: body.name,
      config: body.config, // stored decrypted in memory for quick engine access
      encryptedConfig,
      dailyLimit: body.dailyLimit,
      currentDailyUsage: 0,
      priority: body.priority,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    inMemoryProviders.push(item);

    return reply.send({
      id: item.id,
      providerType: item.providerType,
      name: item.name,
      dailyLimit: item.dailyLimit,
      currentDailyUsage: item.currentDailyUsage,
      priority: item.priority,
      isActive: item.isActive,
    });
  });

  fastify.get('/v1/providers', async (request, reply) => {
    return reply.send({
      providers: inMemoryProviders.map(p => ({
        id: p.id,
        providerType: p.providerType,
        name: p.name,
        dailyLimit: p.dailyLimit,
        currentDailyUsage: p.currentDailyUsage,
        priority: p.priority,
        isActive: p.isActive,
      })),
    });
  });
}
