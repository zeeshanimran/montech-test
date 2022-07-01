import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Montech-Test')
    .setDescription('The Montech workflow application API description')
    .setExternalDoc(
      'See details and user guide',
      'https://docs.google.com/document/d/1lk9OqMw0JODc8ZQuFnm9_KJraXfTYO8tbhqmvVPp6G0/edit',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      customSiteTitle: 'My API Docs',
    },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
