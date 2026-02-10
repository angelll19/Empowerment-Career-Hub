
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, UserRole, ImpactProject, ALL_PROJECTS } from '../types';

interface Props {
  user: UserProfile;
  onOpenPod: (id: string) => void;
  savedProjectIds: string[];
  onRemoveSaved: (id: string) => void;
}

// Mocked participants for visual richness
const MOCK_PARTICIPANTS = [
  { name: 'Sarah L.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
  { name: 'Amina B.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amina' },
  { name: 'Chloe S.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chloe' },
  { name: 'Jessica W.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica' },
];

export const Dashboard: React.FC<Props> = ({ user, onOpenPod, savedProjectIds, onRemoveSaved }) => {
  const isMentor = user.role === UserRole.MENTOR;
  const [swipedIndices, setSwipedIndices] = useState<Set<number>>(new Set());

  const handleSwipe = (index: number) => {
    setSwipedIndices(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const visibleCircles = ALL_PROJECTS.filter((_, i) => !swipedIndices.has(i));
  const savedProjects = ALL_PROJECTS.filter(p => savedProjectIds.includes(p.id));

  return (
    <div className="max-w-full mx-auto space-y-12 animate-in fade-in duration-1000 pb-20 no-scrollbar">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 px-4 md:px-0">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 bg-${isMentor ? 'cyan' : 'violet'}-400/10 text-${isMentor ? 'cyan' : 'violet'}-400 text-[10px] font-black uppercase tracking-widest border border-${isMentor ? 'cyan' : 'violet'}-400/20 rounded-xl backdrop-blur-md`}>
              {isMentor ? 'Empowerment Arena' : 'Growth Lounge'}
            </span>
            <span className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">Trajectory: {isMentor ? 'Impact Lead' : 'Rising Talent'}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight">
            Welcome {user.name.split(' ')[0]}!
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl leading-relaxed italic">
            {isMentor 
              ? `You have the power to guide. New collaborative requests are arriving in the Studio.`
              : `Your career journey starts here. Explore Growth Circles to build your verified portfolio.`}
          </p>
        </div>
        
        <div className="flex gap-4">
           <motion.div whileHover={{ y: -5, scale: 1.02 }} className="glass-card px-8 py-6 rounded-[2.5rem] border-l-4 border-l-cyan-400 min-w-[200px] shadow-2xl transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
                {isMentor ? 'Mentees Guided' : 'Total Earned'}
              </span>
              <span className="text-4xl font-black text-white tabular-nums">
                {isMentor ? '08' : `$${user.totalEarned || 450}`}
              </span>
           </motion.div>
           <motion.div whileHover={{ y: -5, scale: 1.02 }} className="glass-card px-8 py-6 rounded-[2.5rem] border-l-4 border-l-violet-500 min-w-[200px] shadow-2xl transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Impact Points</span>
              <span className="text-4xl font-black text-white tabular-nums">{user.growthScore}</span>
           </motion.div>
        </div>
      </header>

      {/* Saved Opportunities Section */}
      <AnimatePresence>
        {savedProjects.length > 0 && (
          <motion.section 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-6 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 md:px-0">
              <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
                <span className="w-12 h-12 rounded-[1.5rem] bg-violet-500/10 text-violet-400 flex items-center justify-center text-xl shadow-inner">🔖</span>
                Saved Trajectories
              </h2>
              <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">{savedProjects.length} Bookmarked</span>
            </div>
            
            <div className="flex overflow-x-auto gap-6 pb-4 px-4 md:px-0 no-scrollbar">
              {savedProjects.map(project => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="flex-shrink-0 w-[320px] glass-card p-6 rounded-[2.5rem] border-white/5 space-y-4 hover:border-violet-500/30 transition-all relative group shadow-2xl"
                >
                  <button 
                    onClick={() => onRemoveSaved(project.id)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                  <div className="space-y-1">
                    <h4 className="font-black text-white truncate pr-6">{project.title}</h4>
                    <p className="text-[10px] text-violet-400 uppercase font-black tracking-widest">{project.mentorName} • {project.sponsorship}</p>
                  </div>
                  <div className="flex -space-x-2">
                    {MOCK_PARTICIPANTS.slice(0, 3).map((p, i) => (
                      <div key={i} className="relative group/avatar">
                        <img src={p.avatar} className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" title={p.name} />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 italic font-medium">"{project.description}"</p>
                  <button 
                    onClick={() => onOpenPod(project.id)}
                    className="w-full py-3 bg-violet-500/20 text-violet-400 border border-violet-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all shadow-lg"
                  >
                    Launch Journey
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main Learning Circles Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4 md:px-0">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
            <span className="w-12 h-12 rounded-[1.5rem] bg-white/5 text-cyan-400 flex items-center justify-center text-xl shadow-inner">🚀</span>
            Growth Circle Pods
          </h2>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Matching Engine Active</span>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-8 pb-10 px-4 md:px-0 no-scrollbar snap-x cursor-grab active:cursor-grabbing">
          {visibleCircles.map((circle, idx) => (
            <motion.div 
              key={circle.id}
              whileHover={{ y: -10, scale: 1.02, boxShadow: "0 0 50px rgba(6,182,212,0.1)" }}
              onClick={() => onOpenPod(circle.id)}
              className="flex-shrink-0 w-[380px] md:w-[500px] glass-card p-10 rounded-[4rem] border border-white/5 transition-all cursor-pointer group shadow-2xl overflow-hidden snap-center relative"
            >
              <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl group-hover:bg-cyan-400/10 transition-colors" />
              <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 backdrop-blur-md">
                      {circle.sponsorship}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        {MOCK_PARTICIPANTS.map((p, i) => (
                          <img key={i} src={p.avatar} className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" />
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">+{circle.contributors} Leaders</span>
                    </div>
                  </div>
                  <h3 className="text-4xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tighter leading-tight">{circle.title}</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-lg">🧠</div>
                    <p className="text-slate-400 text-lg font-medium italic">Empowerment Lead: {circle.mentorName}</p>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">"{circle.description}"</p>
                </div>
                
                <div className="space-y-6 border-t border-white/5 pt-6">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Collective Momentum</span>
                    <span className="text-sm font-black text-cyan-400">72%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '72%' }}
                       className="h-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
                     />
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSwipe(ALL_PROJECTS.indexOf(circle)); }}
                      className="flex-1 py-5 bg-white/5 text-slate-400 border border-white/10 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                      Archive
                    </button>
                    <button className="flex-[2] py-5 bg-white text-slate-950 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest group-hover:scale-105 transition-all shadow-xl">
                      Enter Workspace
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 px-4 md:px-0">
          <div className="xl:col-span-2 glass-card p-10 rounded-[4.5rem] space-y-8 bg-slate-900/40 border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex justify-between items-center relative z-10">
                <h3 className="text-2xl font-black text-white italic tracking-tighter">Impact Feed</h3>
                <span className="px-4 py-1 bg-green-500/10 text-green-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-500/20">Live System</span>
              </div>
              <div className="space-y-6 relative z-10">
                {[
                  { name: 'Dr. Sarah Lin', action: 'mentored 3 leaders', pod: 'Carbon AI', color: 'cyan', icon: '🏆' },
                  { name: 'Chloe S.', action: 'completed neural scan', pod: 'Wellness Bot', color: 'violet', icon: '💎' },
                  { name: 'Rachel G.', action: 'verified outcome', pod: 'Mindful Hub', color: 'green', icon: '🤝' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start pb-6 border-b border-white/5 last:border-0 last:pb-0 group cursor-default hover:bg-white/5 p-4 rounded-3xl transition-all">
                    <div className={`w-14 h-14 rounded-[1.5rem] bg-${item.color}-400/10 flex-shrink-0 border border-${item.color}-400/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-300 leading-snug">
                        <span className="text-white font-black">{item.name}</span> {item.action} in <span className={`text-${item.color}-400 font-black`}>{item.pod}</span>
                      </p>
                      <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">Just now</p>
                    </div>
                  </div>
                ))}
              </div>
          </div>

          <div className="glass-card p-10 rounded-[4.5rem] space-y-10 border-white/5 shadow-2xl">
              <h3 className="text-2xl font-black text-white tracking-tight">Skill Story Map</h3>
              <div className="space-y-8">
                {user.skills.map(skill => (
                  <div key={skill.name} className="space-y-4 group">
                    <div className="flex justify-between items-center px-2">
                      <span className="text-[11px] font-black uppercase text-slate-500 tracking-[0.3em] group-hover:text-white transition-colors">{skill.name}</span>
                      <span className="text-xs font-black text-white tabular-nums">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                       <motion.div 
                         initial={{ width: 0 }} 
                         animate={{ width: `${skill.level}%` }} 
                         transition={{ duration: 1.5, ease: "easeOut" }}
                         className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                       />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-6 bg-white/5 border border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 text-white transition-all shadow-xl">Detailed Analytics</button>
           </div>
      </div>
    </div>
  );
};
