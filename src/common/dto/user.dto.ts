import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  username: string;

  @Expose()
  role: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
