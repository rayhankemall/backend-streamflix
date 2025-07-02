import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProfileService } from './profile.service';
import { extname } from 'path';
import { Request as ExpressRequest } from 'express';

// Tambahkan typing agar req.user.id tidak error
interface UserRequest extends ExpressRequest {
  user: {
    id: string;
    username: string;
    email: string;
  };
}

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: UserRequest) {
    return this.profileService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile',
        filename: (req: ExpressRequest, file, cb) => {
          // Cast agar bisa akses req.user.id
          const userReq = req as UserRequest;
          const ext = extname(file.originalname);
          const uniqueSuffix = Date.now();
          cb(null, `${userReq.user.id}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: UserRequest,
  ) {
    return this.profileService.updateProfilePicture(req.user.id, file.filename);
  }
}
