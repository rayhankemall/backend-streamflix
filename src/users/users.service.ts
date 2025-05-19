import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    // 🔍 Cek apakah email sudah ada
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      // ❌ Jika sudah ada, kirim error
      throw new ConflictException('Email sudah digunakan');
    }

    // 🔐 Hash password dan simpan
    const hash = await bcrypt.hash(dto.password, 10);
    const newUser = this.userRepo.create({ ...dto, password: hash });
    return this.userRepo.save(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({ where: { email } });
  }
}
