
import React from 'react';
import { UserProfile } from '../types';

export const PortfolioView: React.FC<{ user: UserProfile }> = ({ user }) => {
  const credentials = [
    { id: 'c1', title: 'Impact-Led Communicator', issuer: 'EmpowerHub Foundation', date: 'Oct 2023', level: 'Expert' },
    { id: 'c2', title: 'Systems Thinker', issuer: 'UNESCO Impact Pods', date: 'Nov 2023', level: 'Intermediate' },
  ];

  const portfolioItems = [
    { 
      id: 'p1', 
      title: 'Youth Digital Literacy Framework', 
      role: 'Project Lead', 
      outcome: 'Verified by UN Habitat', 
      summary: 'Architected a scalable digital onboarding flow for low-bandwidth environments.',
      img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=400' 
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-5xl mx-auto py-4">
      <section className="flex flex-col md:flex-row gap-8 items-center bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
         <div className="relative">
            <img src={user.avatar} className="w-40 h-40 rounded-[2.5rem] object-cover border-8 border-slate-50 shadow-xl shadow-teal-500/10" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 gradient-teal-purple rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg">9.8</div>
         </div>
         <div className="text-center md:text-left space-y-3">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user.name}'s Growth Story</h1>
            <p className="text-teal-600 font-black uppercase tracking-widest text-sm">{user.role} • Impact Execution Path</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
               {['Strategic Execution', 'Impact Measurement', 'Pod Leadership'].map(s => (
                 <span key={s} className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold border border-slate-100">{s}</span>
               ))}
            </div>
         </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-6">
           <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm">🎖️</span>
              Verified Credentials
           </h2>
           <div className="space-y-4">
              {credentials.map(c => (
                <div key={c.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-purple-200 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">✨</div>
                      <div>
                         <p className="font-black text-slate-900">{c.title}</p>
                         <p className="text-xs text-slate-400 font-bold">{c.issuer} • {c.date}</p>
                      </div>
                   </div>
                   <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{c.level}</span>
                </div>
              ))}
           </div>
        </section>

        <section className="space-y-6">
           <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center text-sm">📈</span>
              Execution Portfolio
           </h2>
           <div className="space-y-4">
              {portfolioItems.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 group">
                   <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 relative">
                      <img src={p.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-black text-teal-600 uppercase tracking-widest shadow-lg">Verified Outcome</div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between items-start">
                         <h3 className="font-black text-lg text-slate-900">{p.title}</h3>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.role}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{p.summary}</p>
                      <div className="pt-2 flex items-center gap-2">
                         <div className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center text-[8px] text-white">✓</div>
                         <span className="text-xs font-bold text-teal-600 italic">{p.outcome}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>

      <div className="bg-slate-900 p-12 rounded-[3.5rem] text-center space-y-6 text-white shadow-2xl">
         <h2 className="text-3xl font-black tracking-tight">Ready for a Reference?</h2>
         <p className="text-white/60 max-w-xl mx-auto font-medium">Your portfolio is high-signal. Our Impact Partners actively recruit based on these verified execution markers.</p>
         <button className="px-10 py-4 gradient-teal-purple rounded-2xl font-black text-sm shadow-xl hover:-translate-y-1 transition-all">
            Share Portfolio Link
         </button>
      </div>
    </div>
  );
};
