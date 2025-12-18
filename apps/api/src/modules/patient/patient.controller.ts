import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { PatientsService } from './patient.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async getPatients() {
    return this.patientsService.getAllPatients();
  }

  @Get(':id/biomarkers')
  async getPatientBiomarkers(
    @Param('id') id: string,
    @Query('category') category?: string,
  ) {
    const biomarkers = await this.patientsService.getBiomarkers(id, category);

    if (!biomarkers) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return biomarkers;
  }
}
