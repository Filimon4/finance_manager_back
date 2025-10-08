import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  if (configService.get<string>('NODE_ENV') !== 'production') {
    /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
    const config = new DocumentBuilder()
      .setTitle('Финансовый мэнэджер')
      .setDescription('Бэк для финансового мэнэджера')
      .setVersion(process.env.npm_package_version ?? '0.0.0');

    const document = SwaggerModule.createDocument(app, config.build(), {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    });
    SwaggerModule.setup('api', app, document);
    /* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
  }

  app.setGlobalPrefix('/api');
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 9020);
}
void bootstrap();
