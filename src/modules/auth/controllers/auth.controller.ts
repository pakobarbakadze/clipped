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
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/common/dto/user.dto';
import { User } from '../../user/entities/user.entity';
import { CurrentUser } from '../decorator/current-user.decorator';
import { RefreshTokenDto, SignInDto, SignUpDto } from '../dto';
import signOutDto from '../dto/sign-out.dto';
import { JwtAuthGuard, JwtRefreshTokenGuard, LocalAuthGuard } from '../guard';
import { AuthService } from '../services/auth.service';
import { SignInValidationPipe, SignUpValidatorPipe } from '../validation';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @UsePipes(new SignUpValidatorPipe())
  async signUp(@Body() signUpDto: SignUpDto): Promise<UserDto> {
    const user = await this.authService.signUp(signUpDto);
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @UsePipes(new SignInValidationPipe())
  @HttpCode(HttpStatus.OK)
  signIn(@CurrentUser() user: User, @Body() body: SignInDto) {
    return this.authService.signIn(user, body.deviceId);
  }

  @Post('sign-out')
  @UseGuards(JwtAuthGuard)
  invalidateToken(
    @Headers('authorization') authorization: string,
    @Body() body: signOutDto,
  ) {
    return this.authService.invalidateToken(authorization, body.deviceId);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return plainToClass(UserDto, req.user, { excludeExtraneousValues: true });
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
