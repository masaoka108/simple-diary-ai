import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { router } from 'expo-router';
import { Plus, CreditCard as Edit3, Trash2, Sparkles } from 'lucide-react-native';
import { DiaryStorage } from '@/utils/storage';
import { DiaryEntry } from '@/types/diary';
import { formatDate, formatTime, formatDisplayDate, isToday } from '@/utils/dateUtils';
import { useFocusEffect } from '@react-navigation/native';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [markedDates, setMarkedDates] = useState<any>({});
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const datesWithEntries = await DiaryStorage.getDatesWithEntries();
      const entriesForDate = await DiaryStorage.getEntriesByDate(selectedDate);
      
      // Mark dates with entries
      const marked: any = {};
      datesWithEntries.forEach(date => {
        marked[date] = {
          marked: true,
          dotColor: '#6366f1',
        };
      });
      
      // Highlight selected date
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#6366f1',
        selectedTextColor: '#ffffff',
      };
      
      setMarkedDates(marked);
      setEntries(entriesForDate);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const goToToday = () => {
    const today = formatDate(new Date());
    setSelectedDate(today);
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    router.push({
      pathname: '/write',
      params: { 
        editId: entry.id,
        editContent: entry.content,
        editDate: entry.date,
      },
    });
  };

  const handleDeleteEntry = (entry: DiaryEntry) => {
    Alert.alert(
      '日記を削除',
      'この日記を削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await DiaryStorage.deleteEntry(entry.id);
              loadData();
            } catch (error) {
              Alert.alert('エラー', '日記の削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  const handleWriteNew = () => {
    router.push({
      pathname: '/write',
      params: { date: selectedDate },
    });
  };

  const handleAIReflection = () => {
    router.push('/ai-summary');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>シンプル日記</Text>
        <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
          <Text style={styles.todayButtonText}>今日</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <Calendar
        current={selectedDate}
        onDayPress={handleDateSelect}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#6b7280',
          selectedDayBackgroundColor: '#6366f1',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#6366f1',
          dayTextColor: '#1f2937',
          textDisabledColor: '#d1d5db',
          dotColor: '#6366f1',
          selectedDotColor: '#ffffff',
          arrowColor: '#6366f1',
          monthTextColor: '#1f2937',
          indicatorColor: '#6366f1',
          textDayFontWeight: '500',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        style={styles.calendar}
      />

      {/* Selected Date Info */}
      <View style={styles.dateInfo}>
        <Text style={styles.selectedDateText}>
          {formatDisplayDate(selectedDate)}
        </Text>
        {isToday(selectedDate) && (
          <View style={styles.todayBadge}>
            <Text style={styles.todayBadgeText}>今日</Text>
          </View>
        )}
      </View>

      {/* AI Reflection Button */}
      <View style={styles.aiButtonContainer}>
        <TouchableOpacity style={styles.aiReflectionButton} onPress={handleAIReflection}>
          <Sparkles size={20} color="#ffffff" />
          <Text style={styles.aiReflectionButtonText}>AIと一緒に振り返る</Text>
        </TouchableOpacity>
      </View>

      {/* Entries List */}
      <ScrollView style={styles.entriesList} showsVerticalScrollIndicator={false}>
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              この日の日記はまだありません
            </Text>
            <TouchableOpacity style={styles.writeButton} onPress={handleWriteNew}>
              <Plus size={20} color="#ffffff" />
              <Text style={styles.writeButtonText}>日記を書く</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {entries.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTime}>
                    {formatTime(entry.timestamp)}
                  </Text>
                  <View style={styles.entryActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditEntry(entry)}
                    >
                      <Edit3 size={16} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteEntry(entry)}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.entryContent}>{entry.content}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addMoreButton} onPress={handleWriteNew}>
              <Plus size={20} color="#6366f1" />
              <Text style={styles.addMoreButtonText}>もう一つ書く</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  todayButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  todayButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  calendar: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  todayBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d97706',
  },
  aiButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  aiReflectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  aiReflectionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  entriesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  writeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  writeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  entryCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTime: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  entryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  entryContent: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
    gap: 8,
  },
  addMoreButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
});