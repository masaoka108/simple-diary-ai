import { GoogleGenerativeAI } from '@google/generative-ai';
import { DiaryEntry } from '@/types/diary';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Gemini API key is not configured');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface AISummary {
  eventsummary: string;
  emotionalAnalysis: string;
  improvements: string;
  encouragement: string;
}

export const GeminiService = {
  async generateDiarySummary(entries: DiaryEntry[]): Promise<AISummary> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // 日記エントリーをテキストに変換
      const diaryText = entries
        .map(entry => `【${entry.date}】\n${entry.content}`)
        .join('\n\n');

      const prompt = `
以下は過去1ヶ月間の日記です。この内容を分析して、以下の4つのセクションに分けて日本語で回答してください：

1. 今月の出来事まとめ：主要な出来事や活動を簡潔にまとめてください
2. 感情の分析：日記から読み取れる感情の変化や傾向を分析してください
3. 改善点・アドバイス：生活や心の健康のための具体的な改善提案をしてください
4. 励ましのメッセージ：温かく前向きな励ましの言葉をください

回答は以下のJSON形式で返してください：
{
  "eventsummary": "今月の出来事まとめの内容",
  "emotionalAnalysis": "感情の分析の内容", 
  "improvements": "改善点・アドバイスの内容",
  "encouragement": "励ましのメッセージの内容"
}

日記の内容：
${diaryText}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // JSONレスポンスをパース
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }
      
      const summary = JSON.parse(jsonMatch[0]);
      return summary;
    } catch (error) {
      console.error('Failed to generate summary:', error);
      throw error;
    }
  },
};