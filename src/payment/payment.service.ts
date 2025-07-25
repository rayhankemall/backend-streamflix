// src/payment/payment.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class PaymentService {
  constructor(private readonly telegramService: TelegramService) {}

  async sendBuktiToTelegram(
    file: Express.Multer.File,
    socketId: string,
    user: { username: string; email?: string },
  ) {
    if (!file?.buffer) {
      throw new BadRequestException('❌ File bukti pembayaran tidak valid.');
    }

    if (!socketId || typeof socketId !== 'string') {
      throw new BadRequestException('❌ socketId harus diisi dan berbentuk string.');
    }

    if (!user?.username) {
      throw new BadRequestException('❌ Informasi pengguna tidak lengkap.');
    }

    const originalName = file.originalname;
    const regex = /bukti__(.+?)__(\d+)\.(jpg|jpeg|png|webp)$/i;
    const match = originalName.match(regex);

    const now = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let plan = 'unknown';
    let amount = 0;

    if (match) {
      plan = match[1];
      amount = Number(match[2]);
    }

    const fullCaption =
      `📨 *Konfirmasi Pembayaran Baru!*

` +
      `👤 *Username:* \`${user.username}\`
` +
      `📧 *Email:* ${user.email ?? '_tidak tersedia_'}
` +
      `📦 *Paket:* *${plan}*
` +
      `💰 *Jumlah:* Rp *${amount.toLocaleString('id-ID')}*
` +
      `🕒 *Tanggal:* ${now}

` +
      `Silakan ketik *ok* untuk memverifikasi pembayaran ini.`;

    try {
      return await this.telegramService.sendPhotoToAdmin(file.buffer, {
        userId: user.username,
        plan,
        amount,
        caption: fullCaption,
        socketId,
        mimeType: file.mimetype,
      });
    } catch (error) {
      console.error('❌ Gagal mengirim foto ke Telegram:', error?.message);
      throw new BadRequestException('Gagal mengirim bukti ke Telegram.');
    }
  }
}


