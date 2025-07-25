import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { WsGateway } from '../ws/ws.gateway';
import { Readable } from 'stream';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private chatSocketMap = new Map<number, string>();
  private messageSocketMap = new Map<number, string>();

  constructor(private readonly wsGateway: WsGateway) {}

  async onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;

    if (!token) throw new Error('❌ TELEGRAM_BOT_TOKEN tidak ditemukan di .env');
    if (!webhookUrl) throw new Error('❌ TELEGRAM_WEBHOOK_URL tidak ditemukan di .env');

    this.bot = new TelegramBot(token, { webHook: true });
    await this.bot.setWebHook(`${webhookUrl}/api/bot`);
    console.log('✅ Webhook Telegram diset ke:', `${webhookUrl}/api/bot`);

    // Handler saat admin mengirim pesan
    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      console.log(`📥 Pesan masuk dari admin (${chatId}): ${msg.text}`);

      if (msg.reply_to_message && msg.reply_to_message.message_id) {
        const repliedMessageId = msg.reply_to_message.message_id;
        const socketId = this.messageSocketMap.get(repliedMessageId);

        if (socketId) {
          console.log(`📡 Admin reply ke messageId ${repliedMessageId}, emit ke socket ${socketId}`);

          this.wsGateway.server.to(socketId).emit(`payment-completed:${socketId}`, {
            message: '✅ Admin menerima bukti pembayaran!',
          });

          this.bot.sendMessage(chatId, '✅ Data user langsung ditampilkan ke frontend!');
        } else {
          console.warn(`⚠️ Tidak ditemukan socketId untuk reply messageId ${repliedMessageId}`);
        }
      } else {
        console.log('💬 Pesan diterima tapi bukan reply terhadap bukti foto.');
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

  async sendPhotoToAdmin(
    buffer: Buffer,
    options: {
      userId: string;
      plan: string;
      amount: number;
      caption?: string;
      socketId?: string;
      mimeType?: string;
    },
  ): Promise<void> {
    const { userId, plan, amount, socketId, caption } = options;

    const chatIdStr = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (!chatIdStr) throw new Error('❌ TELEGRAM_ADMIN_CHAT_ID tidak ditemukan di .env');

    const chatId = Number(chatIdStr);
    if (isNaN(chatId)) throw new Error(`❌ TELEGRAM_ADMIN_CHAT_ID bukan angka: ${chatIdStr}`);

    try {
      if (socketId) {
        this.saveSocketIdForAdmin(chatId, socketId);
      }

      const stream = Readable.from(buffer);

      const fullCaption =
        `📨 *Konfirmasi Pembayaran Baru!*\n\n` +
        `👤 *User ID:* \`${userId}\`\n` +
        `📦 *Paket:* ${plan}\n` +
        `💰 *Jumlah:* Rp ${amount.toLocaleString('id-ID')}\n` +
        `🕒 *Tanggal:* ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n\n` +
        `Silakan balas pesan ini untuk verifikasi.`;

      console.log(`📸 Mengirim foto bukti dari user ${userId}...`);

      const sentMessage = await this.bot.sendPhoto(chatId, stream, {
        caption: caption ?? fullCaption,
        parse_mode: 'Markdown',
      });

      if (socketId) {
        this.messageSocketMap.set(sentMessage.message_id, socketId);
        console.log(`🧷 Mapping messageId ${sentMessage.message_id} ↔ socketId ${socketId}`);
      }

      console.log('✅ Foto & data berhasil dikirim ke admin Telegram.');
    } catch (error) {
      console.error('❌ Gagal mengirim foto ke Telegram admin:', error.message);
      throw new Error('Gagal mengirim foto ke admin Telegram.');
    }
  }
}
