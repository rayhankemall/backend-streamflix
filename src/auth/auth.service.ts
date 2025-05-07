import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, username: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      username,
      password: hashedPassword,
    });
    return { message: 'User berhasil dibuat', user };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email tidak ditemukan');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Password salah');

    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
