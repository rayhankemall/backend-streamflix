import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TelegramModule } from '../telegram/telegram.module';
import { WsModule } from '../ws/ws.module'; 

@Module({
  imports: [TelegramModule, WsModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
