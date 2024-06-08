import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { User } from 'src/modules/user/entities/user.entity';

export class TypeOrmConfig {
  static async createTypeOrmOptions(
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      entities: [User, RefreshToken],
      synchronize: true,
      autoLoadEntities: true,
    };
  }
}
