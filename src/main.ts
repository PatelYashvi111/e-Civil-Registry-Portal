import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://7wcqc54f-3000.inc1.devtunnels.ms', 
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT || 3000);

  console.log(`Server running on port ${process.env.PORT || 3000}`);
}

bootstrap();