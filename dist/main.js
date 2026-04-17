"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('RuOK – Hybrid Safety Model API')
        .setDescription(`Backend REST API for **RuOK** – a mobile safety app.\n\n` +
        `Features:\n` +
        `- 👤 **Users** – full CRUD\n` +
        `- 🆘 **Emergency (SOS)** – create & manage SOS alerts\n` +
        `- ✅ **Check-in** – location check-in status\n` +
        `- ❤️ **Health** – server status probe\n`)
        .setVersion('1.0')
        .setContact('RuOK Team', '', 'support@ruok.app')
        .addTag('Health', 'Server health check')
        .addTag('Users', 'User management (CRUD)')
        .addTag('Emergency', 'SOS emergency alerts')
        .addTag('Check-in', 'Location check-in records')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
        customSiteTitle: 'RuOK API Docs',
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`🚀 Server running on port ${port}`);
    logger.log(`📖 Swagger UI → http://localhost:${port}/api/docs`);
}
void bootstrap();
//# sourceMappingURL=main.js.map