import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
