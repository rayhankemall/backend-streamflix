import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { WsGateway } from '../ws/ws.gateway';
import { Readable } from 'stream';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private chatSocketMap = new Map<number, string>();

  constructor(private readonly wsGateway: WsGateway) {}

  async onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;

    if (!token) throw new Error('❌ TELEGRAM_BOT_TOKEN tidak ditemukan di .env');
    if (!webhookUrl) throw new Error('❌ TELEGRAM_WEBHOOK_URL tidak ditemukan di .env');

    this.bot = new TelegramBot(token, { webHook: true });
    await this.bot.setWebHook(`${webhookUrl}/api/bot`);
    console.log('✅ Webhook Telegram diset ke:', `${webhookUrl}/api/bot`);

    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text?.toLowerCase().trim();

      if (text === 'ok') {
        const socketId = this.getSocketIdForAdmin(chatId);
        if (socketId) {
          console.log(`📡 Admin kirim "ok", emit ke socket: ${socketId}`);
          this.wsGateway.server.to(socketId).emit(`payment-completed:${socketId}`, {
            message: '✅ Pembayaran terverifikasi oleh admin!',
          });
        } else {
          console.warn(`⚠️ Tidak ditemukan socketId untuk chatId ${chatId}`);
        }
      }
    });
  }

  getBotInstance() {
    return this.bot;
  }

  saveSocketIdForAdmin(chatId: number, socketId: string) {
    this.chatSocketMap.set(chatId, socketId);
    console.log(`🔐 Mapping chatId ${chatId} ↔ socketId ${socketId}`);
  }

  getSocketIdForAdmin(chatId: number): string | undefined {
    return this.chatSocketMap.get(chatId);
  }

  async sendPhotoToAdmin(buffer: Buffer, caption?: string, socketId?: string, mimeType?: string) {
    const chatIdStr = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (!chatIdStr) throw new Error('❌ TELEGRAM_ADMIN_CHAT_ID tidak ditemukan di .env');

    const chatId = Number(chatIdStr);
    if (isNaN(chatId)) throw new Error(`❌ TELEGRAM_ADMIN_CHAT_ID bukan angka: ${chatIdStr}`);

    try {
      if (socketId) {
        this.saveSocketIdForAdmin(chatId, socketId);
      }

      const stream = Readable.from(buffer);
      console.log(`📸 Mengirim foto buffer ke admin Telegram...`);

      await this.bot.sendPhoto(chatId, stream, {
        caption: caption || '📤 Bukti pembayaran dari pengguna.',
      });

      console.log('✅ Foto berhasil dikirim ke admin Telegram.');
    } catch (error) {
      console.error('❌ Gagal mengirim foto ke Telegram admin:', error.message);
      throw new Error('Gagal mengirim foto ke admin Telegram.');
    }
  }
}