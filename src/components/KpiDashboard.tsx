import React, { useState } from 'react';

type StoreChoice = 'all' | 'noon' | 'amazon';

export default function KpiDashboard() {
  const [activeStore, setActiveStore] = useState<StoreChoice>('all');
  const [metricUnit, setMetricUnit] = useState<'AED' | 'USD'>('AED');

  // Realistic simulated data for rendering beautiful charts via pure SVG
  const storeData: Record<StoreChoice, {
    revenue: string;
    acos: string;
    conversions: string;
    conversionRate: string;
    chartPoints: number[];
  }> = {
    all: {
      revenue: '184,500',
      acos: '18.4%',
      conversions: '3,120',
      conversionRate: '12.8%',
      chartPoints: [20, 45, 30, 85, 60, 110, 95, 140, 125, 170]
    },
    noon: {
      revenue: '112,000',
      acos: '15.2%',
      conversions: '1,940',
      conversionRate: '14.2%',
      chartPoints: [15, 25, 45, 35, 75, 65, 90, 80, 115, 110]
    },
    amazon: {
      revenue: '72,500',
      acos: '22.8%',
      conversions: '1,180',
      conversionRate: '10.8%',
      chartPoints: [10, 35, 20, 55, 45, 80, 60, 95, 85, 105]
    }
  };

  const current = storeData[activeStore];

  // Helper to generate SVG polyline path based on array points
  const generatePath = (points: number[]) => {
    return points.map((p, idx) => `${idx * 30 + 10},${130 - p}`).join(' ');
  };

  // Switch region helper
  const handleStoreSelect = (choice: StoreChoice) => {
    setActiveStore(choice);
    setMetricUnit(choice === 'amazon' ? 'USD' : 'AED');
  };

  return (
    <div className="w-full bg-slate-950/60 p-4 rounded-xl border border-white/5 font-sans" id="kpi-dashboard-widget">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-white/5">
        <h4 className="text-sm font-semibold tracking-wide text-white font-mono uppercase">
          Growth KPI Performance Tracker
        </h4>
        <div className="flex bg-slate-900 rounded p-0.5 border border-white/5">
          {(['all', 'noon', 'amazon'] as StoreChoice[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleStoreSelect(tab)}
              className={`px-2 py-1 rounded text-[10px] font-mono leading-none tracking-tight transition-all capitalize font-semibold ${
                activeStore === tab ? 'bg-brand-purple text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Channels' : tab === 'noon' ? 'Noon GCC (FMCG)' : 'Amazon USA (Skincare)'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        <div className="bg-slate-900/60 p-2.5 rounded border border-white/5 space-y-1">
          <span className="text-[10px] text-gray-500 font-mono inline-block">Total Revenue ({metricUnit})</span>
          <div className="text-lg font-bold font-mono text-brand-purple">
            {metricUnit === 'USD' ? '$' : ''}{current.revenue}{metricUnit === 'AED' ? ' DHS' : ''}
          </div>
        </div>

        <div className="bg-slate-900/60 p-2.5 rounded border border-white/5 space-y-1">
          <span className="text-[10px] text-gray-500 font-mono inline-block">Average ACoS</span>
          <div className="text-lg font-bold font-mono text-emerald-400">{current.acos}</div>
        </div>

        <div className="bg-slate-900/60 p-2.5 rounded border border-white/5 space-y-1">
          <span className="text-[10px] text-gray-500 font-mono inline-block">Total Conversions</span>
          <div className="text-lg font-bold font-mono text-white">{current.conversions} U.</div>
        </div>

        <div className="bg-slate-900/60 p-2.5 rounded border border-white/5 space-y-1">
          <span className="text-[10px] text-gray-500 font-mono inline-block">Organic Conv %</span>
          <div className="text-lg font-bold font-mono text-emerald-400">{current.conversionRate}</div>
        </div>
      </div>

      {/* SVG Chart area */}
      <div className="bg-slate-900/40 p-3 rounded-lg border border-white/5 relative h-[140px] flex items-end">
        <span className="absolute left-2 top-2 text-[9px] font-mono text-gray-500">Revenue Growth Sparkline (Simulated 90-day trajectory)</span>
        
        {/* Draw chart paths using custom responsive mapping */}
        <svg className="w-full h-[110px]" viewBox="0 0 290 130" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(249, 115, 22, 0.4)" />
              <stop offset="100%" stopColor="rgba(249, 115, 22, 0.0)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="10" y1="20" x2="280" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="10" y1="65" x2="280" y2="65" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="10" y1="110" x2="280" y2="110" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2,2" />

          {/* Area under curve */}
          <polygon
            points={`10,130 ${generatePath(current.chartPoints)} 280,130`}
            fill="url(#chart-area-grad)"
          />

          {/* Sparkline curve */}
          <polyline
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
            points={generatePath(current.chartPoints)}
          />

          {/* Point indicator */}
          <circle cx="280" cy={130 - current.chartPoints[current.chartPoints.length - 1]} r="4" fill="#10b981" />
        </svg>
      </div>

      <div className="flex justify-between items-center mt-3 text-[10px] text-gray-500 font-mono">
        <span>Q1 Initial Baseline</span>
        <span className="text-emerald-400">Peak Q2 Launch (Optimized) ▲</span>
      </div>
    </div>
  );
}
