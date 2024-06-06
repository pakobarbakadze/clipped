import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), FileModule],
})
export class AppModule {}
