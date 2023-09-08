import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cors = require('cors');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: `../.env.local` });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Credit Notes')
    .setDescription('API Rest related to manage credit note.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(cors());
  await app.listen(3000);
}
bootstrap();
