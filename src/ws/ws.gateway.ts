import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' }, // Ganti ke domain frontend kamu di production
})
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Set<string> = new Set();

  afterInit() {
    console.log('✅ WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`🟢 Client connected: ${client.id}`);
    this.connectedClients.add(client.id);
    console.log(`👥 Total clients: ${this.connectedClients.size}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔴 Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
    console.log(`👥 Total clients: ${this.connectedClients.size}`);
  }

  notifyPaymentCompleted(target: string) {
    const payload = {
      status: 'verified',
      message: '✅ Pembayaran telah diverifikasi oleh admin.',
    };

    if (target === 'global') {
      this.server.emit('payment-completed', payload);
      console.log('📢 Emit "payment-completed" ke SEMUA client');
    } else {
      this.server.to(target).emit(`payment-completed:${target}`, payload);
      console.log(`📢 Emit "payment-completed:${target}" ke client spesifik: ${target}`);
    }
  }
}