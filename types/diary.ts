export interface DiaryEntry {
  id: string;
  content: string;
  date: string; // YYYY-MM-DD format
  timestamp: number; // Unix timestamp for sorting
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}