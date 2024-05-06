import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './modules/aws/aws.module';
import { VideoModule } from './modules/video/video.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), VideoModule, AwsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
