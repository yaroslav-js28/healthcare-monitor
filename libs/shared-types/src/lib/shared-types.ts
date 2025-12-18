export enum BiomarkerStatus {
  NORMAL = 'Normal',
  HIGH = 'High',
  LOW = 'Low',
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  lastVisit: string;
}

export interface Biomarker {
  id: string;
  patientId: string;
  name: string;
  value: number;
  unit: string;
  category: 'Metabolic' | 'Cardiovascular' | 'Hormonal';
  rangeMin: number;
  rangeMax: number;
  measuredAt: string;
  status: BiomarkerStatus;
}

export interface AiInsight {
  analysis: string;
  priority: 'low' | 'medium' | 'high';
  recommendations: string[];
}
