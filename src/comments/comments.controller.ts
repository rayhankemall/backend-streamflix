import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() body: Partial<Comment>) {
    return this.commentsService.create(body);
  }

  @Get(':movieId')
  findByMovie(@Param('movieId') movieId: string): Promise<Comment[]> {
    return this.commentsService.findByMovieId(movieId);
  }
}
