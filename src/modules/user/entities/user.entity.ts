import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import Model from 'src/common/entities/model.entity';
import { Role } from 'src/common/types/enum/role.enum';
import { BeforeInsert, Column, Entity } from 'typeorm';

@Entity('users')
export class User extends Model {
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Exclude()
  @Column({ nullable: true })
  twoFactorSecret: string;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @BeforeInsert()
  async hashPass() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
