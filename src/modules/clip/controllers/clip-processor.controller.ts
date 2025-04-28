import { Controller, Post, UseGuards } from '@nestjs/common';
import { ClipProcessorService } from '../services/clip-processor.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guard';

@ApiTags('clip-processor')
@Controller('clip-processor')
export class ClipProcessorController {
  constructor(private readonly clipProcessorService: ClipProcessorService) {}

  @Post('start')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Start processing clips from SQS queue' })
  async startProcessing() {
    await this.clipProcessorService.startProcessing();
    return { message: 'Clip processing started' };
  }

  @Post('stop')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Stop processing clips' })
  async stopProcessing() {
    this.clipProcessorService.stopProcessing();
    return { message: 'Clip processing stopped' };
  }
}
