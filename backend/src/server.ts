import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { env } from './config/env.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { keyRoutes } from './modules/keys/keys.routes.js';
import { providerRoutes } from './modules/providers/providers.routes.js';
import { templateRoutes } from './modules/templates/templates.routes.js';
import { emailRoutes } from './modules/emails/emails.routes.js';

const server = Fastify({ logger: true });

async function main() {
  await server.register(cors, { origin: true });
  await server.register(jwt, { secret: env.JWT_SECRET });
  await server.register(rateLimit, { max: 100, timeWindow: '1 minute' });

  // Swagger Documentation
  await server.register(swagger, {
    openapi: {
      info: {
        title: 'LuluMails API',
        description: 'API d\'envoi d\'emails transactionnels et de masse avec failover et BYOK',
        version: '1.0.0',
      },
    },
  });
  await server.register(swaggerUi, { routePrefix: '/docs' });

  // Register API modules
  await server.register(authRoutes);
  await server.register(keyRoutes);
  await server.register(providerRoutes);
  await server.register(templateRoutes);
  await server.register(emailRoutes);

  server.get('/health', async () => ({ status: 'ok', service: 'LuluMails API', timestamp: new Date().toISOString() }));

  try {
    const port = Number(env.PORT);
    await server.listen({ port, host: env.HOST });
    console.log(`🚀 LuluMails Fastify Server running at http://localhost:${port}`);
    console.log(`📚 Swagger Docs available at http://localhost:${port}/docs`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
