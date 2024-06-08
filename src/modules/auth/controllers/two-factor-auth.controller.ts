import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthorizedRequest } from 'src/common/types/interface/request.interface';
import { VerifyTwoFactorAuthDto } from '../dto/verify-2fa.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { TwoFactorAuthService } from '../services/two-factor-auth.service';

@Controller('2fa')
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @Post('/enable')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  enableTwoFactorAuth(@Req() req: AuthorizedRequest) {
    return this.twoFactorAuthService.enableTwoFactorAuth(req.user);
  }

  @Post('/disable')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  disableTwoFactorAuth(@Req() req: AuthorizedRequest) {
    return this.twoFactorAuthService.disableTwoFactorAuth(req.user);
  }

  @Post('/verify')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  verifyTwoFactorAuth(
    @Req() req: AuthorizedRequest,
    @Body() verifyTwoFactorAuthDto: VerifyTwoFactorAuthDto,
  ) {
    return this.twoFactorAuthService.verifyTwoFactorAuth(
      req.user,
      verifyTwoFactorAuthDto,
    );
  }
}
