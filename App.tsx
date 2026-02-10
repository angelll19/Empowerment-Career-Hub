
import React, { useState, useEffect } from 'react';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { ProjectSwiperView } from './views/ProjectSwiperView';
import { ARHub } from './views/ARHub';
import { PortfolioView } from './views/PortfolioView';
import { ProjectPodView } from './views/ProjectPodView';
import { UserProfile, UserRole, ALL_PROJECTS } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Chatbot } from './components/Chatbot';
import { GeminiLiveAssistant } from './components/GeminiLiveAssistant';

export type ViewState = 'dashboard' | 'swipe' | 'arhub' | 'portfolio' | 'pod';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [savedProjectIds, setSavedProjectIds] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [showLive, setShowLive] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('empowerment_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedIds = localStorage.getItem('empowerment_saved_projects');
    if (savedIds) {
      setSavedProjectIds(JSON.parse(savedIds));
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    const enrichedProfile: UserProfile = { 
      ...profile, 
      growthScore: 150, 
      completedProjects: [],
      skills: [
        { name: 'Mentorship', level: 40 },
        { name: 'Execution', level: 30 },
        { name: 'Empathy', level: 50 },
        { name: 'Strategy', level: 60 },
      ],
      totalEarned: 0,
      trajectoryPoints: [10, 25, 45, 60, 85]
    };
    setUser(enrichedProfile);
    localStorage.setItem('empowerment_user', JSON.stringify(enrichedProfile));
  };

  const handleOpenPod = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('pod');
  };

  const handleSaveProject = (projectId: string) => {
    setSavedProjectIds(prev => {
      if (prev.includes(projectId)) return prev;
      const next = [...prev, projectId];
      localStorage.setItem('empowerment_saved_projects', JSON.stringify(next));
      return next;
    });
  };

  const handleRemoveSaved = (projectId: string) => {
    setSavedProjectIds(prev => {
      const next = prev.filter(id => id !== projectId);
      localStorage.setItem('empowerment_saved_projects', JSON.stringify(next));
      return next;
    });
  };

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        user={user} 
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Header user={user} onOpenAssistant={() => setShowLive(true)} />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
          {currentView === 'dashboard' && (
            <Dashboard 
              user={user} 
              onOpenPod={handleOpenPod} 
              savedProjectIds={savedProjectIds}
              onRemoveSaved={handleRemoveSaved}
            />
          )}
          {currentView === 'swipe' && (
            <ProjectSwiperView 
              onProjectJoined={handleOpenPod} 
              onProjectSaved={handleSaveProject}
            />
          )}
          {currentView === 'arhub' && <ARHub user={user} />}
          {currentView === 'portfolio' && <PortfolioView user={user} />}
          {currentView === 'pod' && selectedProjectId && (
            <ProjectPodView 
              projectId={selectedProjectId} 
              user={user} 
              onBack={() => setCurrentView('dashboard')} 
            />
          )}
        </div>

        {/* Floating Actions */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
          <button 
            onClick={() => setShowChat(!showChat)}
            className="w-14 h-14 rounded-full gradient-action text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform glow-cyan"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
          </button>
        </div>

        {showChat && <Chatbot onClose={() => setShowChat(false)} />}
        {showLive && <GeminiLiveAssistant onClose={() => setShowLive(false)} user={user} />}
      </main>
    </div>
  );
}
