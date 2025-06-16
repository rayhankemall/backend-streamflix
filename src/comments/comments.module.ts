import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity'; // <- pastikan import entity
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])], // <- DAFTARKAN ENTITY DI SINI
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService], // kalau perlu diakses module lain
})
export class CommentsModule {}
