// entities/payment-proof.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class PaymentProof {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  filename: string;

  @Column()
  amount: number;

  @Column()
  plan: string;

  @Column({ default: 'pending' }) // pending, verified, rejected
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
