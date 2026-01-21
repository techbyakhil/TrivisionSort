import { HistoryItem, AnalysisResult } from '../types';

const HISTORY_KEY = 'trivision_history_log';
const MAX_ITEMS = 20;

export const historyService = {
  save: (result: AnalysisResult, imageBase64: string) => {
    try {
      const historyStr = localStorage.getItem(HISTORY_KEY);
      let history: HistoryItem[] = historyStr ? JSON.parse(historyStr) : [];

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date(),
        result,
        imageThumbnail: imageBase64 
      };

      // Add to beginning
      history.unshift(newItem);

      // Trim to max items to prevent quota issues
      if (history.length > MAX_ITEMS) {
        history = history.slice(0, MAX_ITEMS);
      }

      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history:", e);
      // Likely quota exceeded. In a real app, we'd handle resizing or aggressive cleanup here.
    }
  },

  getAll: (): HistoryItem[] => {
    try {
      const historyStr = localStorage.getItem(HISTORY_KEY);
      if (!historyStr) return [];
      const history = JSON.parse(historyStr);
      // Convert timestamp strings back to Date objects
      return history.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
      }));
    } catch (e) {
      console.error("Failed to load history:", e);
      return [];
    }
  },
  
  clear: () => {
      localStorage.removeItem(HISTORY_KEY);
  }
};