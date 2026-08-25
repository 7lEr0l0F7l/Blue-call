import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Radio,
  PhoneCall,
  X,
  ShieldCheck,
  Cpu,
  Lock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Vessel } from '../../types';
import { networkOpenApiService, ConnectionStep } from '../../services/MockNetworkOpenApiService';

interface NetworkConnectionModalProps {
  vessel: Vessel;
  onClose: () => void;
  onCallStart: (vessel: Vessel) => void;
}

export const NetworkConnectionModal: React.FC<NetworkConnectionModalProps> = ({
  vessel,
  onClose,
  onCallStart,
}) => {
  const [steps, setSteps] = useState<ConnectionStep[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTechnicalLogs, setShowTechnicalLogs] = useState(false);
  const [sessionData, setSessionData] = useState<{
    sessionId: string;
    safeNumber: string;
    targetMmsi: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    networkOpenApiService
      .requestSafeConnection(vessel.mmsi, (updatedSteps) => {
        if (isMounted) {
          setSteps(updatedSteps);
        }
      })
      .then((res) => {
        if (isMounted) {
          setSessionData(res);
          setIsCompleted(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [vessel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">이동통신망 안심 연결</h3>
              <p className="text-xs text-blue-300 font-mono">대상: {vessel.name} (MMSI: {vessel.mmsi})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Top Status Card */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">
                실제 전화번호 비공개 보호 모드
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
              {vessel.maskedNumber}
            </span>
          </div>

          {/* 4 Steps Checklist */}
          <div className="space-y-3">
            {steps.map((s) => {
              const isWaiting = s.status === 'WAITING';
              const isInProgress = s.status === 'IN_PROGRESS';
              const isStepCompleted = s.status === 'COMPLETED';

              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isStepCompleted
                      ? 'bg-slate-950/90 border-emerald-500/40 text-slate-100'
                      : isInProgress
                      ? 'bg-blue-950/50 border-blue-500/60 text-white shadow-md'
                      : 'bg-slate-950/30 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isStepCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        </div>
                      ) : isInProgress ? (
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-700 text-slate-500 flex items-center justify-center text-xs">
                          {s.step}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isStepCompleted ? 'text-emerald-300' : isInProgress ? 'text-blue-300' : 'text-slate-400'}`}>
                          {s.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {isStepCompleted ? '완료 ✓' : isInProgress ? '연동 중...' : '대기'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                        {s.detail}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Technical Protocol Log */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowTechnicalLogs(!showTechnicalLogs)}
              className="w-full px-3 py-2 text-left flex items-center justify-between text-xs text-slate-400 hover:text-slate-200"
            >
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                네트워크 Open API 연결 프로토콜 로그 확인
              </span>
              {showTechnicalLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTechnicalLogs && (
              <div className="p-3 bg-slate-950 border-t border-slate-800 font-mono text-[10px] text-emerald-400 space-y-1 overflow-x-auto">
                <div className="text-slate-400 font-semibold mb-1">=== Open API Telemetry Stream ===</div>
                {steps.map((s, idx) => (
                  <div key={idx} className="leading-tight">
                    <span className="text-blue-400">[{s.step}]</span> {s.technicalLog}
                  </div>
                ))}
                {sessionData && (
                  <div className="text-amber-300 pt-1 border-t border-slate-800 mt-1">
                    SESSION_ESTABLISHED: id={sessionData.sessionId}, mask={sessionData.safeNumber}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
          {isCompleted ? (
            <div className="space-y-2">
              <div className="bg-emerald-950/60 border border-emerald-500/50 p-2.5 rounded-xl text-center">
                <p className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  안전하게 연결되었습니다.
                </p>
                <p className="text-[11px] text-emerald-200 mt-0.5">
                  가상 안심번호 채널이 생성되어 통화 준비가 완료되었습니다.
                </p>
              </div>
              <button
                id="start-call-now-btn"
                type="button"
                onClick={() => onCallStart(vessel)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>통화 시작</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="py-2 text-center text-xs text-blue-300 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span>이동통신사 오픈 API망과 안전 세션을 협상하는 중입니다...</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
