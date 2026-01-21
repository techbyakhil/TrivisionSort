import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AnalysisResult, ClassificationType } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
  onDismiss?: () => void;
  onRerun?: () => void;
  isProcessing?: boolean;
  resetLabel?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onDismiss, onRerun, isProcessing, resetLabel }) => {
  
  const getCategoryDetails = (type: ClassificationType) => {
    switch (type) {
      case ClassificationType.WET_WASTE:
        return {
          color: '#10b981', // Emerald 500
          labelColor: 'text-emerald-600 dark:text-emerald-400',
          borderColor: 'border-emerald-600/30',
          status: 'ORGANIC',
          directive: 'COMPOST'
        };
      case ClassificationType.DRY_WASTE:
        return {
          color: '#3b82f6', // Blue 500
          labelColor: 'text-blue-600 dark:text-blue-400',
          borderColor: 'border-blue-600/30',
          status: 'RECYCLABLE',
          directive: 'RECYCLE BIN'
        };
      case ClassificationType.BURNABLE_WASTE:
        return {
          color: '#f97316', // Orange 500
          labelColor: 'text-orange-600 dark:text-orange-400',
          borderColor: 'border-orange-600/30',
          status: 'COMBUSTIBLE',
          directive: 'INCINERATE'
        };
      case ClassificationType.INERT_WASTE:
        return {
          color: '#78716c', // Stone 500
          labelColor: 'text-stone-600 dark:text-stone-400',
          borderColor: 'border-stone-600/30',
          status: 'INERT / C&D',
          directive: 'LANDFILL / REUSE'
        };
      case ClassificationType.HAZARDOUS_WASTE:
        return {
          color: '#ef4444', // Red 500
          labelColor: 'text-red-600 dark:text-red-400',
          borderColor: 'border-red-600/30',
          status: 'TOXIC / HAZARDOUS',
          directive: 'SPECIAL DISPOSAL'
        };
      case ClassificationType.BULKY_WASTE:
        return {
          color: '#6366f1', // Indigo 500
          labelColor: 'text-indigo-600 dark:text-indigo-400',
          borderColor: 'border-indigo-600/30',
          status: 'BULKY / LARGE',
          directive: 'SCHEDULE PICKUP'
        };
      case ClassificationType.NOT_WASTE:
        return {
          color: '#8b5cf6', // Violet 500
          labelColor: 'text-violet-600 dark:text-violet-400',
          borderColor: 'border-violet-600/30',
          status: 'NON-WASTE',
          directive: 'PRESERVE'
        };
      default:
        return {
          color: '#737373', // Neutral 500
          labelColor: 'text-neutral-600 dark:text-neutral-400',
          borderColor: 'border-neutral-600/30',
          status: 'UNKNOWN',
          directive: 'MANUAL CHECK'
        };
    }
  };

  const details = getCategoryDetails(result.classification);
  
  const chartData = [
    { name: 'Confidence', value: result.confidence * 100 },
    { name: 'Uncertainty', value: (1 - result.confidence) * 100 },
  ];

  return (
    <div className="w-full max-w-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-8 animate-fade-in relative group transition-colors duration-300 shadow-xl dark:shadow-none">
      {/* Decorative corner markers */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black/20 dark:border-white/50"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black/20 dark:border-white/50"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black/20 dark:border-white/50"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black/20 dark:border-white/50"></div>

      <div className="flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-8 border-b border-neutral-200 dark:border-neutral-900 pb-4">
            <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase">Analysis Protocol v3.0</span>
            <span className={`font-mono text-xs tracking-widest uppercase px-2 py-1 border ${details.borderColor} ${details.labelColor}`}>
                {result.classification.replace('_', ' ')}
            </span>
        </div>

        <div className="h-48 w-48 relative mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={65}
                startAngle={90}
                endAngle={-270}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={details.color} className="text-black dark:text-white" />
                <Cell fill="var(--chart-bg, #e5e5e5)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Central Percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-neutral-900 dark:text-white">
            <span className="text-3xl font-bold font-mono tracking-tighter">
                {(result.confidence * 100).toFixed(0)}%
            </span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Probability</span>
          </div>
          
          {/* Inline style hack for chart bg in light/dark modes */}
          <style>{`
            :root { --chart-bg: #f5f5f5; }
            .dark { --chart-bg: #1a1a1a; }
          `}</style>
        </div>

        <h3 className="text-3xl font-light text-neutral-900 dark:text-white mb-2 text-center tracking-tight">{result.label}</h3>
        <p className="text-neutral-600 dark:text-neutral-500 text-center text-sm leading-relaxed max-w-xs mx-auto font-mono">
            {result.reasoning}
        </p>
        
        <div className="mt-8 w-full border-t border-neutral-200 dark:border-neutral-900 pt-6">
            <div className="grid grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-900">
                <div className="bg-neutral-50 dark:bg-black p-4 text-center">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Status</div>
                    <div className={`text-sm font-mono font-bold ${details.labelColor}`}>
                        {details.status}
                    </div>
                </div>
                <div className="bg-neutral-50 dark:bg-black p-4 text-center">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Directive</div>
                    <div className="text-sm font-mono text-neutral-900 dark:text-white">
                        {details.directive}
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-8 flex justify-center gap-6">
            {onRerun && (
                <button 
                    onClick={onRerun}
                    disabled={isProcessing}
                    className="text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 text-xs font-mono tracking-widest uppercase transition-colors disabled:opacity-50"
                >
                    [ {isProcessing ? 'CALCULATING...' : 'RERUN ANALYSIS'} ]
                </button>
            )}
            
            {onDismiss && (
                <button 
                    onClick={onDismiss}
                    className="text-neutral-400 hover:text-neutral-900 dark:text-neutral-600 dark:hover:text-white text-xs font-mono tracking-widest uppercase transition-colors"
                >
                    [ {resetLabel || 'RESET SYSTEM'} ]
                </button>
            )}
        </div>
      </div>
    </div>
  );
};