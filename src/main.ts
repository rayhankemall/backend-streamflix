import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SeederService } from './seeder/seeder.service'; // ⬅️ Import SeederService

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  // Serve folder uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Jalankan Seeder
  const seeder = app.get(SeederService);
  await seeder.seeder(); // ⬅️ Ini penting

  await app.listen(4000, '0.0.0.0');
  console.log('✅ Backend running on: http://localhost:4000');
}
bootstrap();
