
import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ImpactProject, ALL_PROJECTS } from '../types';

interface Props {
  onProjectJoined: (projectId: string) => void;
  onProjectSaved: (projectId: string) => void;
}

export const ProjectSwiperView: React.FC<Props> = ({ onProjectJoined, onProjectSaved }) => {
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-25, 25]);
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0]);
  const scale = useTransform(y, [0, 250], [1, 0.8]);
  const cardY = useTransform(y, [0, 250], [0, 500]);

  const currentProject = ALL_PROJECTS[index % ALL_PROJECTS.length];

  const handleDragEnd = (_: any, info: any) => {
    // Horizontal swipe logic
    if (Math.abs(info.offset.x) > 150) {
      if (info.offset.x > 0) {
        onProjectJoined(currentProject.id);
      } else {
        setIndex(prev => prev + 1);
      }
    } 
    // Vertical swipe down logic for saving
    else if (info.offset.y > 150) {
      onProjectSaved(currentProject.id);
      setIndex(prev => prev + 1);
    }
    // Reset values in case of small drag
    x.set(0);
    y.set(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] py-10 overflow-hidden relative">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-6xl font-black tracking-tighter text-white">Project Discovery</h2>
        <p className="text-slate-400 font-medium italic">
          Swipe right to <span className="text-cyan-400">Join</span>, left to <span className="text-slate-500">Skip</span>, or down to <span className="text-violet-400">Save for Later</span>.
        </p>
      </div>

      <div className="relative w-full max-w-[420px] aspect-[3/4.5] px-4">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentProject.id}
            style={{ x, y: cardY, rotate, opacity, scale }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            whileDrag={{ cursor: 'grabbing' }}
            initial={{ scale: 0.85, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ 
              x: x.get() !== 0 ? (x.get() > 0 ? 800 : -800) : 0, 
              y: y.get() > 0 ? 800 : 0,
              opacity: 0, 
              rotate: x.get() !== 0 ? (x.get() > 0 ? 45 : -45) : 0 
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="absolute inset-0 glass-card rounded-[4.5rem] p-12 cursor-grab border-2 border-white/5 flex flex-col shadow-2xl overflow-hidden group hover:border-cyan-400/50 transition-all duration-500"
          >
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/10 transition-colors" />

            <div className="flex-1 flex flex-col justify-between relative z-10">
              <div className="space-y-10">
                <div className="w-24 h-24 rounded-[2rem] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 group-hover:glow-cyan transition-all duration-500">
                  {index % 3 === 0 ? '🌍' : index % 3 === 1 ? '💊' : '🤖'}
                </div>
                <div className="space-y-4">
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-cyan-400">Led by {currentProject.mentorName}</span>
                  <h3 className="text-5xl font-black leading-none text-white group-hover:text-cyan-400 transition-colors duration-500 tracking-tighter">{currentProject.title}</h3>
                </div>
                <p className="text-slate-400 text-lg leading-relaxed font-medium italic line-clamp-4">"{currentProject.description}"</p>
              </div>
              
              <div className="space-y-8 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Trajectory Status</span>
                  <span className="text-sm font-black text-cyan-400 tabular-nums uppercase">{currentProject.sponsorship}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {currentProject.skills.map(s => (
                    <span key={s} className="bg-white/5 border border-white/10 text-slate-300 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:border-cyan-400/30 transition-colors">{s}</span>
                  ))}
                </div>
                <div className="flex gap-4 pt-4">
                   <button onClick={() => setIndex(prev => prev + 1)} className="flex-1 flex items-center justify-center h-20 rounded-[2rem] bg-white/5 border border-white/10 text-slate-600 font-black text-[10px] uppercase tracking-[0.5em] hover:bg-white/10 transition-all">Skip</button>
                   <button onClick={() => onProjectJoined(currentProject.id)} className="flex-1 flex items-center justify-center h-20 rounded-[2rem] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-black text-[10px] uppercase tracking-[0.5em] glow-cyan group-hover:scale-105 transition-transform">Join</button>
                </div>
              </div>
            </div>
            
            {/* Visual indicator for vertical swipe */}
            <motion.div 
              style={{ opacity: useTransform(y, [50, 150], [0, 1]) }}
              className="absolute inset-0 bg-violet-600/20 flex items-center justify-center pointer-events-none"
            >
              <div className="text-white font-black uppercase tracking-[0.5em] text-xl">Save for Later</div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-24 flex gap-12 items-center">
         <motion.button 
          whileHover={{ scale: 1.1, rotate: -10 }} 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIndex(prev => prev + 1)}
          className="w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center text-slate-500 font-black text-2xl group transition-all shadow-xl hover:border-white/30"
         >
           ✕
         </motion.button>
         <motion.button 
          whileHover={{ scale: 1.1, y: 10 }} 
          whileTap={{ scale: 0.9 }}
          onClick={() => { onProjectSaved(currentProject.id); setIndex(prev => prev + 1); }}
          className="px-10 h-20 rounded-[2rem] border-2 border-violet-500/30 flex items-center justify-center text-violet-400 font-black text-sm uppercase tracking-widest shadow-xl shadow-violet-500/10 hover:bg-violet-500 hover:text-white transition-all"
         >
           Save for Later
         </motion.button>
         <motion.button 
          whileHover={{ scale: 1.1, rotate: 10 }} 
          whileTap={{ scale: 0.9 }}
          onClick={() => onProjectJoined(currentProject.id)}
          className="w-20 h-20 rounded-full border-2 border-cyan-400/30 flex items-center justify-center text-cyan-400 font-black text-2xl shadow-2xl shadow-cyan-500/10 hover:glow-cyan hover:bg-cyan-400 hover:text-slate-950 transition-all"
         >
           ♥
         </motion.button>
      </div>
    </div>
  );
};
