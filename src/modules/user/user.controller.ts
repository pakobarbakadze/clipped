import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userPasswordService: UserPasswordService,
  ) {}

  @Get(':username')
  async findOne(@Param('username') username: string): Promise<UserDto> {
    const user = await this.userService.findOne({ username });
    return new UserDto(user);
  }

  @Patch('/role')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async assignRole(@Body() assingRoleDto: AssignRoleDto) {
    const user = await this.userService.assignRole(assingRoleDto);
    return new UserDto(user);
  }

  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() request: AuthorizedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.userPasswordService.changePassword(
      request,
      changePasswordDto,
    );
    return new UserDto(user);
  }

  @Patch('/change-user-password')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async changeUserPassword(
    @Body() changeUserPasswordDto: ChangeUserPasswordDto,
  ) {
    const user = await this.userPasswordService.changeUserPassword(
      changeUserPasswordDto,
    );
    return new UserDto(user);
  }
}
