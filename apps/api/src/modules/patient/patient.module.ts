import { Module } from '@nestjs/common';
import { DatabaseModule } from '@health-monorepo/database';
import { PatientsController } from './patient.controller';
import { PatientsService } from './patient.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
