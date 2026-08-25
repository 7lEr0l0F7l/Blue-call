import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Lock,
  Bot,
  Trash2,
  Calendar,
  FileCheck,
  Info,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Smartphone,
  Server,
  Radio,
} from 'lucide-react';
import { PrivacySettings } from '../../types';

interface SettingsScreenProps {
  settings: PrivacySettings;
  onUpdateSettings: (newSettings: PrivacySettings) => void;
  onClearAllLogs: () => void;
  onOpenStandards: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onClearAllLogs,
  onOpenStandards,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggle = (key: keyof PrivacySettings) => {
    if (typeof settings[key] === 'boolean') {
      const updated = { ...settings, [key]: !settings[key] };
      onUpdateSettings(updated);
      showToast(`${key === 'useSafeNumber' ? '안심번호 설정' : key === 'aiContentAnalysis' ? 'AI 분석 설정' : '개인정보 보호 설정'}이 변경되었습니다.`);
    }
  };

  const handleRetentionChange = (days: number) => {
    onUpdateSettings({ ...settings, retentionDays: days });
    showToast(`통신기록 보관 기간이 ${days}일로 설정되었습니다.`);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-y-auto p-4 space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 inset-x-4 max-w-sm mx-auto z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center justify-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-base text-white whitespace-nowrap">환경설정 및 앱 정보</h2>
            <p className="text-[11px] text-slate-400">보안 제어, 데이터 보관 및 기술 사양</p>
          </div>
        </div>
      </div>

      {/* 1. Main Privacy Toggles */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800">
          개인정보 및 보안 제어
        </h3>

        {/* 1. 안심번호 사용 */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
          <div className="space-y-0.5 pr-2">
            <span className="text-sm font-semibold text-white flex items-center gap-1.5 whitespace-nowrap">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              안심번호 사용
            </span>
            <p className="text-[11px] text-slate-400 leading-snug">
              상대방에게 내 휴대폰 번호를 노출하지 않고 050 가상번호로 연결합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('useSafeNumber')}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
              settings.useSafeNumber ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                settings.useSafeNumber ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* 2. AI 통신내용 분석 */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
          <div className="space-y-0.5 pr-2">
            <span className="text-sm font-semibold text-white flex items-center gap-1.5 whitespace-nowrap">
              <Bot className="w-4 h-4 text-blue-400 shrink-0" />
              AI 통신내용 분석
            </span>
            <p className="text-[11px] text-slate-400 leading-snug">
              긴급 상황 시 음성/텍스트 통신에서 핵심 사고 정보를 자동 추출합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('aiContentAnalysis')}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
              settings.aiContentAnalysis ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                settings.aiContentAnalysis ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* 3. 개인정보 자동 마스킹 */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
          <div className="space-y-0.5 pr-2">
            <span className="text-sm font-semibold text-white flex items-center gap-1.5 whitespace-nowrap">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              개인정보 자동 마스킹
            </span>
            <p className="text-[11px] text-slate-400 leading-snug">
              AI 추론 전 성명, 전화번호 등 식별정보를 사전에 비식별 처리합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('autoPrivacyMasking')}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
              settings.autoPrivacyMasking ? 'bg-emerald-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                settings.autoPrivacyMasking ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* 4. 통신기록 저장 */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
          <div className="space-y-0.5 pr-2">
            <span className="text-sm font-semibold text-white whitespace-nowrap">통신기록 저장</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              안전 통화 및 메시지 AI 요약 기록을 단말에 저장합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('storeCallLogs')}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
              settings.storeCallLogs ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                settings.storeCallLogs ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* 5. 통신기록 자동삭제 기간 */}
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5 pr-2">
            <span className="text-sm font-semibold text-white flex items-center gap-1.5 whitespace-nowrap">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              통신기록 자동삭제
            </span>
            <p className="text-[11px] text-slate-400 leading-snug">보관 만료 시 개인정보 즉시 영구 파기</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => handleRetentionChange(days)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  settings.retentionDays === days
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {days}일
              </button>
            ))}
          </div>
        </div>

        {/* 6. Delete all logs button */}
        <div className="pt-2">
          <button
            id="clear-all-logs-btn"
            type="button"
            onClick={() => {
              onClearAllLogs();
              showToast('모든 통신기록이 즉시 안전하게 파기되었습니다.');
            }}
            className="w-full bg-slate-950 hover:bg-red-950/50 text-red-400 hover:text-red-300 border border-slate-800 hover:border-red-500/50 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>모든 통신기록 삭제</span>
          </button>
        </div>
      </div>

      {/* 2. 앱 정보 및 기술/표준 정보 (New Dedicated App Info Section) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800">
          앱 정보 및 기술 사양
        </h3>

        {/* Technical & Standard Reference Link Button */}
        <button
          type="button"
          id="settings-standards-menu-btn"
          onClick={onOpenStandards}
          className="w-full bg-gradient-to-r from-slate-950 to-slate-900 hover:from-blue-950/50 hover:to-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl p-3 text-left shadow transition-all active:scale-[0.99] flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white group-hover:text-blue-300 flex items-center gap-1.5 whitespace-nowrap">
                기술 및 표준 적용 정보
                <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded border border-blue-800 font-normal">
                  상세보기
                </span>
              </h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                오픈 API, RCS 메시징, CAP 긴급경보, AI 개인정보보호 참조 규격
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>

        {/* Service Standard Reference Philosophy Card */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              Blue Call은 해상 통신 서비스의 연결성, 긴급정보 처리, 개인정보 보호를 위해 관련 ICT 기술과 표준을 참고하여 설계되었습니다.
            </p>
          </div>
        </div>

        {/* Version & System Spec */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">앱 버전</span>
          <span className="font-mono text-slate-300 font-semibold">v1.2.0 (해상 통신 최적화)</span>
        </div>
      </div>
    </div>
  );
};
