// src/profile/profile.controller.ts

import {
  Controller,
  Put,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Body,
  Req,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // ✅ PUT /profile
  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads/profile',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + path.extname(file.originalname));
        },
      }),
    }),
  )
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: {
      fullName: string;
      email: string;
      username: string;
    },
    @Req() req,
  ) {
    return this.profileService.updateProfile(
      req.user.id,
      body,
      file?.filename,
    );
  }

  // ✅ GET /profile/me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    return this.profileService.getProfile(req.user.id);
  }
}
