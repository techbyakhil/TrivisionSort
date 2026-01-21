export enum AppMode {
  HOME = 'HOME',
  UPLOAD = 'UPLOAD',
  SCAN = 'SCAN',
}

export enum ClassificationType {
  WET_WASTE = 'WET_WASTE',
  DRY_WASTE = 'DRY_WASTE',
  BURNABLE_WASTE = 'BURNABLE_WASTE',
  INERT_WASTE = 'INERT_WASTE',
  HAZARDOUS_WASTE = 'HAZARDOUS_WASTE',
  BULKY_WASTE = 'BULKY_WASTE',
  NOT_WASTE = 'NOT_WASTE',
  UNKNOWN = 'UNKNOWN'
}

export interface AnalysisResult {
  classification: ClassificationType;
  confidence: number;
  label: string;
  reasoning: string;
}

export interface HistoryItem {
  id: string;
  timestamp: Date;
  result: AnalysisResult;
  imageThumbnail: string; // Base64
}

export interface User {
  username: string;
  password?: string; // In a real app, this would be hashed
  createdAt: number;
}