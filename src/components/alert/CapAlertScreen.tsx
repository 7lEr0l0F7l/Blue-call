import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  FileCode,
  Send,
  Building2,
  MapPin,
  Clock,
  Radio,
  Anchor,
  Compass,
  ArrowRight,
  Code2,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
} from 'lucide-react';
import { EmergencyAlert, AIAnalysisResult } from '../../types';
import { emergencyAlertService } from '../../services/MockEmergencyAlertService';
import { StandardBadge } from '../common/StandardBadge';

interface CapAlertScreenProps {
  analysis: AIAnalysisResult;
  onProceedToTransmission: (alert: EmergencyAlert) => void;
  onBackToAi: () => void;
  onOpenStandards: () => void;
}

export const CapAlertScreen: React.FC<CapAlertScreenProps> = ({
  analysis,
  onProceedToTransmission,
  onBackToAi,
  onOpenStandards,
}) => {
  const [alertData] = useState<EmergencyAlert>(() =>
    emergencyAlertService.convertToCapAlert(analysis)
  );
  const [showXmlCode, setShowXmlCode] = useState(false);

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-2 select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center text-white shadow shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base text-white whitespace-nowrap">해상 긴급경보 (CAP)</h2>
              <p className="text-[11px] text-red-400 font-medium">표준 구조화 데이터 생성 완료</p>
            </div>
          </div>

          <span className="text-[10px] bg-red-950 text-red-300 border border-red-800/80 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 shrink-0 whitespace-nowrap">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            표준 경보 포맷
          </span>
        </div>
      </div>

      {/* Main CAP Structured Alert Card (Mandatory layout from Section 11) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-red-500/50 rounded-2xl p-4 shadow-xl space-y-3.5"
      >
        {/* Top Identification strip */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-md animate-pulse">
              상태: 긴급 (EMERGENCY)
            </span>
            <span className="text-xs font-bold text-red-300">
              사고유형: {alertData.incidentType}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {alertData.alertId}
          </span>
        </div>

        {/* Structured Grid Table */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">선박명</span>
            <span className="font-bold text-white text-sm">{alertData.vesselName}</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">MMSI (선박식별번호)</span>
            <span className="font-bold font-mono text-blue-300 text-sm">{alertData.mmsi}</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              발생 위치 (WGS84)
            </span>
            <span className="font-bold font-mono text-slate-200">
              {alertData.latitude.toFixed(4)} / {alertData.longitude.toFixed(4)}
            </span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              발생 시각
            </span>
            <span className="font-mono text-slate-200 text-[11px] font-medium">{alertData.occurredAt}</span>
          </div>

          <div className="col-span-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">상황 (Situation)</span>
            <p className="font-semibold text-slate-100 leading-snug">
              {alertData.situation}
            </p>
          </div>

          <div className="col-span-2 bg-red-950/40 p-2.5 rounded-xl border border-red-600/40 space-y-1">
            <span className="text-red-300 font-bold text-[11px] block">요청사항 (Requested Action)</span>
            <p className="text-xs text-white font-medium leading-snug">
              {alertData.requestedAction}
            </p>
          </div>
        </div>

        {/* XML Raw Data Viewer toggle for technical validation */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowXmlCode(!showXmlCode)}
            className="w-full px-3 py-2 text-left flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              CAP 1.2 표준 XML 데이터 페이로드 확인
            </span>
            {showXmlCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showXmlCode && (
            <div className="p-3 bg-slate-950 border-t border-slate-800 font-mono text-[10px] text-emerald-400 overflow-x-auto max-h-48 whitespace-pre leading-snug">
              {alertData.xmlRepresentation}
            </div>
          )}
        </div>
      </motion.div>

      {/* Bottom Dispatch Button */}
      <div className="pt-2 space-y-2">
        <button
          id="proceed-agency-dispatch-btn"
          type="button"
          onClick={() => onProceedToTransmission(alertData)}
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-xl shadow-blue-950/80 border border-blue-400/40 flex items-center justify-center gap-2 transition-all"
        >
          <Building2 className="w-4 h-4" />
          <span>관계기관 전달</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between text-xs px-1">
          <button
            type="button"
            onClick={onBackToAi}
            className="text-slate-400 hover:text-slate-200"
          >
            ← AI 분석 결과로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
