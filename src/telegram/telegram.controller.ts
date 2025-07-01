import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { WsGateway } from 'src/ws/ws.gateway';

@Controller('api/bot')
export class TelegramController {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly wsGateway: WsGateway, // ⬅️ injeksi WebSocket Gateway
  ) {}

  @Post()
  async handleUpdate(@Body() body: any) {
    const bot = this.telegramService.getBotInstance();
    const message = body.message;

    if (message?.text) {
      const chatId = message.chat.id;
      const name = message.from.first_name ?? 'teman';
      const text = message.text.toLowerCase().trim();

      console.log(`📩 Pesan dari ${chatId}: ${text}`);

      // ✅ Kalau admin ketik "ok"
      if (text === 'ok') {
        const socketId = this.telegramService.getSocketIdForAdmin(chatId);

        if (socketId) {
          this.wsGateway.notifyPaymentCompleted(socketId);
          await bot.sendMessage(chatId, '✅ Notifikasi telah dikirim ke frontend.');
        } else {
          await bot.sendMessage(chatId, '⚠️ Tidak ada socketId terkait yang ditemukan. Mungkin belum upload bukti?');
        }
      } else {
        await bot.sendMessage(chatId, `Halo ${name}, kamu bilang: "${text}"`);
      }
    }

    return { ok: true };
  }
}

