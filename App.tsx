import React, { useState, useRef, useEffect } from 'react';
import { analyzePolitics } from './services/geminiService';
import { AnalysisResult } from './types';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { LoadingSpinner } from './components/Icons';

// Updated list of trending political figures for 2026 context
const PRESET_SUBJECTS = [
  "賴清德", "韓國瑜", "柯文哲", 
  "蕭美琴", "盧秀燕", "蔣萬安", 
  "黃國昌", "徐巧芯", "王世堅", "謝龍介"
];

// Updated list of political topics with a 2026 flavor
const PRESET_TOPICS = [
  "2014的黃國昌", "2026 縣市長選舉結果", "柯文哲京華城案二審", 
  "賴清德期中執政總檢討", "藍白合 2.0 破局", "盧秀燕備戰 2028", 
  "立法院修憲爭議", "大巨蛋第 101 次漏水", "AI 監管法案", "重啟核能公投"
];

// Fun loading messages updated for 2026 context
const LOADING_MESSAGES = [
  "正在穿越至 2026 年平行時空...",
  "正在掃描 2026 縣市長選舉數據...",
  "偵測到大量官方廢話，正在過濾...",
  "正在計算政治陰影面積...",
  "連線腦波中，訊號充滿了算計...",
  "AI 正在翻閱兩年前的舊帳...",
  "正在解讀 2026 年的「無心之過」...",
  "AI 感到一陣尷尬，正在努力憋笑...",
  "正在比對選前承諾與選後嘴臉...",
];

function App() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const resultRef = useRef<HTMLDivElement>(null);
  const loadingIntervalRef = useRef<number | null>(null);

  const startLoadingMessages = () => {
    let index = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    // Faster rotation (1000ms instead of 1500ms) to make it feel snappier
    loadingIntervalRef.current = window.setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[index]);
    }, 1000);
  };

  const stopLoadingMessages = () => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
  };

  const performAnalysis = async (sub: string, top: string) => {
    if (!sub.trim() || !top.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    startLoadingMessages();

    try {
      const data = await analyzePolitics(sub, top);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("AI 觀察家似乎喝醉了，請稍後再試或是換個話題。");
    } finally {
      stopLoadingMessages();
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performAnalysis(subject, topic);
  };

  const handleRandom = () => {
    const randomSubject = PRESET_SUBJECTS[Math.floor(Math.random() * PRESET_SUBJECTS.length)];
    const randomTopic = PRESET_TOPICS[Math.floor(Math.random() * PRESET_TOPICS.length)];
    setSubject(randomSubject);
    setTopic(randomTopic);
    // Removed auto-submit so user can review the random selection first
  };

  useEffect(() => {
    if (result && resultRef.current) {
      // Small delay to ensure render is done
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-paper-100 font-sans selection:bg-accent-red selection:text-white pb-20">
      {/* Header */}
      <header className="bg-ink-900 text-paper-50 py-8 shadow-xl border-b-4 border-accent-red relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-wider flex items-center justify-center gap-3">
            <span className="text-3xl">🍵</span> 政治讀心術 2026 <span className="text-3xl">🧠</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light italic">
            「看透政壇虛偽，笑看紅塵算計」
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10 max-w-4xl">
        
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8 mb-10 transform transition-all hover:shadow-xl relative overflow-hidden">
           {/* Decorative background element */}
           <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-accent-red/5 rounded-full blur-3xl pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Subject Input */}
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-bold text-ink-900 uppercase tracking-widest flex items-center gap-2">
                  目標人物 (Who)
                </label>
                <div className="relative">
                  <input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="例如：柯文哲"
                    className="w-full px-4 py-3 bg-paper-50 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-accent-red outline-none transition-colors text-lg"
                    required
                  />
                </div>
                {/* Subject Presets - Scrollable on mobile */}
                <div className="flex flex-wrap gap-2 pt-2 max-h-24 overflow-y-auto">
                  {PRESET_SUBJECTS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSubject(s)}
                      className={`text-xs px-2.5 py-1.5 rounded-full transition-all duration-200 border ${subject === s ? 'bg-ink-900 text-white border-ink-900' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-100'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Input */}
              <div className="space-y-2">
                <label htmlFor="topic" className="block text-sm font-bold text-ink-900 uppercase tracking-widest flex items-center gap-2">
                  事件或對象 (Reacting To)
                </label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="例如：2026 縣市長選舉結果"
                  className="w-full px-4 py-3 bg-paper-50 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-accent-red outline-none transition-colors text-lg"
                  required
                />
                {/* Topic Presets */}
                <div className="flex flex-wrap gap-2 pt-2 max-h-24 overflow-y-auto">
                  {PRESET_TOPICS.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      className={`text-xs px-2.5 py-1.5 rounded-full transition-all duration-200 border ${topic === t ? 'bg-ink-900 text-white border-ink-900' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-100'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
               <button
                type="button"
                onClick={handleRandom}
                disabled={loading}
                className="md:col-span-2 py-4 bg-white border-2 border-ink-900 text-ink-900 font-bold text-lg rounded-lg shadow-md hover:bg-gray-50 hover:shadow-lg transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 group"
              >
                <span className="group-hover:rotate-180 transition-transform duration-500">🎲</span> 
                <span>隨機大亂鬥</span>
              </button>

              <button
                type="submit"
                disabled={loading || !subject || !topic}
                className="md:col-span-3 py-4 bg-ink-900 hover:bg-ink-800 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <span>🔍 開始剖析</span>
                )}
              </button>
            </div>
            
            {/* Dynamic Loading Message */}
            {loading && (
              <div className="text-center mt-4 animate-pulse text-accent-red font-medium font-serif">
                {loadingMsg}
              </div>
            )}
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded shadow-sm flex items-start gap-3" role="alert">
            <span className="text-2xl">🥴</span>
            <div>
                <p className="font-bold">發生錯誤</p>
                <p>{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        <div ref={resultRef}>
          {result && <AnalysisDisplay data={result} subject={subject} topic={topic} />}
        </div>

        {/* Empty State / Intro */}
        {!result && !loading && !error && (
          <div className="text-center text-gray-500 py-8 px-4 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-6xl mb-4 opacity-20 grayscale filter">🎭</p>
            <h3 className="text-xl font-serif font-bold text-gray-400 mb-2">請輸入人物與事件</h3>
            <p className="max-w-md mx-auto text-sm mb-6">
              或是點擊「隨機大亂鬥」看看會發生什麼意想不到的化學反應。
            </p>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-ink-900 text-gray-400 py-6 text-center text-sm mt-auto border-t border-gray-800">
        <p>© 2026 政治讀心術 | Powered by Gemini 3</p>
      </footer>
    </div>
  );
}

export default App;