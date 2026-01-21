import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from './Button';
import { analyzeImage } from '../services/geminiService';
import { historyService } from '../services/historyService';
import { AnalysisResult } from '../types';
import { ResultCard } from './ResultCard';

interface ScanModeProps {
  onStop: () => void;
}

export const ScanMode: React.FC<ScanModeProps> = ({ onStop }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showShutter, setShowShutter] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      setError("OPTICAL_SENSOR_NOT_READY");
      console.error(err);
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [stopCamera]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setShowShutter(true);
    setTimeout(() => setShowShutter(false), 300);

    setAnalyzing(true);
    setResult(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.85);
      const analysis = await analyzeImage(base64Image);
      
      historyService.save(analysis, base64Image);
      setResult(analysis);
    }
    setAnalyzing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[600px] relative bg-neutral-50 dark:bg-black transition-colors duration-300">
      <div className="relative w-full max-w-4xl h-[65vh] bg-black overflow-hidden border-y border-neutral-200 dark:border-neutral-800 shadow-2xl">
        {!isStreaming && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
                <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                <span className="font-mono text-[10px] text-neutral-500 tracking-[0.3em]">CALIBRATING_OPTICS...</span>
            </div>
        )}
        
        {error && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 font-mono text-xs z-20 bg-black">
                CRITICAL_ERROR: {error}
            </div>
        )}
        
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover opacity-90"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Shutter Effect Overlay */}
        <div className={`absolute inset-0 bg-white z-30 pointer-events-none ${showShutter ? 'animate-shutter' : 'opacity-0'}`}></div>

        {/* Technical Hud */}
        {isStreaming && !result && (
            <div className="absolute inset-0 pointer-events-none select-none">
                <div className="absolute top-1/4 w-full h-px bg-white/5"></div>
                <div className="absolute top-2/4 w-full h-px bg-white/5"></div>
                <div className="absolute top-3/4 w-full h-px bg-white/5"></div>
                <div className="absolute left-1/4 h-full w-px bg-white/5"></div>
                <div className="absolute left-2/4 h-full w-px bg-white/5"></div>
                <div className="absolute left-3/4 h-full w-px bg-white/5"></div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/10">
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                </div>

                <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/40 flex flex-col gap-1">
                    <div>MODE: WASTE_DISCRIMINATION_V3</div>
                    <div>SENSORS: ACTIVE</div>
                    <div className="flicker">TARGET_LOCK: STANDBY</div>
                </div>

                {!analyzing && (
                   <div className="absolute top-0 left-0 w-full h-1 bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)] scan-line"></div> 
                )}
            </div>
        )}

        {analyzing && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-40 backdrop-blur-md">
                 <div className="font-mono text-xl tracking-[0.4em] text-white mb-6 animate-pulse">ANALYZING</div>
                 <div className="w-48 h-0.5 bg-neutral-800 relative overflow-hidden">
                    <div className="absolute h-full bg-white animate-[progress_1s_ease-in-out_infinite]" style={{width: '30%'}}></div>
                 </div>
                 <style>{`
                    @keyframes progress {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(300%); }
                    }
                 `}</style>
            </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center w-full max-w-md gap-4 px-4 pb-12">
        {result ? (
            <div className="w-full animate-fade-in-up">
                <ResultCard 
                    result={result} 
                    onDismiss={() => setResult(null)} 
                    resetLabel="DISCARD & SCAN"
                />
            </div>
        ) : (
            <div className="flex gap-10 w-full items-center justify-center">
                 <button 
                    onClick={onStop}
                    className="font-mono text-xs tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                 >
                    [ TERMINATE ]
                 </button>
                 
                 <button 
                    onClick={handleCapture}
                    disabled={!isStreaming || analyzing}
                    className="w-20 h-20 rounded-full border-2 border-neutral-900 dark:border-white p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 group"
                 >
                    <div className="w-full h-full bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white dark:border-black rounded-sm"></div>
                    </div>
                 </button>

                 <div className="w-16"></div>
            </div>
        )}
      </div>
    </div>
  );
};