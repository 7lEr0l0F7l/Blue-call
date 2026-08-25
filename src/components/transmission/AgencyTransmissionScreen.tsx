import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  RadioTower,
  Anchor,
  ShieldAlert,
  ArrowRight,
  Home,
  History,
  AlertTriangle,
  Send,
} from 'lucide-react';
import { EmergencyAlert, AgencyTransmissionStatus } from '../../types';
import { emergencyAlertService } from '../../services/MockEmergencyAlertService';

interface AgencyTransmissionScreenProps {
  alert: EmergencyAlert;
  onGoHome: () => void;
  onGoHistory: () => void;
}

export const AgencyTransmissionScreen: React.FC<AgencyTransmissionScreenProps> = ({
  alert,
  onGoHome,
  onGoHistory,
}) => {
  const [statuses, setStatuses] = useState<AgencyTransmissionStatus[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    emergencyAlertService
      .transmitToAgencies(alert, (updatedStatuses) => {
        if (isMounted) {
          setStatuses(updatedStatuses);
        }
      })
      .then((success) => {
        if (isMounted && success) {
          setIsCompleted(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [alert]);

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-1 select-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-base text-white whitespace-nowrap">해상 긴급구조 관계기관 전달</h2>
            <p className="text-[11px] text-blue-300">표준 CAP 프로토콜 기반 일괄 전파</p>
          </div>
        </div>
      </div>

      {/* Agency Transmission List Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
          <span className="font-bold text-slate-300">전달 대상 관제 기관</span>
          <span className="text-[11px] text-slate-400 font-mono">
            {alert.vesselName} ({alert.mmsi})
          </span>
        </div>

        <div className="space-y-2.5">
          {statuses.map((item, idx) => {
            const isPending = item.status === 'PENDING';
            const isTransmitting = item.status === 'TRANSMITTING';
            const isDone = item.status === 'COMPLETED';

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-3.5 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-slate-950 border-emerald-500/50 text-slate-100'
                    : isTransmitting
                    ? 'bg-blue-950/60 border-blue-500/60 text-white shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {idx === 0 ? (
                        <ShieldAlert className="w-5 h-5 text-blue-400" />
                      ) : idx === 1 ? (
                        <Anchor className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <RadioTower className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-100">{item.agencyName}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="shrink-0 text-right">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        전달 완료 ✓
                      </span>
                    ) : isTransmitting ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                        <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        전송 중...
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">
                        대기 중
                      </span>
                    )}
                    {item.transmittedAt && (
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {item.transmittedAt} ({item.ackNumber})
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Big Complete Banner when all completed */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-950/80 border-2 border-emerald-500/70 p-4 rounded-2xl text-center shadow-lg space-y-1 mt-3"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto mb-1">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-emerald-300">
              긴급정보 전달이 완료되었습니다.
            </h3>
            <p className="text-xs text-emerald-200">
              3대 유관 기관(해경·지도선·조업국) 관제 시스템에 CAP 경보 패킷이 정상 수신되었습니다.
            </p>
          </motion.div>
        )}
      </div>

      {/* Public Maritime Simulation Notice */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-start gap-2.5">
        <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>안내:</strong> 본 애플리케이션은 해상 안전 통신 기능 검증을 위한 시연용 시뮬레이션 환경으로 동작합니다.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          id="trans-go-history-btn"
          type="button"
          onClick={onGoHistory}
          className="bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-200 font-bold py-3 px-3 rounded-xl text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-all shadow whitespace-nowrap"
        >
          <History className="w-4 h-4 text-blue-400 shrink-0" />
          <span>통화/경보 기록 확인</span>
        </button>

        <button
          id="trans-go-home-btn"
          type="button"
          onClick={onGoHome}
          className="bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md whitespace-nowrap"
        >
          <Home className="w-4 h-4 shrink-0" />
          <span>홈으로 돌아가기</span>
        </button>
      </div>
    </div>
  );
};
