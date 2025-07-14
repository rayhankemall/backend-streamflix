// src/profile/profile.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updateProfile(
    userId: number,
    data: { fullName: string; email: string; username: string },
    profilePicture?: string,
  ) {
    const user = await this.userRepository.findOne({where: { id: String(userId) } });
    if (!user) throw new Error('User not found');

    user.fullName = data.fullName;
    user.email = data.email;
    user.username = data.username;
    if (profilePicture) {
      user.profilePicture = profilePicture;
    }

    return this.userRepository.save(user);
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: String(userId) },
      select: ['id', 'email', 'username', 'fullName', 'profilePicture'],
    });

    if (!user) throw new Error('User not found');

    return {
      ...user,
      profilePicture: user.profilePicture
        ? `${process.env.BASE_URL}/uploads/profile/${user.profilePicture}`
        : null,
    };
  }
}
