// src/payment-proof/payment-proof.module.ts
import { Module } from '@nestjs/common';
import { PaymentProofController } from './payment-proof.controller';
import { PaymentProofService } from './payment-proof.service';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [TelegramModule],
  controllers: [PaymentProofController],
  providers: [PaymentProofService],
})
export class PaymentProofModule {}
