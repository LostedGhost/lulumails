import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import crypto from 'node:crypto';

// In-memory / Mock fallback store if Postgres pool is disconnected during initial dev
export const inMemoryUsers: any[] = [];
export const inMemoryKeys: any[] = [];
export const inMemoryProviders: any[] = [];
export const inMemoryTemplates: any[] = [];
export const inMemoryLogs: any[] = [];

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/v1/auth/register', async (request, reply) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(2),
    });

    const body = schema.parse(request.body);
    const existing = inMemoryUsers.find(u => u.email === body.email);
    if (existing) {
      return reply.status(400).send({ error: 'Email already registered' });
    }

    const user = {
      id: crypto.randomUUID(),
      email: body.email,
      name: body.name,
      passwordHash: crypto.createHash('sha256').update(body.password).digest('hex'),
      createdAt: new Date().toISOString(),
    };
    inMemoryUsers.push(user);

    const token = fastify.jwt.sign({ userId: user.id, email: user.email });
    return reply.send({ user: { id: user.id, email: user.email, name: user.name }, token });
  });

  fastify.post('/v1/auth/login', async (request, reply) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const body = schema.parse(request.body);
    const passwordHash = crypto.createHash('sha256').update(body.password).digest('hex');
    const user = inMemoryUsers.find(u => u.email === body.email && u.passwordHash === passwordHash);

    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token = fastify.jwt.sign({ userId: user.id, email: user.email });
    return reply.send({ user: { id: user.id, email: user.email, name: user.name }, token });
  });
}
