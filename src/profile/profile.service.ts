import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
  ) {}

  async create(data: Partial<Profile>): Promise<Profile> {
    const profile = this.profileRepo.create(data);
    return this.profileRepo.save(profile);
  }
}
