import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  History as HistoryIcon,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  AlertTriangle,
  Bot,
  ShieldCheck,
  MapPin,
  Clock,
  ChevronRight,
  X,
  Lock,
  Anchor,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { CallLog } from '../../types';
import { INITIAL_CALL_LOGS } from '../../data/mockData';

interface HistoryScreenProps {
  logs?: CallLog[];
  onClearLogs?: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  logs = INITIAL_CALL_LOGS,
  onClearLogs,
}) => {
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);
  const [callLogs, setCallLogs] = useState<CallLog[]>(logs);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleClearAll = () => {
    if (confirm('저장된 모든 통화 및 AI 분석 기록을 삭제하시겠습니까? (TTAK.KO-12.0414 개인정보 보호)')) {
      setCallLogs([]);
      if (onClearLogs) onClearLogs();
    }
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <HistoryIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-base text-white">통화 및 AI 요약 기록</h2>
            <p className="text-[11px] text-slate-400">안심번호 통화 내역 및 AI 구조화 요약</p>
          </div>
        </div>

        {callLogs.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
            title="기록 전체 삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">전체 삭제</span>
          </button>
        )}
      </div>

      {/* List of Call Logs */}
      <div className="flex-1 space-y-2.5">
        {callLogs.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-2 text-slate-400 my-8">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="font-semibold text-sm text-slate-300">저장된 통신기록이 없습니다.</p>
            <p className="text-xs text-slate-500">
              TTAK.KO-12.0414 규정에 따라 통신기록이 안전하게 비식별화 및 삭제되었습니다.
            </p>
          </div>
        ) : (
          callLogs.map((log) => {
            const isEmergency = log.callType === 'EMERGENCY' || log.aiSummary?.urgency === 'HIGH';

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedLog(log)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-md ${
                  isEmergency
                    ? 'bg-slate-900 border-red-500/40 hover:border-red-400'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isEmergency
                          ? 'bg-red-950 text-red-400 border border-red-700/60'
                          : 'bg-slate-800 text-blue-400 border border-slate-700'
                      }`}
                    >
                      {isEmergency ? (
                        <AlertTriangle className="w-5 h-5 animate-pulse" />
                      ) : log.callType === 'INCOMING' ? (
                        <PhoneIncoming className="w-5 h-5" />
                      ) : (
                        <PhoneOutgoing className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-white">{log.vessel.name}</h3>
                        {isEmergency && (
                          <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                            긴급
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        MMSI: <span className="text-slate-300">{log.vessel.mmsi}</span>
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                        <span>{log.startTime}</span>
                        <span className="text-blue-300 font-semibold">
                          통화 {formatDuration(log.durationSeconds)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                      {log.vessel.maskedNumber}
                    </span>
                    <span className="text-xs text-blue-400 flex items-center gap-0.5 font-medium">
                      <span>요약 보기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {log.aiSummary && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-300 truncate max-w-[260px] text-[11px]">
                      AI 요약: {log.aiSummary.summary}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono shrink-0">
                      마스킹 완료 ✓
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Detail Modal Dialog */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]"
            >
              <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-base text-white">AI 통화 요약 상세</h3>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-3.5">
                {/* Vessel Identity */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-base text-white">{selectedLog.vessel.name}</h4>
                    <p className="text-xs text-slate-400 font-mono">
                      MMSI: {selectedLog.vessel.mmsi} · {selectedLog.vessel.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-300 font-mono block">
                      {selectedLog.vessel.maskedNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      통화시간 {formatDuration(selectedLog.durationSeconds)}
                    </span>
                  </div>
                </div>

                {/* AI Call Summary Content */}
                <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/40 space-y-2">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Bot className="w-4 h-4" />
                    AI 통화 요약
                  </span>
                  <p className="text-sm font-medium text-slate-100 leading-relaxed bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    {selectedLog.aiSummary?.summary || '통화 내용 요약 정보가 존재하지 않습니다.'}
                  </p>
                </div>

                {/* Structured Attributes Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">사고유형</span>
                    <span className="font-bold text-red-400 text-sm">
                      {selectedLog.aiSummary?.incidentType || '일반통신'}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">긴급도</span>
                    <span className="font-bold text-amber-400 text-sm">
                      {selectedLog.aiSummary?.urgency === 'HIGH' ? '높음 (HIGH)' : '보통 (NORMAL)'}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">위치정보</span>
                    <span className="font-bold text-emerald-400 text-xs">
                      {selectedLog.aiSummary?.locationIncluded ? '포함 (35.2152, 129.2214)' : '미포함'}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">개인정보 마스킹</span>
                    <span className="font-bold text-emerald-400 text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      완료 (TTAK.KO-12.0414)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
