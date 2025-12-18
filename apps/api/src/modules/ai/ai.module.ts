import { Module } from '@nestjs/common';
import { DatabaseModule } from '@health-monorepo/database';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
