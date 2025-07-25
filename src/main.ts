import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
  origin: '*',
  credentials: true,
});

  await app.listen(4000);
  console.log('✅ Backend running on: http://localhost:4000'); // <-- tambahkan ini
}
bootstrap();
