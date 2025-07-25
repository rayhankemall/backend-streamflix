// src/payment-proof/controllers/payment-proof.controller.ts
import {
  Controller,
  Get,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { PaymentProofService, PaymentCache } from './payment-proof.service';

@Controller('admin/payment-proof')
export class PaymentProofController {
  constructor(private readonly paymentProofService: PaymentProofService) {}

  // 🔹 Ambil semua bukti (confirmed dan unconfirmed)
  @Get()
  getAllProofs(): PaymentCache[] {
    return this.paymentProofService.getAllProofs();
  }

  // 🔹 Ambil semua bukti yang belum dikonfirmasi
  @Get('unconfirmed')
  getAllUnconfirmed(): PaymentCache[] {
    return this.paymentProofService.getAllUnconfirmed();
  }

  // 🔹 Ambil detail bukti berdasarkan fileId
  @Get(':fileId')
  getProofByFileId(@Param('fileId') fileId: string): PaymentCache | undefined {
    return this.paymentProofService.getProofByFileId(fileId);
  }

  // 🔹 Hapus bukti berdasarkan fileId
  @Delete(':fileId')
  deleteProof(@Param('fileId') fileId: string) {
    const success = this.paymentProofService.deleteProof(fileId);
    if (!success) {
      throw new NotFoundException('Bukti tidak ditemukan untuk dihapus.');
    }
    return { message: '✅ Bukti berhasil dihapus' };
  }
}
