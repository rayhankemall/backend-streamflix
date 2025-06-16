import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { User } from './users/entities/user.entity';
import { Comment } from './comments/comment.entity'; // ⬅️ Tambahkan ini

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Comment], // ⬅️ Tambahkan Comment ke sini
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CommentsModule,
  ],
})
export class AppModule {}
