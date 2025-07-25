import { Injectable, NotFoundException } from '@nestjs/common';

export interface PaymentCache {
  userId: string;
  fileId: string;
  isConfirmed: boolean;
  createdAt: Date;
}

@Injectable()
export class PaymentProofService {
  private paymentProofs: PaymentCache[] = [];

  addProof(userId: string, fileId: string) {
    this.paymentProofs.push({
      userId,
      fileId,
      isConfirmed: false,
      createdAt: new Date(),
    });
  }

  confirmProof(userId: string): boolean {
    const proof = this.paymentProofs.find(
      (p) => p.userId === userId && !p.isConfirmed,
    );
    if (proof) {
      proof.isConfirmed = true;
      return true;
    }
    return false;
  }

  getAllProofs(): PaymentCache[] {
    return this.paymentProofs;
  }

  getProofByFileId(fileId: string): PaymentCache {
    const proof = this.paymentProofs.find((p) => p.fileId === fileId);
    if (!proof) {
      throw new NotFoundException('Bukti pembayaran tidak ditemukan.');
    }
    return proof;
  }

  deleteProof(fileId: string): boolean {
    const index = this.paymentProofs.findIndex((p) => p.fileId === fileId);
    if (index !== -1) {
      this.paymentProofs.splice(index, 1);
      return true;
    }
    return false;
  }

  getAllUnconfirmed(): PaymentCache[] {
    return this.paymentProofs.filter((p) => !p.isConfirmed);
  }
}
