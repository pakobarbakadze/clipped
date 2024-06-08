import Model from 'src/common/entities/model.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('refresh-tokens')
export class RefreshToken extends Model {
  @Column({ unique: true, nullable: true })
  deviceId: string;

  @Column({ unique: true })
  refreshToken: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
