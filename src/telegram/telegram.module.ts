import { Module, forwardRef } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { WsGateway } from '../ws/ws.gateway'; // sesuaikan path

@Module({
  controllers: [TelegramController],
  providers: [TelegramService, WsGateway], // ⬅ inject gateway di sini
  exports: [TelegramService], // kalau modul lain butuh TelegramService
})
export class TelegramModule {}