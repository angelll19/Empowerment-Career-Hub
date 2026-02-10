
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { UserRole, UserProfile } from '../types';
import { geminiService } from '../services/gemini';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<'landing' | 'role' | 'capture' | 'holographic' | 'account'>('landing');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [stylizedAvatar, setStylizedAvatar] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const containerRef3D = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);

  // Background Immersive 3D Experience
  useEffect(() => {
    if (!containerRef3D.current || step !== 'landing') return;
    const container = containerRef3D.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Particle Environment
    const particlesGeo = new THREE.BufferGeometry();
    const pCount = 3000;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 15;
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.015, color: 0x8b5cf6, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const pMesh = new THREE.Points(particlesGeo, pMat);
    scene.add(pMesh);

    camera.position.z = 6;
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      pMesh.rotation.y += 0.0005;
      pMesh.rotation.x += 0.0002;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frame);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [step]);

  const startJourney = () => setStep('role');

  const selectRole = (r: UserRole) => {
    setRole(r);
    setStep('capture');
    startCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access required for AI avatar generation", err);
    }
  };

  const captureIdentity = async () => {
    if (!videoRef.current || !captureCanvasRef.current) return;
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setImage(dataUrl);

    // Stop streams
    if (video.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }

    setIsProcessing(true);
    try {
      const stylized = await geminiService.stylizeAvatar(dataUrl);
      setStylizedAvatar(stylized || dataUrl);
      setStep('holographic');
    } catch (e) {
      setStylizedAvatar(dataUrl);
      setStep('holographic');
    } finally {
      setIsProcessing(false);
    }
  };

  const finalizeAccount = () => {
    onComplete({
      name,
      role: role!,
      avatar: stylizedAvatar || image || '',
      growthScore: 150,
      completedProjects: [],
      skills: [
        { name: 'Impact Strategy', level: 40 },
        { name: 'Execution', level: 35 },
        { name: 'Empathy', level: 50 }
      ],
      totalEarned: 0,
      trajectoryPoints: [10, 25, 45, 60, 85]
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 flex items-center justify-center overflow-hidden font-['Plus_Jakarta_Sans']">
      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className="relative z-10 text-center space-y-12 p-10 max-w-4xl"
          >
            <div ref={containerRef3D} className="absolute inset-0 -z-10 opacity-40 pointer-events-none" />
            <div className="space-y-6">
              <motion.div 
                animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-28 h-28 mx-auto bg-gradient-to-tr from-cyan-400 via-white to-violet-600 rounded-[2.5rem] shadow-[0_0_80px_rgba(6,182,212,0.4)] flex items-center justify-center text-5xl"
              >
                💎
              </motion.div>
              <h1 className="text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
                Empower<span className="text-cyan-400">Hub</span>
              </h1>
              <p className="text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                Welcome to your Career Hub! Unlock your potential in our immersive <span className="text-white">Growth Ecosystem</span>.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, letterSpacing: '0.4em', boxShadow: '0 0 50px rgba(6,182,212,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={startJourney}
              className="px-16 py-6 bg-white text-slate-950 rounded-full font-black text-sm uppercase tracking-[0.3em] shadow-2xl transition-all"
            >
              Start Journey
            </motion.button>
          </motion.div>
        )}

        {step === 'role' && (
          <motion.div 
            key="role"
            initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
            className="z-10 max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 p-10"
          >
            <div className="col-span-full text-center mb-8">
              <h2 className="text-5xl font-black text-white tracking-tight">Select Your Trajectory</h2>
              <p className="text-slate-500 text-lg font-medium">Define your entry point to the empowerment network.</p>
            </div>

            <motion.button
              whileHover={{ y: -15, scale: 1.02 }}
              onClick={() => selectRole(UserRole.MENTOR)}
              className="role-card p-12 rounded-[4rem] bg-slate-900/40 border-2 border-white/5 text-left group transition-all backdrop-blur-3xl overflow-hidden relative shadow-2xl"
            >
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl" />
              <div className="w-24 h-24 rounded-3xl bg-cyan-400/20 text-cyan-400 flex items-center justify-center text-5xl mb-10 group-hover:glow-cyan transition-all">🏔️</div>
              <h3 className="text-4xl font-black text-white mb-6">Empowerment Mentor</h3>
              <p className="text-slate-400 text-xl leading-relaxed mb-10 italic">"Guide rising talent, lead impact pods, and certify new trailblazers."</p>
              <span className="text-cyan-400 font-black uppercase tracking-[0.3em] text-xs">Unlock Mentor Studio</span>
            </motion.button>

            <motion.button
              whileHover={{ y: -15, scale: 1.02 }}
              onClick={() => selectRole(UserRole.TALENT)}
              className="role-card p-12 rounded-[4rem] bg-slate-900/40 border-2 border-white/5 text-left group transition-all backdrop-blur-3xl overflow-hidden relative shadow-2xl"
            >
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl" />
              <div className="w-24 h-24 rounded-3xl bg-orange-400/20 text-orange-400 flex items-center justify-center text-5xl mb-10 group-hover:glow-orange transition-all">🚀</div>
              <h3 className="text-4xl font-black text-white mb-6">Rising Talent</h3>
              <p className="text-slate-400 text-xl leading-relaxed mb-10 italic">"Join high-signal projects, earn credentials, and launch your story."</p>
              <span className="text-orange-400 font-black uppercase tracking-[0.3em] text-xs">Access Skill Labs</span>
            </motion.button>
          </motion.div>
        )}

        {step === 'capture' && (
          <motion.div 
            key="capture"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="z-10 max-w-2xl w-full glass-card p-16 rounded-[5rem] text-center space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white tracking-tight">Identity Scan</h2>
              <p className="text-slate-500 font-medium italic">Gemini AI is ready to synthesize your unique 3D stylized avatar.</p>
            </div>
            
            <div className="relative aspect-square w-full rounded-[4rem] overflow-hidden border-4 border-white/10 bg-slate-900 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center z-50 space-y-6">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full shadow-[0_0_50px_rgba(6,182,212,0.6)]"
                  />
                  <div className="space-y-2">
                    <p className="text-cyan-400 font-black text-base uppercase tracking-[0.4em]">Processing Bio-Data</p>
                    <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">Generating 3D stylized geometry...</p>
                  </div>
                </div>
              )}
              {image ? (
                <img src={image} className="w-full h-full object-cover" alt="Captured" />
              ) : (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
              )}
              {!image && !isProcessing && (
                <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-[4rem] animate-pulse pointer-events-none" />
              )}
            </div>

            <button
              onClick={captureIdentity}
              disabled={isProcessing}
              className="w-full py-8 bg-white text-slate-950 rounded-[2.5rem] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20 text-lg"
            >
              Capture Frame
            </button>
            <p className="text-xs text-slate-500">Or drag an image here to upload</p>
          </motion.div>
        )}

        {step === 'holographic' && (
          <motion.div 
            key="holographic"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="z-10 w-full max-w-7xl p-10 flex flex-col items-center space-y-20"
          >
            <div className="relative group">
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-0 border-2 border-dashed rounded-full scale-[1.6] opacity-30 ${role === UserRole.MENTOR ? 'border-cyan-400' : 'border-orange-500'}`}
              />
              <motion.div 
                animate={{ rotate: -360, scale: [1.1, 1, 1.1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-0 border-2 border-dashed rounded-full scale-[1.9] opacity-10 ${role === UserRole.MENTOR ? 'border-violet-500' : 'border-blue-500'}`}
              />
              
              <div className="relative z-10">
                <img 
                  src={stylizedAvatar || image || ''} 
                  className={`w-72 h-72 rounded-full border-4 object-cover shadow-[0_0_100px_rgba(255,255,255,0.1)] ${role === UserRole.MENTOR ? 'border-cyan-400 glow-cyan' : 'border-orange-500'}`} 
                  alt="AI Avatar"
                />
                <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.4em] shadow-2xl ${role === UserRole.MENTOR ? 'bg-cyan-500 text-slate-950' : 'bg-orange-500 text-white'}`}>
                  Neural Avatar Sync
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl relative">
              <div className="col-span-full text-center space-y-4">
                <h2 className="text-5xl font-black text-white tracking-tighter">Profile Handshake</h2>
                <p className="text-slate-500 text-lg font-medium italic">Complete your identity credentials to enter the workspace.</p>
              </div>

              <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4 pl-6">Display Handle</label>
                <input 
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your Full Identity"
                  className="w-full h-24 hologram-input rounded-[2.5rem] px-10 text-2xl font-bold outline-none"
                />
              </motion.div>

              <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4 pl-6">Neural Address</label>
                <input 
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="yourname@hub.com"
                  className="w-full h-24 hologram-input rounded-[2.5rem] px-10 text-2xl font-bold outline-none"
                />
              </motion.div>

              <motion.button 
                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                onClick={() => setStep('account')}
                disabled={!name || !email}
                className="col-span-full h-28 gradient-action rounded-[3rem] font-black uppercase tracking-[0.5em] text-white shadow-2xl glow-cyan hover:scale-[1.02] active:scale-95 transition-all text-xl disabled:opacity-20"
              >
                Sync Identity
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'account' && (
          <motion.div 
            key="account"
            initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}
            className="z-10 max-w-xl w-full glass-card p-16 rounded-[5rem] text-center space-y-12"
          >
            <div className="space-y-4">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full mx-auto flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(34,197,94,0.3)]">✓</div>
              <h2 className="text-4xl font-black text-white tracking-tight">Final Handshake</h2>
              <p className="text-slate-500 font-medium">Provision your secure neural access key.</p>
            </div>

            <div className="space-y-6">
              <div className="p-10 bg-black/40 rounded-[3rem] border border-white/5 space-y-6 shadow-inner">
                <input 
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Access Key (Password)"
                  className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl font-black text-white outline-none focus:border-cyan-400 transition-colors text-center"
                />
              </div>
              <button 
                onClick={finalizeAccount}
                disabled={!password}
                className="w-full py-8 bg-white text-slate-950 rounded-[2.5rem] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-100 transition-all disabled:opacity-20 text-lg"
              >
                Launch Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <canvas ref={captureCanvasRef} className="hidden" />
    </div>
  );
};
