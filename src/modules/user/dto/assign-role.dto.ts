import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/types/enum/role.enum';

export class AssignRoleDto {
  @ApiProperty({ description: 'Username', required: true })
  username: string;

  @ApiProperty({ description: 'Role', required: true, enum: Role })
  role: Role;
}
