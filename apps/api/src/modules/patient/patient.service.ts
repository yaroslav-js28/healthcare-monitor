import { Injectable } from '@nestjs/common';
import { PrismaService } from '@health-monorepo/database/lib/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async getAllPatients() {
    return this.prisma.patient.findMany({
      select: {
        id: true,
        name: true,
        dateOfBirth: true,
        lastVisit: true,
      },
      orderBy: {
        lastVisit: 'desc',
      },
    });
  }

  async getBiomarkers(patientId: string, category?: string) {
    const patientExists = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patientExists) {
      return null;
    }

    return this.prisma.biomarker.findMany({
      where: {
        patientId: patientId,
        ...(category ? { category: category } : {}),
      },
      orderBy: {
        measuredAt: 'desc',
      },
    });
  }
}
