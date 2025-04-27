import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/db';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { UserModule } from './modules/user/user.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ClipModule } from './modules/clip/clip.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        TypeOrmConfig.createTypeOrmOptions(configService),
      inject: [ConfigService],
    }),
    PrometheusModule.register(),
    AuthModule,
    UserModule,
    FileModule,
    ClipModule,
  ],
})
export class AppModule {}
