
import React, { useState } from 'react';
import { ImpactProject } from '../types';
import confetti from 'https://esm.sh/canvas-confetti@1.9.3';

interface Props {
  project: ImpactProject;
  userAvatar: string;
}

export const ImpactProjectCard: React.FC<Props> = ({ project, userAvatar }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsCompleted(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#4fd1c5', '#9f7aea', '#ffffff', '#fbbf24']
      });
    }, 1800);
  };

  const completedCount = project.milestones.filter(m => m.isCompleted).length;
  const progressPercent = Math.round((completedCount / project.milestones.length) * 100);

  return (
    <div className="bg-white p-7 rounded-[2rem] space-y-5 hover:shadow-2xl hover:shadow-teal-500/5 transition-all duration-300 border border-slate-100 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
              Lead by {project.mentorName}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
              {project.partnerName} Partner
            </span>
          </div>
          <h3 className="font-bold text-xl text-slate-900 group-hover:text-teal-600 transition-colors">{project.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed max-w-lg">{project.description}</p>
        </div>
        <div className="flex -space-x-3">
          <img src={userAvatar} className="w-10 h-10 rounded-xl border-4 border-white object-cover shadow-sm" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="w-10 h-10 rounded-xl border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
              +{Math.floor(Math.random() * 20)}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-end">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Impact Trajectory</span>
           <span className="text-xs font-black text-teal-600">{progressPercent}% Journey Complete</span>
        </div>
        <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
           <div 
             className="h-full gradient-teal-purple rounded-full transition-all duration-1000 ease-out"
             style={{ width: `${progressPercent}%` }}
           ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 py-4 border-y border-slate-50">
        <div className="space-y-1">
          <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Global Impact</p>
          <p className="text-sm font-bold text-slate-800">{project.impact}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Skill Stack</p>
          <div className="flex flex-wrap gap-1">
            {project.skills.slice(0, 2).map(s => (
              <span key={s} className="text-[10px] font-bold text-purple-600">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 relative z-10">
        <div className="text-xs font-bold text-slate-400">
          <span className="text-teal-500">Execution Mode</span> • {project.contributors} Pod Members
        </div>
        <button 
          onClick={handleVerify}
          disabled={isVerifying || isCompleted}
          className={`px-8 py-3 rounded-2xl text-sm font-black transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 ${
            isCompleted 
              ? 'bg-green-500 text-white shadow-green-500/20' 
              : 'gradient-teal-purple text-white shadow-teal-500/20 disabled:opacity-50'
          }`}
        >
          {isVerifying ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Validating...
            </span>
          ) : isCompleted ? (
            '✓ Portfolio Added'
          ) : (
            'Verify Milestone'
          )}
        </button>
      </div>
    </div>
  );
};
