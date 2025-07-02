import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

 async getProfile(id: string) {
  const user = await this.userRepo.findOne({ where: { id } });
  return {
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
  };
}

 async updateProfilePicture(id: string, filename: string) {
  const user = await this.userRepo.findOne({ where: { id } });
  user.profilePicture = filename;
  await this.userRepo.save(user);
  return { message: "Profile picture updated" };
}
}
