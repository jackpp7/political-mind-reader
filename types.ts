export interface AnalysisResult {
  official: string;
  inner: string;
  commentary: string;
  hypocrisyScore: number; // 0-100
  hypocrisyLabel: string; // e.g., "虛偽指數", "甩鍋等級"
}

export interface HistoryItem {
  id: string;
  subject: string;
  topic: string;
  result: AnalysisResult;
  timestamp: number;
}