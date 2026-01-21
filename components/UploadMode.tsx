import React, { useState } from 'react';
import { Button } from './Button';
import { analyzeImage } from '../services/geminiService';
import { historyService } from '../services/historyService';
import { AnalysisResult } from '../types';
import { ResultCard } from './ResultCard';

interface UploadModeProps {
  onBack: () => void;
}

export const UploadMode: React.FC<UploadModeProps> = ({ onBack }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);
    const analysis = await analyzeImage(selectedImage);
    
    // Save to history
    historyService.save(analysis, selectedImage);
    
    setResult(analysis);
    setAnalyzing(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto py-12">
      <div className="w-full text-left mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4 flex justify-between items-end">
        <h2 className="text-3xl font-light tracking-tight text-neutral-900 dark:text-white">Source Input</h2>
        <Button variant="ghost" onClick={onBack} className="!p-0 !h-auto text-neutral-500 hover:text-black dark:hover:text-white">CLOSE</Button>
      </div>
      
      {!selectedImage ? (
        <label className="flex flex-col items-center justify-center w-full h-96 border border-neutral-300 dark:border-neutral-800 border-dashed hover:border-neutral-900 dark:hover:border-white/50 transition-colors cursor-pointer bg-white dark:bg-neutral-900/20 group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="mb-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
            </div>
            <p className="mb-2 text-lg font-light text-neutral-500 dark:text-neutral-400">Select Source File</p>
            <p className="text-xs font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">JPEG or PNG . Max 5MB</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="w-full flex flex-col gap-6">
            <div className="relative w-full h-96 bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-center overflow-hidden">
                <img src={selectedImage} alt="Source" className="max-w-full max-h-full object-contain opacity-90" />
                
                <button 
                    onClick={() => { setSelectedImage(null); setResult(null); }}
                    className="absolute top-4 right-4 text-neutral-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors bg-white/80 dark:bg-black/50 p-2 backdrop-blur-md"
                >
                    <span className="font-mono text-xs">[ REMOVE ]</span>
                </button>
            </div>

            {!result && (
                <div className="flex justify-end pt-4">
                    <Button 
                        variant="primary" 
                        onClick={handleAnalyze} 
                        disabled={analyzing}
                        className="w-full sm:w-auto"
                    >
                        {analyzing ? 'PROCESSING SEQUENCE...' : 'INITIATE ANALYSIS'}
                    </Button>
                </div>
            )}
        </div>
      )}

      {result && (
        <div className="mt-12 w-full flex justify-center animate-fade-in-up">
            <ResultCard 
                result={result} 
                onRerun={handleAnalyze}
                isProcessing={analyzing}
                onDismiss={() => { setSelectedImage(null); setResult(null); }}
                resetLabel="UPLOAD NEW"
            />
        </div>
      )}
    </div>
  );
};