import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('save')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const unique = Date.now() + extname(file.originalname);
          cb(null, unique);
        },
      }),
    }),
  )
  async uploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { fullName: string; gmail: string },
  ) {
    console.log('Received body:', body);
    console.log('Received file:', file);

    const profile = await this.profileService.create({
      fullName: body.fullName,
      gmail: body.gmail,
      photo: file?.filename,
    });

    return { success: true, profile };
  }
}
