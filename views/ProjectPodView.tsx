
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, UserRole, Task, TaskStatus } from '../types';
import confetti from 'canvas-confetti';

interface Props {
  projectId: string;
  user: UserProfile;
  onBack: () => void;
}

const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Carbon Neutral Protocol', description: 'Architecting the decentralized ingestion standard for global logistics hubs using high-security neural nodes.', status: 'verified', reward: 300, type: 'portfolio' },
  { id: 't2', title: 'Sensor API v2 Deployment', description: 'Implement GraphQL wrappers for vertical farm telemetry to ensure real-time data integrity and low-latency response.', status: 'submitted', reward: 500, type: 'hours' },
  { id: 't3', title: 'Impact Strategy Deck 1.0', description: 'Visual storytelling of 500 tons of carbon diverted in Q3 for our global sustainability partners.', status: 'pending', reward: 200, type: 'report' },
  { id: 't4', title: 'Node Security Audit', description: 'Conducting a full security sweep of the decentralized health hubs for rural connectivity.', status: 'pending', reward: 450, type: 'hours' },
];

const MOCK_MESSAGES = [
  { id: '1', sender: 'Dr. Sarah Lin', text: 'Leaders, focus on the low-bandwidth latency for the next milestone. We need this ready for the pilot.', time: '10:30 AM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
  { id: '2', sender: 'Chloe S.', text: 'Got it, Dr. Sarah. Working on the proto-buffers now. I should have the first pass by EOD.', time: '10:32 AM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chloe' },
  { id: '3', sender: 'Amina Blake', text: 'I can help review the security layers on the API. Let me know when you push the draft.', time: '11:05 AM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amina' },
];

const MOCK_PARTICIPANTS = [
  { id: 'u1', name: 'Dr. Sarah Lin', role: 'Empowerment Mentor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', bio: 'AI Strategist & Sustainability Advocate. Leading global impact initiatives.' },
  { id: 'u2', name: 'Amina Blake', role: 'Trailblazer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amina', bio: 'Expert in Decentralized Networks and Blockchain for Social Good.' },
  { id: 'u3', name: 'Chloe S.', role: 'Rising Talent', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chloe', bio: 'Passionate about CleanTech, UX design, and making an impact.' },
  { id: 'u4', name: 'Jessica Wu', role: 'Future Leader', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica', bio: 'FinTech explorer & Code Ninja. Building accessible finance tools.' }
];

const MOCK_MEETINGS = [
  { id: 'm1', title: 'Circle Execution Sync', time: 'Tomorrow, 2:00 PM', type: 'Voice Hub' },
  { id: 'm2', title: 'Quarterly Impact Audit', time: 'Friday, 11:00 AM', type: 'Review Session' },
];

export const ProjectPodView: React.FC<Props> = ({ projectId, user, onBack }) => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'intel' | 'chat'>('roadmap');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<typeof MOCK_PARTICIPANTS[0] | null>(null);
  const isMentor = user.role === UserRole.MENTOR;

  const handleTaskSubmit = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'submitted' } : t));
    confetti({ particleCount: 50, spread: 60, colors: ['#06b6d4', '#ffffff'] });
  };

  const handleTaskVerify = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'verified' } : t));
    confetti({ 
      particleCount: 200, 
      spread: 120, 
      origin: { y: 0.5 }, 
      colors: ['#06b6d4', '#8b5cf6', '#fbbf24'] 
    });
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { 
      id: Date.now().toString(), 
      sender: user.name, 
      text: inputText, 
      time: 'Just now', 
      avatar: user.avatar 
    }]);
    setInputText('');
  };

  const completedCount = tasks.filter(t => t.status === 'verified').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="h-full flex flex-col gap-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 px-4 no-scrollbar pb-10">
      
      {/* Workspace Header - Scaled Down */}
      <div className="glass-card p-10 rounded-[3.5rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-8 relative z-10">
          <motion.button 
            whileHover={{ scale: 1.1, x: -5 }}
            onClick={onBack} 
            className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-2xl shadow-lg"
          >
            ←
          </motion.button>
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic leading-none">Carbon Neutral Hub</h2>
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-5 py-2 bg-cyan-400/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] border border-cyan-400/20 rounded-full">Lead Architect: Dr. Sarah Lin</span>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.7)]" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Live Node Sync</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10 relative z-10">
          <div className="text-right space-y-2">
             <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Growth Velocity</p>
             <div className="flex items-center gap-6">
               <span className="text-5xl font-black text-white tabular-nums tracking-tighter">{progressPercent}%</span>
               <div className="w-48 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner p-0.5">
                 <motion.div initial={{width:0}} animate={{width:`${progressPercent}%`}} className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_20px_rgba(6,182,212,0.6)] rounded-full" />
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 flex-1 overflow-hidden min-h-[600px]">
        
        {/* Main Workspace Area */}
        <div className="flex-[1.8] flex flex-col gap-6 overflow-hidden">
           <div className="flex gap-4">
              {['roadmap', 'intel', 'chat'].map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl ${activeTab === t ? 'bg-white text-slate-950 scale-105 shadow-white/5' : 'glass-card text-slate-500 hover:text-white border-white/5'}`}
                >
                  {t === 'roadmap' ? 'Roadmap' : t === 'intel' ? 'Intel Cache' : 'Network Feed'}
                </button>
              ))}
           </div>

           <div className="flex-1 glass-card p-10 rounded-[4rem] border-white/5 overflow-y-auto no-scrollbar relative shadow-xl">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {activeTab === 'roadmap' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                    className="space-y-8 relative z-10"
                  >
                    {tasks.map((task) => (
                      <motion.div 
                        key={task.id} 
                        layout
                        whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                        className={`p-10 rounded-[3rem] border-2 transition-all ${task.status === 'verified' ? 'bg-green-500/5 border-green-500/10 opacity-70' : 'bg-white/5 border-white/5 shadow-lg'}`}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                          <div className="space-y-4 flex-1">
                             <div className="flex items-center gap-4">
                               <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${task.status === 'verified' ? 'bg-green-400/20 text-green-400 border border-green-400/20' : 'bg-white/5 text-slate-500 border border-white/5'}`}>{task.status}</span>
                               <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                 +${task.reward} Reward
                               </span>
                             </div>
                             <h4 className="text-3xl font-black text-white tracking-tighter leading-none group-hover:text-cyan-400 transition-colors">{task.title}</h4>
                             <p className="text-slate-400 text-lg font-medium italic leading-relaxed max-w-3xl">"{task.description}"</p>
                          </div>
                          <div className="flex flex-col gap-4 min-w-[200px]">
                             {isMentor ? (
                               task.status === 'submitted' && (
                                 <button 
                                  onClick={() => handleTaskVerify(task.id)}
                                  className="w-full py-5 bg-green-500 text-slate-950 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-green-500/10"
                                 >
                                  Verify Outcome
                                 </button>
                               )
                             ) : (
                               (task.status === 'pending' || task.status === 'in-progress') && (
                                 <button 
                                  onClick={() => handleTaskSubmit(task.id)}
                                  className="w-full py-5 bg-white text-slate-950 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-all shadow-xl"
                                 >
                                  Submit Portfolio
                                 </button>
                               )
                             )}
                             {task.status === 'verified' && (
                               <div className="flex items-center justify-center gap-3 text-green-400 font-black text-sm uppercase tracking-[0.3em] bg-green-400/5 py-4 rounded-2xl border border-green-400/10 shadow-md">
                                 <span className="w-8 h-8 rounded-full bg-green-400 text-slate-950 flex items-center justify-center text-sm shadow-md">✓</span>
                                 Verified
                               </div>
                             )}
                             {task.status === 'submitted' && !isMentor && (
                               <div className="text-center p-4 bg-white/5 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse italic">Audit in Progress...</div>
                             )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'chat' && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col h-full space-y-6"
                  >
                    <div className="flex-1 space-y-8 overflow-y-auto pr-4 no-scrollbar min-h-[400px]">
                      {messages.map((m) => (
                        <div key={m.id} className={`flex flex-col ${m.sender === user.name ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-4 mb-2 px-2">
                             {m.sender !== user.name && <img src={m.avatar} className="w-10 h-10 rounded-xl border border-white/10 shadow-lg" />}
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{m.sender}</span>
                             <span className="text-[8px] text-slate-700 font-bold tabular-nums">{m.time}</span>
                          </div>
                          <div className={`p-6 rounded-[2rem] text-sm font-medium shadow-xl max-w-[85%] leading-relaxed ${m.sender === user.name ? 'bg-cyan-500 text-slate-950 rounded-tr-none' : 'glass-card border-white/5 text-slate-200 rounded-tl-none'}`}>
                            {m.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 border-t border-white/5 bg-white/2 rounded-[2.5rem]">
                      <div className="flex gap-4">
                        <input 
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Collaborate on strategy..."
                          className="flex-1 h-16 hologram-input rounded-2xl px-8 text-lg font-bold outline-none shadow-inner"
                        />
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={sendMessage}
                          className="w-16 h-16 rounded-2xl gradient-action text-white flex items-center justify-center shadow-xl glow-cyan flex-shrink-0"
                        >
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'intel' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 p-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div whileHover={{ y: -5 }} className="p-10 glass-card rounded-[3rem] border-white/5 space-y-6 group hover:border-cyan-400/20 transition-all shadow-xl">
                           <div className="flex justify-between items-center">
                              <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Circle Repo</p>
                              <span className="text-3xl">📚</span>
                           </div>
                           <p className="text-2xl font-black text-white italic">24 Datasets</p>
                           <button className="w-full py-4 bg-cyan-400/10 text-cyan-400 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] border border-cyan-400/20 hover:bg-cyan-400/20 transition-all">Synchronize</button>
                        </motion.div>
                        <motion.div whileHover={{ y: -5 }} className="p-10 glass-card rounded-[3rem] border-white/5 space-y-6 group hover:border-violet-400/20 transition-all shadow-xl">
                           <div className="flex justify-between items-center">
                              <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Pod Synergy</p>
                              <span className="text-3xl">✨</span>
                           </div>
                           <p className="text-2xl font-black text-white italic">Peak Layer</p>
                           <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden shadow-inner"><div className="w-[92%] h-full bg-violet-500" /></div>
                        </motion.div>
                     </div>
                     <div className="space-y-6 glass-card p-10 rounded-[3rem] border-white/5 relative overflow-hidden">
                        <h3 className="text-3xl font-black text-white tracking-tighter italic leading-none">Global Mission Briefing</h3>
                        <p className="text-lg text-slate-400 leading-relaxed font-medium">To finalize the decentralized supply architecture for Carbon Neutral Hubs. This pod oversees validation standards for logistics providers.</p>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* Scaled Sidebar */}
        <div className="flex-1 flex flex-col gap-8 overflow-hidden">
           
           <div className="glass-card p-10 rounded-[4rem] border-white/5 bg-slate-900/40 shadow-xl flex-1 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-8 flex-shrink-0">
                <h3 className="text-2xl font-black text-white tracking-tighter italic">Leaders</h3>
                <span className="px-4 py-1.5 bg-white/5 rounded-xl font-black text-[10px] text-slate-500 uppercase tracking-widest shadow-inner">04 Active</span>
              </div>
              <div className="space-y-4 overflow-y-auto no-scrollbar flex-1 mb-8">
                 {MOCK_PARTICIPANTS.map((p) => (
                   <motion.div 
                    key={p.id} 
                    whileHover={{ scale: 1.05, x: 8, backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                    onClick={() => setSelectedProfile(p)}
                    className="flex items-center justify-between p-6 rounded-[2.5rem] bg-white/2 border border-white/5 group hover:border-cyan-400/40 transition-all cursor-pointer relative shadow-lg"
                   >
                      <div className="flex items-center gap-5">
                         <div className="relative">
                            <img src={p.avatar} className="w-16 h-16 rounded-[1.8rem] border-2 border-white/10 group-hover:border-cyan-400/50 transition-all shadow-xl object-cover" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-slate-900 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                         </div>
                         <div>
                            <p className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors leading-none mb-1">{p.name}</p>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{p.role}</p>
                         </div>
                      </div>
                      <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-all pr-2">→</span>
                   </motion.div>
                 ))}
              </div>
              
              <div className="border-t border-white/5 pt-8 space-y-6 flex-shrink-0">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 pl-4">Neural Syncs</h4>
                 <div className="space-y-4">
                    {MOCK_MEETINGS.map(m => (
                      <motion.div 
                        key={m.id} 
                        whileHover={{ y: -3, scale: 1.02 }}
                        className="p-6 rounded-[2.5rem] bg-violet-500/5 border border-violet-500/10 hover:bg-violet-500/10 transition-all cursor-pointer group shadow-lg"
                      >
                        <div className="flex justify-between items-center mb-2">
                           <p className="text-base font-black text-white group-hover:text-violet-400 transition-colors">{m.title}</p>
                           <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest bg-violet-400/10 px-3 py-1 rounded-lg border border-violet-400/20">{m.type}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold tabular-nums italic">{m.time}</p>
                      </motion.div>
                    ))}
                 </div>
                 <button className="w-full py-4 bg-white/2 border border-white/5 rounded-[2rem] text-[9px] font-black uppercase tracking-[0.4em] hover:bg-white/5 text-slate-600 transition-all shadow-md">Propose Sync</button>
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-6">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 50 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 50 }}
               className="glass-card w-full max-w-lg p-14 rounded-[5rem] border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] space-y-10 relative"
             >
                <button 
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-10 right-10 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl"
                >
                  ✕
                </button>
                <div className="text-center space-y-8">
                   <div className="relative inline-block">
                      <img src={selectedProfile.avatar} className="w-40 h-40 rounded-[3rem] border-4 border-cyan-400/30 object-cover shadow-2xl mx-auto" />
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-8 py-2 gradient-action rounded-[1.5rem] text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-xl">Verified {selectedProfile.role}</div>
                   </div>
                   <div className="space-y-4 pt-6">
                      <h3 className="text-5xl font-black text-white tracking-tighter leading-none">{selectedProfile.name}</h3>
                      <p className="text-slate-400 text-xl font-medium italic max-w-md mx-auto leading-relaxed">"{selectedProfile.bio}"</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <button className="py-6 gradient-action text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 transition-all glow-cyan">Direct Connect</button>
                   <button className="py-6 bg-white/5 border border-white/10 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all">Impact Story</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
