import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ── CORS ──────────────────────────────────────────────────────────────────
  app.enableCors();

  // ── Global Validation Pipe ────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ── Swagger / OpenAPI ─────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('RuOK – Hybrid Safety Model API')
    .setDescription(
      `Backend REST API for **RuOK** – a mobile safety app.\n\n` +
        `Features:\n` +
        `- 👤 **Users** – full CRUD\n` +
        `- 🆘 **Emergency (SOS)** – create & manage SOS alerts\n` +
        `- ✅ **Check-in** – location check-in status\n` +
        `- ❤️ **Health** – server status probe\n`,
    )
    .setVersion('1.0')
    .setContact('RuOK Team', '', 'support@ruok.app')
    .addTag('Health', 'Server health check')
    .addTag('Users', 'User management (CRUD)')
    .addTag('Emergency', 'SOS emergency alerts')
    .addTag('Check-in', 'Location check-in records')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'RuOK API Docs',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Server running on port ${port}`);
  logger.log(`📖 Swagger UI → http://localhost:${port}/api/docs`);
}

void bootstrap();
