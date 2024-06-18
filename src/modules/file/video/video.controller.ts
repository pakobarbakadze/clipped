import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { VideoService } from './video.service';

@ApiTags('video')
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50000000 }),
          new FileTypeValidator({ fileType: 'video' }),
        ],
      }),
    )
    video: Express.Multer.File,
  ) {
    await this.videoService.uploadVideo(video.buffer, video.originalname);
    return { message: 'Video uploaded successfully' };
  }

  @Get('download')
  async downloadVideo(@Body('fileName') fileName: string) {
    return this.videoService.downloadVideo(fileName);
  }
}
