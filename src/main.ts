import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule.register({ driver: 'orm', type: 'postgres' }),
  );

  const serverUrl =
    process.env.APP_DEBUG === 'true'
      ? `http://${process.env.APP_HOST}:${process.env.APP_PORT}`
      : `https://${process.env.APP_HOST}`;

  const config = new DocumentBuilder()
    .setTitle('聊天系統 API 文件')
    .setDescription('API 僅供參考')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(serverUrl)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.APP_PORT);
}
bootstrap();
