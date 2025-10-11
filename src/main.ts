import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const domain = configService.get<string>('HTTP_DOMAIN');
  const environment = configService.get<string>('NODE_ENV');
  const logger = new Logger('APP');

  app.setGlobalPrefix('/api');
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  if (configService.get<string>('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Финансовый мэнэджер')
      .setDescription('Бэк для финансового мэнэджера')
      .setVersion(process.env.npm_package_version ?? '0.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Paste only the JWT token (no "Bearer " prefix).',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);

    document.security = [{ 'JWT-auth': [] }];

    SwaggerModule.setup('/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true, // keeps the token across reloads
      },
    });
  }

  await app.listen(process.env.PORT ?? 9020).then(() => {
    if (environment !== 'production') {
      logger.debug(`Docs running on ${domain}/docs'`);
    }
    logger.debug(`App running on ${domain}`);
  });
}
void bootstrap();
