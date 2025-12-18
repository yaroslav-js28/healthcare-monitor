import React, { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { usePatientStore } from '../../store/usePatientStore';
import BiomarkerChart from '../BiomarkerChart';

const STATUS_COLORS = {
  Normal: 'bg-green-100 text-green-700 ring-green-600/20',
  High: 'bg-red-100 text-red-700 ring-red-600/10',
  Low: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
};

const PatientDetail = () => {
  const {
    selectedPatient,
    biomarkers,
    activeCategory,
    setCategory,
    getAIInsights,
  } = usePatientStore();
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  if (!selectedPatient) {
    return (
      <div className="w-2/3 h-screen flex items-center justify-center bg-slate-50 text-slate-400">
        Select a patient to begin
      </div>
    );
  }

  const categories = [
    'All',
    ...Array.from(new Set(biomarkers.map((b) => b.category))),
  ];
  const filteredBiomarkers =
    activeCategory === 'All'
      ? biomarkers
      : biomarkers.filter((b) => b.category === activeCategory);

  const handleAiClick = async () => {
    setLoadingAi(true);
    setAiInsight('');
    const insight = await getAIInsights();
    setAiInsight(insight);
    setLoadingAi(false);
  };

  return (
    <div className="w-2/3 bg-slate-50 h-screen overflow-y-auto p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {selectedPatient.name}
          </h1>
          <p className="text-slate-500 mt-1">
            Last Visit:{' '}
            {new Date(selectedPatient.lastVisit).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleAiClick}
          disabled={loadingAi}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all disabled:opacity-50"
        >
          <SparklesIcon className="h-5 w-5" />
          {loadingAi ? 'Analyzing...' : 'Get AI Insights'}
        </button>
      </div>

      {aiInsight && (
        <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900 text-sm leading-relaxed animate-fade-in">
          <strong className="block mb-1 font-semibold">🤖 AI Analysis:</strong>
          {aiInsight}
        </div>
      )}

      <div className="mb-8">
        <BiomarkerChart data={filteredBiomarkers} />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Biomarker
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Result
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Ref Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredBiomarkers.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {b.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  <span className="font-semibold">{b.value}</span>{' '}
                  <span className="text-slate-500 text-xs">{b.unit}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {b.rangeMin} - {b.rangeMax}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientDetail;
