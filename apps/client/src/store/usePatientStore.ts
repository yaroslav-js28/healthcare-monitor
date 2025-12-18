import { create } from 'zustand';

import { Patient, Biomarker } from "@health-monorepo/shared-types"

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  biomarkers: Biomarker[];
  activeCategory: string;
  loading: boolean;

  fetchPatients: () => Promise<void>;
  selectPatient: (patient: Patient) => Promise<void>;
  setCategory: (category: string) => void;
  getAIInsights: () => Promise<string>;
}

const API_URL = 'http://localhost:3000/api';

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  selectedPatient: null,
  biomarkers: [],
  activeCategory: 'All',
  loading: false,

  fetchPatients: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/patients`);
      const data = await res.json();
      set({ patients: data });
    } catch (error) {
      console.error('Failed to fetch patients', error);
    } finally {
      set({ loading: false });
    }
  },

  selectPatient: async (patient) => {
    set({ selectedPatient: patient, loading: true, activeCategory: 'All' });
    try {
      const res = await fetch(`${API_URL}/patients/${patient.id}/biomarkers`);
      const data = await res.json();
      set({ biomarkers: data });
    } catch (error) {
      console.error('Failed to fetch biomarkers', error);
    } finally {
      set({ loading: false });
    }
  },

  setCategory: (category) => set({ activeCategory: category }),

  getAIInsights: async () => {
    const { selectedPatient } = get();
    if (!selectedPatient) return "No patient selected.";

    try {
      const res = await fetch(`${API_URL}/ai/insights/${selectedPatient.id}`, {
        method: 'POST'
      });
      const data = await res.json();
      return data.content;
    } catch (error) {
      console.error("AI Error", error);
      return "Error: Could not retrieve AI analysis at this time.";
    }
  }
}));
