import React from 'react';
import { motion } from 'motion/react';
import {
  FileCheck,
  Radio,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';
import { TTA_STANDARDS } from '../../data/mockData';

interface StandardsScreenProps {
  onBack: () => void;
  onNavigateToFeature: (screen: string) => void;
}

export const StandardsScreen: React.FC<StandardsScreenProps> = ({
  onBack,
  onNavigateToFeature,
}) => {
  const getStandardIcon = (code: string) => {
    if (code.includes('0619')) return <Radio className="w-5 h-5 text-blue-400" />;
    if (code.includes('0410')) return <MessageSquare className="w-5 h-5 text-cyan-400" />;
    if (code.includes('0055')) return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-y-auto p-4 space-y-4">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-2 select-none">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold whitespace-nowrap"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>설정으로 돌아가기</span>
          </button>
          <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded font-bold font-mono whitespace-nowrap">
            기술 사양서
          </span>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-base text-white whitespace-nowrap">적용 기술 및 표준 안내</h2>
            <p className="text-xs text-blue-200">해상 안전통신 고도화를 위한 참조 ICT 표준 규격</p>
          </div>
        </div>

        {/* Design Philosophy Note */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 mt-2 text-xs text-slate-300 leading-relaxed">
          Blue Call은 해상 통신 서비스의 연결성, 긴급정보 처리, 개인정보 보호를 위해 관련 ICT 기술과 표준을 참고하여 설계되었습니다.
        </div>
      </div>

      {/* 4 Standards Cards (Mandatory from Section 15) */}
      <div className="space-y-3.5">
        {TTA_STANDARDS.map((std, idx) => {
          const numberSymbol = ['①', '②', '③', '④'][idx];

          return (
            <motion.div
              key={std.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-slate-900 border-2 border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 shadow-lg space-y-3 transition-all"
            >
              {/* Top Title & Code */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getStandardIcon(std.code)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-black text-amber-400 font-mono">
                        {numberSymbol}
                      </span>
                      <h3 className="font-bold text-sm text-white font-mono">{std.code}</h3>
                    </div>
                    <p className="text-xs font-semibold text-blue-300 mt-0.5">{std.title}</p>
                  </div>
                </div>

                <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800 shrink-0 font-medium">
                  {std.badge}
                </span>
              </div>

              {/* Standard Application Description */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold shrink-0">적용:</span>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    {std.applicationArea}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-1.5">
                  {std.detailDesc}
                </p>
              </div>

              {/* Link to actual App Screen (Mandatory from Section 15) */}
              <button
                type="button"
                id={`check-standard-btn-${idx + 1}`}
                onClick={() => onNavigateToFeature(std.targetScreen)}
                className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white border border-blue-500/40 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-[0.99] transition-all"
              >
                <span>앱에서 확인</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Technical Reference Footer */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center space-y-1">
        <p className="text-xs font-semibold text-slate-300">
          Blue Call 해상 안전통신 참조 표준 사양
        </p>
        <p className="text-[10px] text-slate-500 font-mono">
          TTAK.KO-06.0619 · TTAK.KO-06.0410/R9 · TTAK.OT-06.0055/R4 · TTAK.KO-12.0414
        </p>
      </div>
    </div>
  );
};
