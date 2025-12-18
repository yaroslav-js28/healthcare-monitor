import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@health-monorepo/database/lib/prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async generateInsights(patientId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      include: { biomarkers: true },
    });

    if (!patient) throw new NotFoundException('Patient not found');

    const abnormal = patient.biomarkers.filter((b) => b.status !== 'Normal');

    if (abnormal.length === 0) {
      return `### ✅ Analysis Complete

**Summary:** Great news! All monitored biomarkers are within the reference range.

**Recommendation:** Continue with current lifestyle. Next checkup recommended in 12 months.`;
    }

    const categories = [...new Set(abnormal.map((b) => b.category))];
    const riskList = abnormal
      .map((b) => `- **${b.name}**: ${b.value} ${b.unit} (${b.status})`)
      .join('\n');

    return `### ⚠️ Clinical Attention Required

**Detected Risks:**
${riskList}

**Affected Systems:** ${categories.join(', ')}

**Monitoring Priorities:**
Based on the elevated values, we recommend re-testing **${abnormal[0].name}** within 30 days.

**Suggested Intervention:**
Review ${categories.includes('Metabolic') ? 'dietary glucose intake and exercise' : 'medication adherence'} and consult clinical guidelines.`;
  }
}
