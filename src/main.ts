import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule.register({ driver: 'orm' }));

  const config = new DocumentBuilder()
    .setTitle('聊天系統 API 文件')
    .setDescription('API 僅供參考')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://${process.env.APP_HOST}:${process.env.APP_PORT}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(process.env.APP_PORT);
}
bootstrap();
