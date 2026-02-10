
import React from 'react';
import { UserProfile } from '../types';

export const Header: React.FC<{ user: UserProfile, onOpenAssistant: () => void }> = ({ user, onOpenAssistant }) => {
  return (
    <header className="h-20 bg-slate-900/30 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Execution Layer</span>
        <span className="text-white/10">|</span>
        <span className="font-black text-white tracking-tight">System Status: Active</span>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={onOpenAssistant}
          className="flex items-center gap-3 px-6 py-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full text-xs font-black uppercase tracking-widest hover:bg-violet-500/20 transition-all shadow-lg shadow-violet-500/5"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          Live Assistant
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-white/5">
          <div className="text-right">
            <p className="text-xs font-black text-white">{user.name}</p>
            <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">{user.role}</p>
          </div>
          <img src={user.avatar} className="w-10 h-10 rounded-xl border border-white/10 object-cover shadow-2xl" alt="Profile" />
        </div>
      </div>
    </header>
  );
};
