import { Injectable, BadRequestException } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class PaymentService {
  constructor(private readonly telegramService: TelegramService) {}

  async sendBuktiToTelegram(file: Express.Multer.File, socketId: string) {
    if (!file || !file.buffer) {
      throw new BadRequestException('❌ File bukti pembayaran tidak valid.');
    }

    const originalName = file.originalname;
    const regex = /bukti__(.+?)__(\d+)\.(jpg|jpeg|png|webp)$/i;
    const match = originalName.match(regex);

    let caption = '📤 Bukti pembayaran dari pengguna.';

    if (match) {
      const plan = match[1];
      const amount = match[2];
      caption = `🧾 Halo Admin, saya ingin konfirmasi pembayaran:\n\n📦 Paket: ${plan}\n💵 Jumlah: Rp ${Number(amount).toLocaleString('id-ID')}`;
    }

    try {
      return await this.telegramService.sendPhotoToAdmin(file.buffer, caption, socketId, file.mimetype);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Gagal mengirim foto ke Telegram:', error.message);
      throw new BadRequestException('Gagal mengirim bukti ke Telegram.');
    }
  }
}
