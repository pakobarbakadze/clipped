import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard';
import { ClipsService } from '../services/clip.service';
import { AuthorizedRequest } from '../../../common/types/interface/request.interface';
import { CreateClipDto } from '../dto/create-clip.dto';

@ApiTags('clip')
@Controller('clip')
export class ClipController {
  constructor(private readonly clipsService: ClipsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('video'))
  async createClip(
    @Req() request: AuthorizedRequest,
    @Body() createClipDto: CreateClipDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50000000 }), // 50MB
          new FileTypeValidator({ fileType: 'video' }),
        ],
      }),
    )
    video: Express.Multer.File,
  ) {
    return this.clipsService.createClip(
      createClipDto.title,
      request.user.username,
      video.buffer,
      video.originalname,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getClip(@Param('id') id: string, @Res() res: Response) {
    const result = await this.clipsService.getClip(id);

    res.set({
      'Content-Type': 'video/mp4',
      'Content-Disposition': `attachment; filename="${result.metadata.title}.mp4"`,
    });

    result.videoStream.pipe(res);
  }

  @Get('user/:username')
  @UseGuards(JwtAuthGuard)
  async getUserClips(@Param('username') username: string) {
    return this.clipsService.getUserClips(username);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteClip(@Param('id') id: string) {
    await this.clipsService.deleteClip(id);
    return { message: 'Clip deleted successfully' };
  }
}
