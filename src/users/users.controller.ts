import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create user
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // Get all users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // Get user by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // Update user data
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // Delete user
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    // req.user.sub dari JWT adalah string (uuid)
    return this.usersService.findById(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
 @Patch(':id/subscription')
updateSubscription(
  @Param('id') id: string,
  @Body() body: { isSubscribed: boolean; subscriptionEnd: Date },
) {
  return this.usersService.updateSubscription(id, body);
}
}
