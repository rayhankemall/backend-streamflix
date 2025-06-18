import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
  ) {}

create(data: Partial<Comment>) {
  const comment = this.commentRepo.create(data);
  return this.commentRepo.save(comment);
}

  findByMovieId(movieId: string) {
    return this.commentRepo.find({
      where: { movieId },
      order: { id: 'DESC' },
    });
  }
}
