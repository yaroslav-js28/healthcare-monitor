import React, { useEffect } from 'react';
import { usePatientStore } from '../../store/usePatientStore';

const PatientList = () => {
  const { patients, fetchPatients, selectPatient, selectedPatient } =
    usePatientStore();

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="w-1/3 bg-white border-r border-slate-200 h-screen overflow-y-auto">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">Patients</h2>
        <p className="text-sm text-slate-500">Select a patient to view data</p>
      </div>
      <ul>
        {patients.map((patient) => (
          <li
            key={patient.id}
            onClick={() => selectPatient(patient)}
            className={`p-4 cursor-pointer hover:bg-slate-50 border-b border-slate-100 transition-colors ${
              selectedPatient?.id === patient.id
                ? 'bg-blue-50 border-l-4 border-l-blue-500'
                : ''
            }`}
          >
            <div className="font-medium text-slate-900">{patient.name}</div>
            <div className="text-xs text-slate-500 mt-1">
              DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientList;
