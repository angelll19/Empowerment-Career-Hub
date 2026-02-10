
import React from 'react';
import { ImpactProject } from '../types';

// Fix: Using ImpactProject instead of non-existent GrowthCircle type
export const GrowthCircleCard: React.FC<{ circle: ImpactProject }> = ({ circle }) => {
  // Fix: Calculate progress from milestones
  const progress = circle.milestones && circle.milestones.length > 0 
    ? Math.round((circle.milestones.filter(m => m.isCompleted).length / circle.milestones.length) * 100)
    : 0;

  return (
    <div className="glass-morphism p-5 rounded-3xl transition-all hover:scale-[1.02] hover:shadow-xl cursor-pointer border-transparent hover:border-teal-200 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold group-hover:text-teal-600 transition-colors">{circle.title}</h3>
        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-medium">
          {/* Fix: Using contributors instead of members to match ImpactProject interface */}
          {circle.contributors} Members
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Circle Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-teal-500 h-full rounded-full transition-all duration-1000" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {/* Fix: Using skills instead of tags to match ImpactProject interface */}
          {circle.skills.map(skill => (
            <span key={skill} className="text-[10px] bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded-md">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
