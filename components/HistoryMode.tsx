import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { historyService } from '../services/historyService';
import { HistoryItem } from '../types';
import { ResultCard } from './ResultCard';

interface HistoryModeProps {
  onBack: () => void;
}

export const HistoryMode: React.FC<HistoryModeProps> = ({ onBack }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    setHistory(historyService.getAll());
  }, []);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all logs?')) {
      historyService.clear();
      setHistory([]);
      setSelectedItem(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto py-12 px-6">
      <div className="w-full text-left mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4 flex justify-between items-end">
        <div>
            <h2 className="text-3xl font-light tracking-tight text-neutral-900 dark:text-white">Analysis Log</h2>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mt-1">
                Recent Classifications ({history.length})
            </p>
        </div>
        <div className="flex gap-4">
            {history.length > 0 && (
                <Button variant="danger" onClick={handleClear} className="!px-4 !py-2 !text-xs">
                    CLEAR LOGS
                </Button>
            )}
            <Button variant="ghost" onClick={onBack} className="!p-0 !h-auto text-neutral-500 hover:text-black dark:hover:text-white">CLOSE</Button>
        </div>
      </div>

      {selectedItem ? (
        <div className="w-full flex flex-col items-center animate-fade-in">
             <div className="mb-6 w-full flex justify-start">
                <button 
                    onClick={() => setSelectedItem(null)}
                    className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to List
                </button>
             </div>
             
             <div className="flex flex-col md:flex-row gap-8 w-full items-start justify-center">
                 <div className="w-full md:w-1/2 max-w-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-black p-2">
                     <img 
                        src={selectedItem.imageThumbnail} 
                        alt="Evidence" 
                        className="w-full h-auto object-cover"
                     />
                     <div className="mt-2 text-xs font-mono text-neutral-500 text-center uppercase">
                        Recorded: {formatDate(selectedItem.timestamp)}
                     </div>
                 </div>
                 
                 <div className="w-full md:w-1/2">
                    <ResultCard result={selectedItem.result} />
                 </div>
             </div>
        </div>
      ) : (
        <div className="w-full">
            {history.length === 0 ? (
                <div className="text-center py-24 text-neutral-400 font-mono text-sm uppercase tracking-widest">
                    No records found
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {history.map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group flex flex-col gap-4"
                        >
                            <div className="w-full h-48 bg-neutral-100 dark:bg-neutral-900 overflow-hidden relative">
                                <img 
                                    src={item.imageThumbnail} 
                                    alt={item.result.label}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 font-mono uppercase">
                                    {formatDate(item.timestamp)}
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-medium text-neutral-900 dark:text-white truncate max-w-[180px]">
                                        {item.result.label}
                                    </div>
                                    <div className="text-xs text-neutral-500 font-mono mt-1">
                                        Conf: {(item.result.confidence * 100).toFixed(0)}%
                                    </div>
                                </div>
                                <div className={`text-[10px] px-2 py-1 font-mono uppercase border rounded-sm ${
                                    item.result.classification === 'HAZARDOUS_WASTE' 
                                        ? 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900'
                                        : 'text-neutral-600 border-neutral-200 bg-neutral-50 dark:text-neutral-400 dark:bg-neutral-900 dark:border-neutral-800'
                                }`}>
                                    {item.result.classification.split('_')[0]}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
};