import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MapPin,
  AlertTriangle,
  PhoneOff,
  Radio,
  ShieldCheck,
  Lock,
  Anchor,
  Compass,
  CheckCircle2,
  X,
  Flame,
  Waves,
  Ship,
  Wrench,
  HelpCircle,
} from 'lucide-react';
import { Vessel } from '../../types';

interface CallScreenProps {
  vessel: Vessel;
  onEndCall: (durationSeconds: number) => void;
  onTriggerEmergency: (incidentType: string, vessel: Vessel) => void;
}

export const CallScreen: React.FC<CallScreenProps> = ({
  vessel,
  onEndCall,
  onTriggerEmergency,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [locationShared, setLocationShared] = useState(false);
  const [showEmergencySheet, setShowEmergencySheet] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const emergencyOptions = [
    { type: '기관 고장', desc: '주기관 정지, 추진 불가, 조류 표류 우려', icon: Wrench, color: 'text-amber-400' },
    { type: '충돌 위험', desc: '타 선박 근접 및 선체 충돌, 긴급 회피', icon: Ship, color: 'text-orange-400' },
    { type: '침수', desc: '선체 균열 및 해수 유입, 배수 불가', icon: Waves, color: 'text-blue-400' },
    { type: '화재', desc: '기관실/조타실 화재 발생 및 긴급 소화', icon: Flame, color: 'text-red-400' },
    { type: '조난', desc: '통신 두절 및 암초 접근 등 즉각 구조 필요', icon: AlertTriangle, color: 'text-red-500' },
    { type: '기타 긴급상황', desc: '응급환자 발생 또는 계류/어구 분쟁', icon: HelpCircle, color: 'text-purple-400' },
  ];

  return (
    <div className="relative flex-1 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col justify-between p-5 select-none overflow-hidden">
      {/* Top Background Waves decoration */}
      <div className="absolute top-0 inset-x-0 h-48 bg-radial from-blue-900/20 to-transparent pointer-events-none" />

      {/* Top Header Information */}
      <div className="relative z-10 space-y-2 text-center pt-2">
        <div className="inline-flex items-center gap-1.5 bg-blue-950/80 border border-blue-500/40 px-3 py-1 rounded-full text-xs text-blue-300 font-mono">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>안심번호 연결 중: {vessel.maskedNumber}</span>
        </div>

        <div className="pt-4 space-y-1">
          <h2 className="text-3xl font-black text-white tracking-tight">{vessel.name}</h2>
          <p className="text-sm text-slate-300 font-mono">
            MMSI: <span className="text-blue-400 font-bold">{vessel.mmsi}</span>
          </p>
          <p className="text-xs text-slate-400">{vessel.type} · {vessel.port}</p>
        </div>

        <div className="pt-2">
          <span className="text-2xl font-mono font-bold text-emerald-400 bg-slate-900/90 px-4 py-1.5 rounded-full border border-slate-800 shadow-inner inline-block">
            {formatDuration(callDuration)}
          </span>
        </div>
      </div>

      {/* Center Vessel Visual Avatar & Signal Animation */}
      <div className="relative z-10 flex flex-col items-center justify-center my-4">
        <div className="relative">
          {/* Animated pulse rings */}
          <div className="absolute -inset-4 rounded-full bg-blue-500/20 animate-ping" />
          <div className="absolute -inset-8 rounded-full bg-blue-500/10 animate-pulse" />
          
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 border-2 border-blue-400/50 shadow-2xl flex items-center justify-center text-blue-400">
            <Anchor className="w-16 h-16" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400 font-medium whitespace-nowrap">
          <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse shrink-0" />
          <span>가상화 안심번호 음성 채널 암호화 작동 중</span>
        </div>

        {locationShared && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>실시간 GPS 좌표가 상대 선박과 동기화되었습니다 (35.2152, 129.2214)</span>
          </motion.div>
        )}
      </div>

      {/* Call Action Controls */}
      <div className="relative z-10 space-y-4 max-w-sm mx-auto w-full">
        {/* Top 3 functional toggles */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${
              isMuted
                ? 'bg-red-950/60 border-red-500/50 text-red-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-[11px] font-medium">{isMuted ? '음소거 됨' : '음소거'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${
              isSpeakerOn
                ? 'bg-blue-950/60 border-blue-500/50 text-blue-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span className="text-[11px] font-medium">{isSpeakerOn ? '스피커 켬' : '스피커'}</span>
          </button>

          <button
            type="button"
            onClick={() => setLocationShared(true)}
            className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${
              locationShared
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-5 h-5 text-emerald-400" />
            <span className="text-[11px] font-medium">{locationShared ? '위치 공유됨' : '위치 공유'}</span>
          </button>
        </div>

        {/* Emergency Bottom Trigger & End Call Button */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            id="call-emergency-btn"
            type="button"
            onClick={() => setShowEmergencySheet(true)}
            className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-[0.98] text-white font-bold p-3.5 rounded-2xl text-sm shadow-lg shadow-red-950/60 border border-red-400/40 flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>긴급상황 전환</span>
          </button>

          <button
            id="end-call-btn"
            type="button"
            onClick={() => onEndCall(callDuration)}
            className="bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-red-400 font-bold p-3.5 rounded-2xl text-sm shadow-md border border-slate-700 flex items-center justify-center gap-2"
          >
            <PhoneOff className="w-5 h-5" />
            <span>통화 종료</span>
          </button>
        </div>
      </div>

      {/* Emergency Situation Selection Bottom Sheet */}
      <AnimatePresence>
        {showEmergencySheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-slate-900 border-t border-slate-700 w-full max-w-lg rounded-t-3xl p-5 space-y-4 shadow-2xl text-slate-100 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-base text-white">긴급상황 유형 선택</h3>
                </div>
                <button
                  onClick={() => setShowEmergencySheet(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                현재 통신 내용을 바탕으로 긴급 상황을 선택하면 AI가 핵심 사고 정보를 자동 추출하여 표준 CAP 긴급경보로 변환합니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {emergencyOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => {
                        setShowEmergencySheet(false);
                        onTriggerEmergency(opt.type, vessel);
                      }}
                      className="p-3 bg-slate-950 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/50 rounded-xl text-left transition-all group flex items-start gap-2.5 active:scale-[0.98]"
                    >
                      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${opt.color}`} />
                      <div>
                        <div className="font-bold text-sm text-slate-100 group-hover:text-red-300">
                          {opt.type}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {opt.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <span className="text-[10px] text-slate-500">
                  선택 즉시 TTAK.KO-12.0414 개인정보 보호 기반 AI 분석이 진행됩니다.
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
