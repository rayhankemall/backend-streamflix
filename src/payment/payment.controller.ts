import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('upload-proof')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProof(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request, // GANTI INI
  ) {
    const socketId = req.body.socketId;

    console.log("🧾 File:", file);
    console.log("🔌 Socket ID:", socketId);

    if (!file || !file.buffer) {
      throw new BadRequestException('❌ File bukti pembayaran tidak valid atau tidak ditemukan.');
    }

    if (!socketId || typeof socketId !== 'string') {
      throw new BadRequestException('❌ socketId diperlukan dan harus berupa string.');
    }

    try {
      return await this.paymentService.sendBuktiToTelegram(file, socketId);
    } catch (err) {
      console.error('❌ Error saat mengirim bukti ke Telegram:', err.message);
      throw new BadRequestException('Gagal mengirim bukti ke Telegram.');
    }
  }
}