import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

@Column({ nullable: true })
fullName?: string;

 @Column({ nullable: true })
profilePicture?: string;

// Status langganan
  @Column({ default: false })
  isSubscribed: boolean;

  // Tanggal berakhir langganan (optional)
  @Column({ type: 'timestamp', nullable: true })
  subscriptionEnd: Date | null;
}
