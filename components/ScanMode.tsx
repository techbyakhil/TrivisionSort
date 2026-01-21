import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from './Button';
import { analyzeImage } from '../services/geminiService';
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
      setError("CAMERA_ACCESS_DENIED");
      console.error(err);
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
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

    setAnalyzing(true);
    setResult(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.9);
      const analysis = await analyzeImage(base64Image);
      setResult(analysis);
    }
    setAnalyzing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[600px] relative bg-neutral-50 dark:bg-black transition-colors duration-300">
      {/* Viewfinder Container - Always dark for better contrast with video */}
      <div className="relative w-full max-w-4xl h-[60vh] bg-black overflow-hidden border-y border-neutral-200 dark:border-neutral-800 shadow-xl dark:shadow-none">
        {!isStreaming && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-xs text-neutral-500 animate-pulse">INITIALIZING OPTICS...</span>
            </div>
        )}
        {error && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 font-mono text-xs">
                ERROR: {error}
            </div>
        )}
        
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover opacity-80"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Technical Overlays */}
        {isStreaming && !result && (
            <>
                <div className="absolute inset-0 pointer-events-none">
                    {/* Grid lines */}
                    <div className="absolute top-1/3 w-full h-px bg-white/10"></div>
                    <div className="absolute top-2/3 w-full h-px bg-white/10"></div>
                    <div className="absolute left-1/3 h-full w-px bg-white/10"></div>
                    <div className="absolute left-2/3 h-full w-px bg-white/10"></div>
                    
                    {/* Center bracket */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/20">
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white"></div>
                    </div>
                </div>

                {/* Scan Line Animation */}
                {!analyzing && (
                   <div className="absolute top-0 left-0 w-full h-1 bg-white/50 shadow-[0_0_20px_rgba(255,255,255,0.5)] scan-line pointer-events-none"></div> 
                )}
            </>
        )}

        {/* Processing State */}
        {analyzing && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                 <div className="font-mono text-2xl tracking-widest text-white mb-4 animate-pulse">PROCESSING</div>
                 <div className="w-64 h-1 bg-neutral-800">
                    <div className="h-full bg-white animate-[width_1s_ease-in-out_infinite]" style={{width: '50%'}}></div>
                 </div>
            </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="mt-8 flex flex-col items-center w-full max-w-md gap-4 px-4">
        {result ? (
            <div className="w-full animate-fade-in-up">
                <ResultCard 
                    result={result} 
                    onDismiss={() => setResult(null)} 
                    resetLabel="RERUN SCAN"
                />
            </div>
        ) : (
            <div className="flex gap-6 w-full items-center justify-center">
                 <Button variant="ghost" onClick={onStop}>BACK</Button>
                 <button 
                    onClick={handleCapture}
                    disabled={!isStreaming || analyzing}
                    className="w-16 h-16 rounded-full border-2 border-neutral-900 dark:border-white flex items-center justify-center hover:bg-neutral-900/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                 >
                    <div className="w-12 h-12 bg-neutral-900 dark:bg-white rounded-full group-hover:scale-90 transition-transform"></div>
                 </button>
                 <div className="w-20"></div> {/* Spacer for symmetry */}
            </div>
        )}
      </div>
    </div>
  );
};