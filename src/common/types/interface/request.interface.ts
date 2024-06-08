import { User } from 'src/modules/user/entities/user.entity';

export interface AuthorizedRequest extends Request {
  user: User;
}
