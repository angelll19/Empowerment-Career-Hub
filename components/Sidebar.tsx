
import React from 'react';
import { UserProfile } from '../types';
import { ViewState } from '../App';

interface Props {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  user: UserProfile;
}

export const Sidebar: React.FC<Props> = ({ currentView, setView, user }) => {
  const menuItems: { id: ViewState; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Growth Lounge', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'swipe', label: 'Circle Match', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { id: 'portfolio', label: 'Growth Story', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'arhub', label: 'Spatial Hub', icon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' },
  ];

  return (
    <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col hidden lg:flex">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl gradient-action flex items-center justify-center text-white font-black shadow-lg glow-cyan">
            EH
          </div>
          <div>
            <span className="block font-black text-xl tracking-tighter leading-none text-white">EmpowerHub</span>
            <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">Growth Lounge</span>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                currentView === item.id 
                  ? 'bg-white/10 text-cyan-400 shadow-lg border border-white/10 font-bold' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 hover:translate-x-1'
              }`}
            >
              <svg className={`w-5 h-5 ${currentView === item.id ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
              </svg>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-white/5 bg-black/20">
        <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-3">
          <div className="relative">
            <img src={user.avatar} className="w-11 h-11 rounded-2xl object-cover border border-white/10" alt="Avatar" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate text-white">{user.name}</p>
            <p className="text-[10px] text-cyan-400 font-black uppercase tracking-wider truncate">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
