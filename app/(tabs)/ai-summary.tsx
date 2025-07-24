import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Sparkles, Calendar, Heart, Lightbulb, MessageCircle } from 'lucide-react-native';
import { DiaryStorage } from '@/utils/storage';
import { GeminiService, AISummary } from '@/services/geminiService';
import { formatDate } from '@/utils/dateUtils';

export default function AISummaryScreen() {
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    try {
      // 過去1ヶ月分の日記を取得
      const allEntries = await DiaryStorage.getAllEntries();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const recentEntries = allEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= oneMonthAgo;
      });

      if (recentEntries.length === 0) {
        Alert.alert(
          '日記がありません',
          '要約するための日記がありません。まずは日記を書いてみてください。'
        );
        return;
      }

      const aiSummary = await GeminiService.generateDiarySummary(recentEntries);
      setSummary(aiSummary);
    } catch (error) {
      console.error('Summary generation failed:', error);
      Alert.alert(
        'エラー',
        'AI要約の生成に失敗しました。ネットワーク接続を確認して再度お試しください。'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Sparkles size={24} color="#6366f1" />
          <Text style={styles.headerTitle}>AI日記アシスタント</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!summary && !loading && (
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeIcon}>
              <Sparkles size={48} color="#6366f1" />
            </View>
            <Text style={styles.welcomeTitle}>AI日記アシスタント</Text>
            <Text style={styles.welcomeDescription}>
              過去1ヶ月間の日記をAIが分析して、{'\n'}
              出来事のまとめや感情の変化、{'\n'}
              そして心温まるアドバイスをお届けします。
            </Text>
            <TouchableOpacity 
              style={styles.generateButton} 
              onPress={generateSummary}
            >
              <Sparkles size={20} color="#ffffff" />
              <Text style={styles.generateButtonText}>AIと一緒に振り返る</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>AIが分析中です...</Text>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.loadingSubText}>
              あなたの日記を丁寧に読んでいます
            </Text>
          </View>
        )}

        {summary && !loading && (
          <View style={styles.summaryContainer}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>AI分析結果</Text>
              <TouchableOpacity 
                style={styles.regenerateButton} 
                onPress={generateSummary}
              >
                <Sparkles size={16} color="#6366f1" />
                <Text style={styles.regenerateButtonText}>再分析</Text>
              </TouchableOpacity>
            </View>

            {/* 今月の出来事まとめ */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Calendar size={20} color="#6366f1" />
                <Text style={styles.sectionTitle}>今月の出来事まとめ</Text>
              </View>
              <Text style={styles.sectionContent}>{summary.eventsummary}</Text>
            </View>

            {/* 感情の分析 */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Heart size={20} color="#ec4899" />
                <Text style={styles.sectionTitle}>感情の分析</Text>
              </View>
              <Text style={styles.sectionContent}>{summary.emotionalAnalysis}</Text>
            </View>

            {/* 改善点・アドバイス */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Lightbulb size={20} color="#f59e0b" />
                <Text style={styles.sectionTitle}>改善点・アドバイス</Text>
              </View>
              <Text style={styles.sectionContent}>{summary.improvements}</Text>
            </View>

            {/* 励ましのメッセージ */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <MessageCircle size={20} color="#10b981" />
                <Text style={styles.sectionTitle}>励ましのメッセージ</Text>
              </View>
              <Text style={styles.sectionContent}>{summary.encouragement}</Text>
            </View>
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  content: {
    flex: 1,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  welcomeIcon: {
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
    elevation: 3,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 16,
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    width: '100%',
    borderRadius: 2,
  },
  loadingSubText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  summaryContainer: {
    padding: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  regenerateButtonText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  sectionContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
});