// src/telegram/telegram.controller.ts
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { WsGateway } from 'src/ws/ws.gateway';

@Controller('api/bot')
export class TelegramController {
  private readonly logger = new Logger(TelegramController.name);

  constructor(
    private readonly telegramService: TelegramService,
    private readonly wsGateway: WsGateway,
  ) {}

  @Post()
  async handleUpdate(@Body() body: any) {
    const bot = this.telegramService.getBotInstance();
    const message = body.message;

    if (!message || !message.chat || !message.text) {
      this.logger.warn('📭 Tidak ada pesan teks masuk yang valid.');
      return { ok: true };
    }

    const chatId = message.chat.id;
    const name = message.from?.first_name || 'teman';
    const text = message.text.toLowerCase().trim();

    this.logger.log(`📩 Pesan dari ${chatId}: ${text}`);

    if (text === 'ok') {
      const socketId = this.telegramService.getSocketIdForAdmin(chatId);

      if (socketId) {
        this.wsGateway.notifyPaymentCompleted(socketId);
        await bot.sendMessage(chatId, '✅ Notifikasi telah dikirim ke frontend.');
        this.logger.log(`✅ Emit berhasil untuk socketId: ${socketId}`);
      } else {
        await bot.sendMessage(chatId, '⚠️ Tidak ada socketId yang terhubung. Mungkin belum upload bukti?');
        this.logger.warn(`⚠️ Gagal emit: tidak ditemukan socketId untuk chatId: ${chatId}`);
      }
    } else {
      await bot.sendMessage(chatId, `Halo ${name}, kamu bilang: "${text}"`);
    }

    return { ok: true };
  }
}