import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  if (configService.get<string>('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Финансовый мэнэджер')
      .setDescription('Бэк для финансового мэнэджера')
      .setVersion(process.env.npm_package_version ?? '0.0.0');

    const document = SwaggerModule.createDocument(app, config.build(), {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    });
    SwaggerModule.setup('api', app, document);
  }

  app.setGlobalPrefix('/api');
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 9020);
}
void bootstrap();
