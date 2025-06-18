import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: Partial<Comment>, @Req() req: Request) {
    const user = req.user as any;
    return this.commentsService.create({ ...body, username: user.email }); // atau user.username
  }

  @Get(':movieId')
  findByMovie(@Param('movieId') movieId: string): Promise<Comment[]> {
    return this.commentsService.findByMovieId(movieId);
  }
}
