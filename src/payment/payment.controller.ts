import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // pastikan guard ini udah ada

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('upload-proof')
  @UseGuards(JwtAuthGuard) // ⛔️ Wajib login
  @UseInterceptors(FileInterceptor('file'))
  async uploadProof(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user?: any },
  ) {
    const socketId = req.body.socketId;
    const user = req.user;

    console.log('🧾 File:', file?.originalname);
    console.log('🔌 Socket ID:', socketId);
    console.log('🙋‍♂️ User:', user?.username);

    if (!file || !file.buffer) {
      throw new BadRequestException('❌ File bukti pembayaran tidak valid atau tidak ditemukan.');
    }

    if (!socketId || typeof socketId !== 'string') {
      throw new BadRequestException('❌ socketId diperlukan dan harus berupa string.');
    }

    if (!user || !user.username) {
      throw new BadRequestException('❌ Informasi pengguna tidak ditemukan.');
    }

    return this.paymentService.sendBuktiToTelegram(file, socketId, {
      username: user.username,
      email: user.email,
    });
  }
}
