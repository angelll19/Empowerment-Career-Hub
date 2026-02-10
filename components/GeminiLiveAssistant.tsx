
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { UserProfile } from '../types';

interface Props {
  onClose: () => void;
  user: UserProfile;
}

export const GeminiLiveAssistant: React.FC<Props> = ({ onClose, user }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);

  // Manual Decode implementation as per guidelines
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Manual Encode implementation as per guidelines
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Manual Audio Decoding for PCM streams
  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      // Supported audio MIME type is strictly 'audio/pcm'
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startSession = async () => {
    setIsConnecting(true);
    // Initialize right before call with the latest environment key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = outputCtx;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              // CRITICAL: Ensure data is streamed only after the session promise resolves
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Processing transcriptions
            if (message.serverContent?.outputTranscription) {
              setTranscript(prev => [...prev, `AI: ${message.serverContent?.outputTranscription?.text}`]);
            }
            if (message.serverContent?.inputTranscription) {
              setTranscript(prev => [...prev, `Me: ${message.serverContent?.inputTranscription?.text}`]);
            }

            // Processing audio output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              
              // Scheduling audio chunk for smooth gapless playback
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // Handling interruption
            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error("Live Error", e),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: `You are the Empowerment Assistant. Talk with ${user.name}, who is a ${user.role}. Help them with career growth advice. Be human-like and low latency.`,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="max-w-xl w-full mx-4 glass-morphism p-8 rounded-[3rem] text-center space-y-8 relative border-none bg-white/10 text-white">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Empowerment Assistant</h2>
          <p className="text-white/60">Voice conversation enabled by Gemini Live.</p>
        </div>

        <div className="h-48 flex items-center justify-center">
          {isActive ? (
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-3 h-12 bg-teal-400 rounded-full animate-pulse`} style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border-2 border-white/20">
              <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </div>
          )}
        </div>

        <div className="max-h-40 overflow-y-auto text-left space-y-2 p-4 bg-black/20 rounded-2xl no-scrollbar">
           {transcript.length === 0 && <p className="text-white/30 italic text-center text-sm">Waiting for conversation to start...</p>}
           {transcript.map((t, i) => (
             <p key={i} className={`text-sm ${t.startsWith('Me:') ? 'text-teal-300' : 'text-purple-300'}`}>{t}</p>
           ))}
        </div>

        {!isActive && !isConnecting && (
          <button 
            onClick={startSession}
            className="w-full gradient-teal-purple py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all shadow-2xl"
          >
            Start Real-time Conversation
          </button>
        )}
        
        {isConnecting && (
          <div className="text-teal-400 font-bold animate-pulse">Establishing secure connection...</div>
        )}

        {isActive && (
          <button 
            onClick={() => { sessionRef.current?.close(); setIsActive(false); }}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 py-4 rounded-2xl font-bold"
          >
            End Session
          </button>
        )}
      </div>
    </div>
  );
};
