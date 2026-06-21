import React, { useState } from 'react';

interface TimelineEvent {
  id: string;
  stage: string;
  title: string;
  date: string;
  status: 'completed' | 'active' | 'scheduled';
  description: string;
  deliverables: string[];
}

export default function EventTimeline() {
  const [selectedEventId, setSelectedEventId] = useState<string>('ev1');

  const roadmap: TimelineEvent[] = [
    {
      id: 'ev1',
      stage: 'Phase 01',
      title: 'Regional Logistics Audit & Asset Assembly',
      date: 'Sept - Nov 2025',
      status: 'completed',
      description: 'Reviewing current digital literacy resources and organizing Google Workspace asset nodes for regional deployment.',
      deliverables: ['12+ asset packages translated', '3 community partners certified', 'Excel-linked workflow sheets initiated']
    },
    {
      id: 'ev2',
      stage: 'Phase 02',
      title: 'Digital Design Systems Formulation',
      date: 'Dec - Feb 2026',
      status: 'completed',
      description: 'Designing highly accessible vector media assets aligning with local UNICEF guidelines for Southeast Asia.',
      deliverables: ['Custom visual slides pack', 'Lottie animation micro-grids', 'Accessibility contrast review audits']
    },
    {
      id: 'ev3',
      stage: 'Phase 03',
      title: 'Google Education Coach Session Series',
      date: 'March - May 2026',
      status: 'active',
      description: 'Rolling out live training workshops on advanced Excel, Google Forms automation, and analytics formulas.',
      deliverables: ['250+ trainees instruction logs', 'Self-graded formula worksheets', 'Direct certificate badge releases']
    },
    {
      id: 'ev4',
      stage: 'Phase 04',
      title: 'Cross-Border Initiative Handover',
      date: 'June - Aug 2026',
      status: 'scheduled',
      description: 'Transferring administrative control of content databases to local community directors to ensure perpetuity.',
      deliverables: ['Operations playbooks completed', 'Asset sandbox archive files', 'KPI tracking spreadsheet handover']
    }
  ];

  const activeEvent = roadmap.find(e => e.id === selectedEventId) || roadmap[0];

  return (
    <div className="w-full bg-slate-950/60 p-4 rounded-xl border border-white/5 font-sans animate-fade-in" id="event-timeline-widget">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
        <h4 className="text-sm font-semibold tracking-wide text-white font-mono uppercase">
          Campaign Deployment timeline
        </h4>
        <span className="text-[10px] font-mono text-gray-500">
          Interactive Operational Blueprint
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Side: Buttons Roadmap Timeline */}
        <div className="md:col-span-5 space-y-2 relative border-l border-white/5 pl-4 ml-2">
          {roadmap.map((evt) => {
            const isClick = evt.id === selectedEventId;
            return (
              <button
                key={evt.id}
                onClick={() => setSelectedEventId(evt.id)}
                className="w-full text-left relative group focus:outline-none"
              >
                {/* Visual marker dot */}
                <span className={`absolute -left-[21px] top-3.5 h-2 w-2 rounded-full border transition-all ${
                  isClick ? 'bg-brand-purple border-brand-purple ring-2 ring-purple-500/20' : 
                  evt.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-800 border-white/20'
                }`} />

                <div className={`p-2 rounded transition-all border ${
                  isClick ? 'bg-slate-900 border-white/10' : 'bg-transparent border-transparent hover:bg-white/5'
                }`}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-mono text-gray-500 font-semibold">{evt.stage}</span>
                    <span className="text-[9px] text-gray-400 font-mono">{evt.date}</span>
                  </div>
                  <h5 className={`text-xs font-semibold mt-0.5 truncate ${isClick ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                    {evt.title}
                  </h5>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Detail Box */}
        <div className="md:col-span-7 bg-slate-900/50 p-4 rounded-lg border border-white/5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase text-gray-400">Activity Report</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono border capitalize ${
                activeEvent.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                activeEvent.status === 'active' ? 'bg-brand-purple/10 border-brand-purple/30 text-brand-purple' :
                'bg-slate-700/10 border-white/10 text-gray-400'
              }`}>
                ● {activeEvent.status}
              </span>
            </div>

            <h4 className="text-sm font-semibold text-white tracking-tight leading-tight">
              {activeEvent.title}
            </h4>
            
            <p className="text-xs text-gray-400 leading-relaxed">
              {activeEvent.description}
            </p>
          </div>

          <div className="border-t border-white/5 pt-3 mt-4 space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-gray-400 block">Deliverables / Milestones Met</span>
            <ul className="text-xs font-mono grid grid-cols-1 gap-1">
              {activeEvent.deliverables.map((dl, dIdx) => (
                <li key={dIdx} className="flex items-center space-x-1.5 text-gray-300">
                  <span className="text-emerald-400 text-[10px]">✔</span>
                  <span>{dl}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
