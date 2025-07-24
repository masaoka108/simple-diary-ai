import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Save, ArrowLeft } from 'lucide-react-native';
import { DiaryStorage } from '@/utils/storage';
import { DiaryEntry } from '@/types/diary';
import { formatDate, formatDisplayDate } from '@/utils/dateUtils';

export default function WriteScreen() {
  const params = useLocalSearchParams();
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  
  const editId = params.editId as string;
  const editContent = params.editContent as string;
  const targetDate = (params.date as string) || (params.editDate as string) || formatDate(new Date());
  const isEditing = !!editId;

  useEffect(() => {
    if (isEditing && editContent) {
      setContent(editContent);
    }
  }, [isEditing, editContent]);

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('エラー', '日記の内容を入力してください');
      return;
    }

    setSaving(true);
    try {
      const now = new Date();
      const entry: DiaryEntry = {
        id: editId || `diary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: content.trim(),
        date: targetDate,
        timestamp: isEditing ? Date.now() : now.getTime(),
        createdAt: isEditing ? new Date().toISOString() : now.toISOString(),
        updatedAt: now.toISOString(),
      };

      await DiaryStorage.saveEntry(entry);
      
      Alert.alert(
        '保存完了',
        isEditing ? '日記を更新しました' : '日記を保存しました',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('エラー', '日記の保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (content.trim() && content !== editContent) {
      Alert.alert(
        '確認',
        '保存せずに戻りますか？入力した内容は失われます。',
        [
          { text: 'キャンセル', style: 'cancel' },
          { text: '戻る', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? '日記を編集' : '日記を書く'}
        </Text>
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={saving}
        >
          <Save size={20} color="#ffffff" />
          <Text style={styles.saveButtonText}>
            {saving ? '保存中...' : '保存'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date Display */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {formatDisplayDate(targetDate)}
          </Text>
        </View>

        {/* Text Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={content}
            onChangeText={setContent}
            placeholder="今日はどんな一日でしたか？&#10;&#10;思ったこと、感じたこと、何でも自由に書いてみてください..."
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
            autoFocus={!isEditing}
          />
        </View>

        {/* Character Count */}
        <View style={styles.footer}>
          <Text style={styles.characterCount}>
            {content.length} 文字
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  dateContainer: {
    padding: 20,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  inputContainer: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  textInput: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
    padding: 20,
    minHeight: 300,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  characterCount: {
    fontSize: 14,
    color: '#9ca3af',
  },
});