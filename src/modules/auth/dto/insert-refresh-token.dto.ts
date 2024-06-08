import { User } from 'src/modules/user/entities/user.entity';

export default class InsertRefreshTokenDto {
  user: User;
  deviceId?: string;
  token: string;
}
