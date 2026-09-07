import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import crypto from 'node:crypto';
import { inMemoryTemplates } from '../auth/auth.routes.js';

export async function templateRoutes(fastify: FastifyInstance) {
  fastify.post('/v1/templates', async (request, reply) => {
    const schema = z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      subject: z.string().min(1),
      bodyHtml: z.string().min(1),
      bodyText: z.string().optional(),
      variables: z.array(z.string()).default([]),
    });

    const body = schema.parse(request.body);

    const template = {
      id: crypto.randomUUID(),
      name: body.name,
      slug: body.slug,
      subject: body.subject,
      bodyHtml: body.bodyHtml,
      bodyText: body.bodyText || '',
      variables: body.variables,
      createdAt: new Date().toISOString(),
    };

    inMemoryTemplates.push(template);

    return reply.send(template);
  });

  fastify.get('/v1/templates', async (request, reply) => {
    return reply.send({ templates: inMemoryTemplates });
  });
}
