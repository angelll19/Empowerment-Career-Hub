
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { UserProfile, UserRole, ARRoomType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const ARHub: React.FC<{ user: UserProfile }> = ({ user }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentRoom, setCurrentRoom] = useState<ARRoomType>('LOBBY');
  const [isLoading, setIsLoading] = useState(true);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [showPortalUI, setShowPortalUI] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeVoicePeers, setActiveVoicePeers] = useState<string[]>([]);

  // Simulated peer data
  const PEERS: Record<string, UserProfile> = {
    "Amina Blake": {
      name: "Amina Blake",
      role: UserRole.MENTOR,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amina",
      growthScore: 1200,
      completedProjects: ["Carbon AI"],
      skills: [{ name: "Strategy", level: 95 }],
      totalEarned: 5000,
      trajectoryPoints: [10, 40, 80, 100]
    },
    "Chloe S.": {
      name: "Chloe S.",
      role: UserRole.TALENT,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chloe",
      growthScore: 450,
      completedProjects: ["Design Kit"],
      skills: [{ name: "UX Design", level: 80 }],
      totalEarned: 900,
      trajectoryPoints: [5, 20, 50, 70]
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.04);
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 18, 40);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0x06b6d4, 1500, 200, Math.PI/4, 0.5);
    spotLight.position.set(0, 50, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    const buildRoom = (type: ARRoomType) => {
      roomGroup.clear();
      
      let floorColor = 0x0f172a;
      if (type === 'LEADERSHIP_LOUNGE') floorColor = 0x1e1b4b;
      if (type === 'LEARNING_CIRCLE') floorColor = 0x064e3b;
      if (type === 'INTERVIEW_ROOM') floorColor = 0x111827;

      const floorGeo = new THREE.CircleGeometry(50, 64);
      const floorMat = new THREE.MeshStandardMaterial({ color: floorColor, roughness: 0.9, metalness: 0.1 });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      roomGroup.add(floor);

      const grid = new THREE.GridHelper(100, 40, 0x1e293b, 0x0f172a);
      grid.position.y = 0.05;
      roomGroup.add(grid);

      // Environment milestones based on room
      if (type === 'LEARNING_CIRCLE') {
        const platform = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 1, 32), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 }));
        platform.position.set(0, 0.5, 0);
        roomGroup.add(platform);

        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 1), new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true }));
        core.position.set(0, 8, 0);
        core.userData = { type: 'milestone', label: 'Circle Heart' };
        roomGroup.add(core);
      }
    };

    buildRoom(currentRoom);

    const avatars: THREE.Group[] = [];
    const createAvatar = (prof: UserProfile, pos: [number, number, number]) => {
      const g = new THREE.Group();
      g.position.set(pos[0], 0, pos[2]);

      const loader = new THREE.TextureLoader();
      loader.load(prof.avatar, (tex) => {
        const mat = new THREE.SpriteMaterial({ map: tex });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(7.5, 7.5, 1);
        sprite.position.y = 3.8;
        g.add(sprite);

        // Name Tag
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = 512; canvas.height = 128;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.roundRect(0, 0, 512, 128, 40); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 44px Plus Jakarta Sans';
          ctx.textAlign = 'center';
          ctx.fillText(prof.name, 256, 80);
          const nameTex = new THREE.CanvasTexture(canvas);
          const nameSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: nameTex }));
          nameSprite.position.y = 9;
          nameSprite.scale.set(7, 1.75, 1);
          g.add(nameSprite);
        }
      });

      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.1, 16, 64), new THREE.MeshBasicMaterial({ color: prof.role === UserRole.MENTOR ? 0x06b6d4 : 0x8b5cf6, transparent: true, opacity: 0.5 }));
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.1;
      g.add(ring);

      g.userData = { type: 'avatar', prof };
      scene.add(g);
      avatars.push(g);
      return g;
    };

    // My Avatar
    createAvatar(user, [0, 0, 15]);
    // Peers
    createAvatar(PEERS["Amina Blake"], [-20, 0, -10]);
    createAvatar(PEERS["Chloe S."], [20, 0, -5]);

    // Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      
      if (hits.length > 0) {
        let obj = hits[0].object;
        while (obj.parent && !obj.userData.type) obj = obj.parent;
        
        if (obj.userData.type === 'avatar') {
          setActiveProfile(obj.userData.prof);
          confetti({ particleCount: 30, origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight } });
        } else if (obj.userData.type === 'milestone') {
          confetti({ particleCount: 100, colors: ['#06b6d4', '#8b5cf6'] });
        }
      } else {
        setActiveProfile(null);
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      avatars.forEach((g, i) => {
        // Procedural Idle Gestures
        g.position.y = Math.sin(time * 1.5 + i) * 0.25;
        g.rotation.y = Math.sin(time * 0.4 + i) * 0.05;

        // "Lip Sync" visual logic (simulated)
        const isCurrentlySpeaking = (g.userData.prof.name === user.name && isSpeaking) || activeVoicePeers.includes(g.userData.prof.name);
        if (isCurrentlySpeaking) {
          const sprite = g.children.find(c => c.type === 'Sprite');
          if (sprite) {
            sprite.scale.setScalar(7.5 + Math.sin(time * 25) * 0.3);
          }
          const ring = g.children.find(c => c.type === 'Mesh');
          if (ring) {
            (ring as THREE.Mesh).scale.setScalar(1 + Math.sin(time * 20) * 0.1);
          }
        }
      });

      // Ambient cam movement
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(time * 0.2) * 8, 0.03);
      camera.lookAt(0, 5, 0);

      renderer.render(scene, camera);
    };
    animate();
    setIsLoading(false);

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      renderer.domElement.removeEventListener('click', handleClick);
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [currentRoom, user, isSpeaking, activeVoicePeers]);

  return (
    <div className="relative w-full h-[88vh] bg-slate-950 rounded-[5rem] overflow-hidden border-4 border-white/5 shadow-2xl font-['Plus_Jakarta_Sans'] select-none">
      <div ref={containerRef} className="w-full h-full cursor-pointer" />

      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center z-[100]">
          <div className="w-24 h-24 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-8" />
          <p className="text-cyan-400 font-black uppercase tracking-[0.6em] text-sm">Synchronizing Spatial Nodes...</p>
        </div>
      )}

      {/* AR HUD */}
      <div className="absolute top-12 left-12 space-y-4 pointer-events-none z-10">
        <div className="flex items-center gap-4">
          <span className="px-6 py-2 glass-card rounded-2xl text-[10px] font-black uppercase tracking-widest text-cyan-400 border-cyan-400/20 shadow-xl">Presence: Encrypted</span>
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Zone: {currentRoom}</span>
        </div>
        <h2 className="text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
          {currentRoom.replace('_', ' ')}
        </h2>
        <p className="text-slate-500 text-lg font-medium italic">Your 3D Growth Ecosystem is live.</p>
      </div>

      {/* Interaction Controls */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-6">
        <motion.button 
          onMouseDown={() => { setIsSpeaking(true); }}
          onMouseUp={() => { setIsSpeaking(false); }}
          whileTap={{ scale: 0.9, y: 5 }}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all border-4 ${isSpeaking ? 'bg-cyan-400 border-white text-slate-950 glow-cyan' : 'glass-card border-white/10 text-cyan-400'}`}
        >
          🎙️
        </motion.button>
        <button 
          onClick={() => setShowPortalUI(!showPortalUI)}
          className="px-12 h-24 rounded-[3rem] glass-card border-white/10 text-white font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:bg-white/10 transition-all flex items-center gap-4"
        >
          <span className="text-2xl">⚡</span>
          Transporter
        </button>
      </div>

      <AnimatePresence>
        {showPortalUI && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="absolute bottom-44 left-1/2 -translate-x-1/2 z-30 glass-card p-12 rounded-[4.5rem] border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] max-w-xl w-full grid grid-cols-2 gap-6"
          >
            {[
              { id: 'LOBBY', label: 'Global Hub', icon: '🏛️' },
              { id: 'LEADERSHIP_LOUNGE', label: 'Mentor Arena', icon: '⛰️' },
              { id: 'LEARNING_CIRCLE', label: 'Project Pods', icon: '🚀' },
              { id: 'INTERVIEW_ROOM', label: 'Mock Space', icon: '🎤' }
            ].map(r => (
              <button 
                key={r.id}
                onClick={() => { setCurrentRoom(r.id as ARRoomType); setShowPortalUI(false); setIsLoading(true); }}
                className={`flex items-center gap-5 px-8 py-6 rounded-[2.5rem] transition-all border ${currentRoom === r.id ? 'bg-white text-slate-950 border-white shadow-2xl scale-105' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'}`}
              >
                <span className="text-3xl">{r.icon}</span>
                <span className="text-[11px] font-black uppercase tracking-widest">{r.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeProfile && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute right-12 top-1/2 -translate-y-1/2 z-40 glass-card w-[420px] p-12 rounded-[5rem] border-cyan-400/20 shadow-[-40px_0_100px_rgba(0,0,0,0.5)] space-y-10"
          >
             <div className="flex items-center gap-8">
                <div className="relative">
                  <img src={activeProfile.avatar} className="w-28 h-28 rounded-[2.5rem] border-4 border-cyan-400/30 object-cover shadow-2xl" />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 gradient-action rounded-xl flex items-center justify-center text-white text-xs font-black">Lv4</div>
                </div>
                <div>
                   <h3 className="text-3xl font-black text-white leading-tight mb-2 tracking-tighter">{activeProfile.name}</h3>
                   <span className="px-4 py-1 bg-cyan-400/10 text-cyan-400 text-[9px] font-black uppercase tracking-widest border border-cyan-400/20 rounded-full">{activeProfile.role}</span>
                </div>
             </div>
             <div className="space-y-6">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Trajectory Insights</p>
                <div className="flex flex-wrap gap-3">
                   {activeProfile.skills.map(s => (
                     <span key={s.name} className="px-5 py-2 bg-white/5 rounded-[1.2rem] text-xs font-bold text-slate-300 border border-white/5">#{s.name}</span>
                   ))}
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <button className="py-5 gradient-action text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 transition-all">Start Direct</button>
                <button className="py-5 bg-white/5 text-white border border-white/10 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all">View Story</button>
             </div>
             <button onClick={() => setActiveProfile(null)} className="w-full text-slate-600 font-black uppercase tracking-widest text-[9px] hover:text-white transition-colors">Close Profile</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
