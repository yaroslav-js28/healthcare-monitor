import { Controller, Post, Param } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('insights/:patientId')
  async getInsights(@Param('patientId') patientId: string) {
    const analysis = await this.aiService.generateInsights(patientId);
    await new Promise(r => setTimeout(r, 1500));
    return { content: analysis };
  }
}
