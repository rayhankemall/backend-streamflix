import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  movieId: string;

  @Column()
  username: string;

  @Column()
  text: string;

  @Column()
  rating: number;

  @CreateDateColumn()
  createdAt: Date;
}
