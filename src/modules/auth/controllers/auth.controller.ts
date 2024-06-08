import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { CurrentUser } from '../decorator/current-user.decorator';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import SignInDto from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { JwtRefreshTokenGuard } from '../guard/jwt-refresh.guard';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { SignUpValidatorPipe } from '../validation/sign-up.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @UsePipes(new SignUpValidatorPipe())
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  signIn(@CurrentUser() user: User, @Body() body: SignInDto) {
    return this.authService.signIn(user, body.deviceId);
  }

  @Post('sign-out')
  @UseGuards(JwtAuthGuard)
  invalidateToken(@Headers('authorization') authorization: string) {
    return this.authService.invalidateToken(authorization);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshTokenGuard)
  refreshToken(
    @Headers('authorization') authorization: string,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.refreshAccessToken(authorization, refreshTokenDto);
  }
}
