import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'es6-shim';
import 'reflect-metadata';
import type { ViteHotContext } from 'vite/types/hot';
import { AppModule } from './app/app.module';
import appConfig from './common/config/app-conf';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';

declare const module: { hot?: ViteHotContext };

async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule);
  const config = nestApp.get(ConfigService).get<ConfigType<typeof appConfig>>('appConfig');

  if (!config) {
    throw new Error('Config not found');
  }

  const PORT = config.app.port;
  const VERSION_PREFIX = config.app.version;

  nestApp.setGlobalPrefix(VERSION_PREFIX);
  nestApp.enableVersioning({
    type: VersioningType.URI,
  });

  const httpAdapter = nestApp.get(HttpAdapterHost);
  nestApp.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  nestApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerDocConfig = new DocumentBuilder()
    .setTitle('AGIent REST API')
    .setDescription('OpenAPI doc for AGIent REST API')
    .setVersion(VERSION_PREFIX)
    .setExternalDoc('OpenAPI', '/docs')
    .addTag('AGIent')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(nestApp, swaggerDocConfig);
  SwaggerModule.setup('docs', nestApp, document);

  nestApp.enableCors();

  const port = process.env.PORT || PORT || 3000;
  await nestApp.listen(port);
  console.log(`Application is running on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => nestApp.close());
  }
}

bootstrap();
