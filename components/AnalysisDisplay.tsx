import React, { useState, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { MicrophoneIcon, BrainIcon, TeaIcon, CopyIcon, CheckIcon } from './Icons';

interface Props {
  data: AnalysisResult;
  subject: string;
  topic: string; 
}

// Meter Component
const HypocrisyMeter = ({ score, label }: { score: number, label: string }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to target
    const duration = 1500;
    const startTime = Date.now();
    const endScore = score;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      
      setDisplayScore(Math.floor(endScore * ease));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [score]);

  // Calculate color based on score
  const getColor = (val: number) => {
    if (val < 40) return 'text-green-600 stroke-green-600';
    if (val < 75) return 'text-yellow-600 stroke-yellow-600';
    return 'text-red-600 stroke-red-600';
  };

  const colorClass = getColor(displayScore);
  
  // Gauge calculations
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // We only want a semi-circle (180 degrees)
  const arcLength = circumference / 2;
  const strokeDashoffset = arcLength - (displayScore / 100) * arcLength;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border-2 border-ink-900 mb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-600 opacity-20"></div>
      
      <h3 className="text-xl font-bold text-ink-900 mb-2 font-serif tracking-widest uppercase">
        {label}
      </h3>
      
      <div className="relative w-48 h-28 overflow-hidden flex justify-center items-end">
         {/* Background Arc */}
        <svg height="100%" width="100%" viewBox="0 0 200 110" className="absolute bottom-0">
           <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
            strokeLinecap="round"
           />
        </svg>

        {/* Progress Arc */}
        <svg height="100%" width="100%" viewBox="0 0 200 110" className="absolute bottom-0 z-10">
           <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            className={`transition-all duration-75 ${colorClass}`}
            strokeWidth="20"
            strokeLinecap="round"
            style={{
              strokeDasharray: `${arcLength} ${circumference}`,
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 0.1s linear' // smoother handled by state
            }}
           />
        </svg>

        {/* Score Text */}
        <div className={`text-5xl font-black font-sans z-20 mb-[-5px] ${colorClass}`}>
          {displayScore}
          <span className="text-2xl font-bold ml-1">%</span>
        </div>
      </div>
      
      <p className="text-gray-400 text-xs mt-4 font-mono">MEASURED BY AI-9000</p>
    </div>
  );
};

const CopyButton = ({ text, label = "" }: { text: string, label?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded-full hover:bg-black/5 transition-colors text-gray-500 hover:text-ink-900 flex items-center gap-2 ${label ? 'px-4 bg-gray-100 hover:bg-gray-200' : ''}`}
      title={label || "複製文字"}
    >
      {copied ? <CheckIcon className="w-5 h-5 text-green-600" /> : <CopyIcon className="w-5 h-5" />}
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      {label && copied && <span className="text-sm font-medium text-green-600">已複製</span>}
    </button>
  );
};

const Card = ({ title, icon: Icon, content, bgColor, borderColor, fontClass }: any) => (
  <div className={`relative overflow-hidden rounded-lg border-2 ${borderColor} ${bgColor} p-6 shadow-md transition-all duration-500 hover:shadow-lg mb-6 group`}>
    <div className="flex items-center justify-between mb-4 border-b border-black/10 pb-2">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full bg-white/50 border border-black/10 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-ink-900" />
        </div>
        <h3 className="text-xl font-bold text-ink-900 font-serif tracking-wide">{title}</h3>
      </div>
      <CopyButton text={content} />
    </div>
    <div className={`text-ink-800 leading-relaxed text-lg whitespace-pre-wrap ${fontClass}`}>
      {content}
    </div>
  </div>
);

export const AnalysisDisplay: React.FC<Props> = ({ data, subject, topic }) => {
  
  const generateFullReport = () => {
    return `【政治讀心術分析報告】\n\n` +
           `🎯 對象：${subject}\n` +
           `⚡ 事件：${topic}\n\n` +
           `📟 ${data.hypocrisyLabel}：${data.hypocrisyScore}%\n\n` +
           `🎤 表面官方說法：\n${data.official}\n\n` +
           `🧠 真實內心獨白：\n${data.inner}\n\n` +
           `🍵 腐儒點評：\n${data.commentary}\n\n` +
           `(分析結果僅供娛樂)`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in-up pb-10">
      <div className="text-center mb-8 relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
            <span className="bg-paper-100 px-4 text-sm text-gray-500">分析完成</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-3xl font-serif font-bold text-ink-900 mb-2">
          關於「{subject}」的深度剖析
        </h2>
        <p className="text-gray-500">針對「{topic}」的反應</p>
      </div>

      {/* New Hypocrisy Meter */}
      <HypocrisyMeter score={data.hypocrisyScore} label={data.hypocrisyLabel} />

      <Card 
        title="表面官方說法" 
        icon={MicrophoneIcon} 
        content={data.official} 
        bgColor="bg-white" 
        borderColor="border-gray-200"
        fontClass="font-sans"
      />

      <Card 
        title="真實內心獨白" 
        icon={BrainIcon} 
        content={data.inner} 
        bgColor="bg-slate-100" 
        borderColor="border-slate-300"
        fontClass="font-sans italic text-slate-900"
      />

      <Card 
        title="腐儒的幽幽點評" 
        icon={TeaIcon} 
        content={data.commentary} 
        bgColor="bg-stone-200" 
        borderColor="border-stone-400"
        fontClass="font-serif text-stone-900 font-medium"
      />

      {/* Action Bar */}
      <div className="flex justify-center pt-4 border-t border-gray-200">
        <CopyButton text={generateFullReport()} label="複製完整分析報告" />
      </div>
    </div>
  );
};