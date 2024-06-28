import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../../common/dto/user.dto';
import { Role } from '../../common/types/enum/role.enum';
import { AuthorizedRequest } from '../../common/types/interface/request.interface';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../auth/guard';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { UserPasswordService, UserService } from './services';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userPasswordService: UserPasswordService,
  ) {}

  @Get(':username')
  async findOne(@Param('username') username: string): Promise<UserDto> {
    const user = await this.userService.findOne({ where: { username } });
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  @Patch('/role')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  assignRole(@Body() assingRoleDto: AssignRoleDto) {
    return this.userService.assignRole(assingRoleDto);
  }

  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @Req() request: AuthorizedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userPasswordService.changePassword(request, changePasswordDto);
  }

  @Patch('/change-user-password')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  changeUserPassword(@Body() changeUserPasswordDto: ChangeUserPasswordDto) {
    return this.userPasswordService.changeUserPassword(changeUserPasswordDto);
  }
}
