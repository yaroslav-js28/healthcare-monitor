import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@health-monorepo/database';
import { PatientsModule } from '../modules/patient/patient.module';
import { AiModule } from '../modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    PatientsModule,
    AiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
