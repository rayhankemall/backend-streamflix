import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

 async createUser(createUserDto: CreateUserDto): Promise<User> {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

  const newUser = this.usersRepository.create({
    ...createUserDto,
    password: hashedPassword,
    isSubscribed: createUserDto.isSubscribed ?? false,
    subscriptionEnd: createUserDto.subscriptionEnd ?? null,
  });

  return this.usersRepository.save(newUser);
}


  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  // **Update subscription status**
  async updateSubscription(
    id: string,
    update: { isSubscribed: boolean; subscriptionEnd: Date | null },
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.isSubscribed = update.isSubscribed;
    user.subscriptionEnd = update.subscriptionEnd;
    return await this.usersRepository.save(user);
  }
}
