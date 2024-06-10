import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  username: string;

  @Expose()
  password: string;

  @Expose()
  role: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
