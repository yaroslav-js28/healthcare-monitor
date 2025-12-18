import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const BiomarkerChart = ({ data }: { data: any[] }) => {
  return (
    <div className="h-64 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-500 mb-4">
        Biomarker Analysis
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
          <YAxis />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                return (
                  <div className="bg-white p-2 border border-slate-200 shadow-lg rounded text-xs">
                    <p className="font-bold">{d.name}</p>
                    <p>
                      Value: {d.value} {d.unit}
                    </p>
                    <p className="text-slate-500">
                      Range: {d.rangeMin} - {d.rangeMax}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.status === 'Normal'
                    ? '#10b981'
                    : entry.status === 'High'
                      ? '#ef4444'
                      : '#f59e0b'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BiomarkerChart;
