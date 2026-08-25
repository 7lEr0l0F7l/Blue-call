import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Bot,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Anchor,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileCode,
  Lock,
  RotateCw,
} from 'lucide-react';
import { Vessel, AIAnalysisResult } from '../../types';
import { aiSummaryService } from '../../services/FakeAiSummaryService';
import { StandardBadge } from '../common/StandardBadge';

interface AiAnalysisScreenProps {
  vessel: Vessel;
  sourceText?: string;
  onGenerateCapAlert: (analysis: AIAnalysisResult) => void;
  onBackToChat: () => void;
  onOpenStandards: () => void;
}

export const AiAnalysisScreen: React.FC<AiAnalysisScreenProps> = ({
  vessel,
  sourceText = '기관 고장입니다. 추진이 안 됩니다.',
  onGenerateCapAlert,
  onBackToChat,
  onOpenStandards,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await aiSummaryService.analyzeText(sourceText, vessel.name, vessel.mmsi);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    runAnalysis();
  }, [sourceText, vessel]);

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-y-auto p-4 space-y-4">
      {/* Top Header & Standards Indicator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-2 select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-white shadow shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-sm text-white flex items-center gap-1.5 whitespace-nowrap">
                AI 긴급상황 구조화 분석
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h2>
              <p className="text-[11px] text-slate-400">자연어 통신에서 핵심 조난/사고 정보 자동 추출</p>
            </div>
          </div>

          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 shrink-0 whitespace-nowrap">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            비식별화 보호
          </span>
        </div>

        {/* Analyzed Target Source Message Box */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold text-blue-300">분석 대상 원문 메시지:</span>
            <span>{vessel.name} (MMSI: {vessel.mmsi})</span>
          </div>
          <p className="text-white font-medium bg-slate-900/90 p-2 rounded-lg border border-slate-800">
            "{sourceText}"
          </p>
        </div>
      </div>

      {/* Loading State Animation */}
      {isAnalyzing ? (
        <div className="my-8 flex flex-col items-center justify-center p-8 space-y-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
            <Bot className="w-8 h-8 text-blue-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="text-center space-y-1.5">
            <p className="text-sm font-bold text-white">
              AI 긴급도 및 사고 맥락 분석 중...
            </p>
            <p className="text-xs text-emerald-400 flex items-center justify-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              개인정보(전화번호·성명) 비식별화 마스킹 처리 중
            </p>
          </div>
        </div>
      ) : analysisResult ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-3"
        >
          {/* Privacy Protection Success Badge (Mandatory requirement) */}
          <div className="bg-emerald-950/80 border-2 border-emerald-500/60 p-3 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-300 block">
                  전화번호 등 개인정보 마스킹 완료 ✓
                </span>
                <span className="text-[10px] text-emerald-200">
                  민감정보(전화번호, 주민번호 등) 비식별화 후 온디바이스/보안 클라우드 추론
                </span>
              </div>
            </div>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>

          {/* AI Structured Result Card */}
          <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">AI 분석 결과</span>
                <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  긴급도: 높음 (HIGH)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {analysisResult.analyzedAt}
              </span>
            </div>

            {/* Structured Fields Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">사고 유형:</span>
                <span className="font-bold text-red-400 text-sm">{analysisResult.incidentType}</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">선박 / MMSI:</span>
                <span className="font-bold text-slate-200">
                  {analysisResult.vesselName} ({analysisResult.mmsi})
                </span>
              </div>

              <div className="col-span-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] block">핵심 내용:</span>
                <p className="font-semibold text-slate-100 leading-snug">
                  {analysisResult.keyContent}
                </p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-400" />
                  발생 위치:
                </span>
                <span className="font-mono text-blue-300 font-bold">
                  {analysisResult.location.lat.toFixed(4)}, {analysisResult.location.lng.toFixed(4)}
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">자력항해 가능 여부:</span>
                <span className="font-bold text-amber-400">
                  {analysisResult.canSelfNavigate ? '가능' : '불가능 (지원 필요)'}
                </span>
              </div>

              <div className="col-span-2 bg-gradient-to-r from-blue-950/80 to-indigo-950/80 p-2.5 rounded-xl border border-blue-600/40 space-y-1">
                <span className="text-blue-300 font-bold text-[11px] block">권장 조치:</span>
                <p className="text-xs text-slate-200 leading-snug">
                  {analysisResult.recommendedAction}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Footer Action Buttons */}
      <div className="pt-2 space-y-2">
        <button
          id="generate-cap-alert-btn"
          type="button"
          disabled={isAnalyzing || !analysisResult}
          onClick={() => analysisResult && onGenerateCapAlert(analysisResult)}
          className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-lg shadow-red-950/60 border border-red-400/40 flex items-center justify-center gap-2 transition-all"
        >
          <FileCode className="w-4 h-4" />
          <span>표준 긴급경보(CAP) 생성</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between text-xs px-1">
          <button
            type="button"
            onClick={onBackToChat}
            className="text-slate-400 hover:text-slate-200"
          >
            ← 채팅으로 돌아가기
          </button>

          <button
            type="button"
            onClick={runAnalysis}
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <RotateCw className="w-3 h-3" />
            <span>재분석</span>
          </button>
        </div>
      </div>
    </div>
  );
};
