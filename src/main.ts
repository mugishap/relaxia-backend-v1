import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configDotenv } from 'dotenv';
import { AppModule } from './app.module';
import { AppExceptionFilter } from './filters/AppExceptionFilter';

async function bootstrap() {

  configDotenv()
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: "*" });
  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({}));

  const config = new DocumentBuilder()
    .setTitle('Relaxia Services API documentation')
    .setDescription('The documentation for the Relaxia Services API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('users')
    .addTag('admins')
    .addTag('applications')
    .addTag('benefits')
    .addTag('companies')
    .addTag('files')
    .addTag('jobs')
    .addTag('profiles')
    .addTag('skills')
    .addTag('files')
    .addTag('work-experiences')
    .addTag("faqs")
    .addTag("contacts")
    .addTag("health")
    .setContact("Mugisha Precieux", "https://github.com/mugishap", "precieuxmugisha@gmail.com")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1/docs', app, document);

  await app.listen(process.env.PORT);

}

bootstrap();