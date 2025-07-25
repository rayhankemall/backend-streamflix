// src/profile/entities/profile.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  gmail: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: 'user' })
role: 'admin' | 'user';
}
