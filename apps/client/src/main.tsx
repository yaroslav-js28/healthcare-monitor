import React from 'react';
import PatientDetail from './components/PatientDetail';
import PatientList from './components/PatientList';

export function App() {
  return (
    <div className="flex h-screen bg-white">
      <PatientList />
      <PatientDetail />
    </div>
  );
}

export default App;
