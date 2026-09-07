import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import crypto from 'node:crypto';
import { inMemoryKeys } from '../auth/auth.routes.js';
import { hashApiKey } from '../../engine/crypto.js';

export async function keyRoutes(fastify: FastifyInstance) {
  // Generate a new API Key for client apps (lm_live_...)
  fastify.post('/v1/keys', async (request, reply) => {
    const schema = z.object({
      name: z.string().min(1),
    });
    const body = schema.parse(request.body);

    const rawKey = `lm_live_${crypto.randomBytes(16).toString('hex')}`;
    const keyPrefix = rawKey.slice(0, 12);
    const keyHash = hashApiKey(rawKey);

    const apiKeyItem = {
      id: crypto.randomUUID(),
      name: body.name,
      keyPrefix,
      keyHash,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
    };

    inMemoryKeys.push(apiKeyItem);

    return reply.send({
      id: apiKeyItem.id,
      name: apiKeyItem.name,
      apiKey: rawKey, // Shown only once upon creation
      createdAt: apiKeyItem.createdAt,
    });
  });

  fastify.get('/v1/keys', async (request, reply) => {
    return reply.send({
      keys: inMemoryKeys.map(k => ({
        id: k.id,
        name: k.name,
        keyPrefix: k.keyPrefix,
        status: k.status,
        createdAt: k.createdAt,
        lastUsedAt: k.lastUsedAt,
      })),
    });
  });

  fastify.delete('/v1/keys/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const index = inMemoryKeys.findIndex(k => k.id === params.id);
    if (index !== -1) {
      inMemoryKeys[index].status = 'revoked';
    }
    return reply.send({ success: true });
  });
}
