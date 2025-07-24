import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryEntry } from '@/types/diary';

const DIARY_STORAGE_KEY = 'diary_entries';

export const DiaryStorage = {
  async getAllEntries(): Promise<DiaryEntry[]> {
    try {
      const data = await AsyncStorage.getItem(DIARY_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load diary entries:', error);
      return [];
    }
  },

  async saveEntry(entry: DiaryEntry): Promise<void> {
    try {
      const entries = await this.getAllEntries();
      const existingIndex = entries.findIndex(e => e.id === entry.id);
      
      if (existingIndex >= 0) {
        entries[existingIndex] = entry;
      } else {
        entries.push(entry);
      }
      
      await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save diary entry:', error);
      throw error;
    }
  },

  async deleteEntry(id: string): Promise<void> {
    try {
      const entries = await this.getAllEntries();
      const filteredEntries = entries.filter(e => e.id !== id);
      await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(filteredEntries));
    } catch (error) {
      console.error('Failed to delete diary entry:', error);
      throw error;
    }
  },

  async getEntriesByDate(date: string): Promise<DiaryEntry[]> {
    try {
      const entries = await this.getAllEntries();
      return entries
        .filter(entry => entry.date === date)
        .sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      console.error('Failed to get entries by date:', error);
      return [];
    }
  },

  async getDatesWithEntries(): Promise<string[]> {
    try {
      const entries = await this.getAllEntries();
      const dates = [...new Set(entries.map(entry => entry.date))];
      return dates.sort();
    } catch (error) {
      console.error('Failed to get dates with entries:', error);
      return [];
    }
  }
};