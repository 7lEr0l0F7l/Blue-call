import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  X,
  Search,
  Radio,
  MessageSquare,
  Bot,
  AlertTriangle,
  Send,
  HelpCircle,
} from 'lucide-react';

export interface ScenarioStep {
  stepNumber: number;
  title: string;
  desc: string;
  standard: string;
  icon: React.ElementType;
  actionName: string;
}

interface ScenarioGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onJumpToStep: (stepNumber: number) => void;
}

export const SCENARIO_STEPS: ScenarioStep[] = [
  {
    stepNumber: 1,
    title: '다중 식별자로 상대 선박 검색',
    desc: '전화번호를 몰라도 MMSI(9자리), 14자리 어선번호(등록연월+일련번호+관청코드+검증번호), 호출부호로 동해호를 즉시 탐색',
    standard: '해상 식별 체계',
    icon: Search,
    actionName: '1단계 선박 검색 시작',
  },
  {
    stepNumber: 2,
    title: '안심 이동통신 연결 (Open API)',
    desc: '실제 전화번호 노출 없이 050 안심번호 생성 및 사업자 코어망 연결',
    standard: 'TTAK.KO-06.0619',
    icon: Radio,
    actionName: '2단계 안심통화 연결',
  },
  {
    stepNumber: 3,
    title: 'RCS 메시지 및 위치 교환',
    desc: '선박 간 리치 메시징으로 기관 고장 상황 및 실시간 GPS 좌표 수신',
    standard: 'TTAK.KO-06.0410/R9',
    icon: MessageSquare,
    actionName: '3단계 RCS 채팅 확인',
  },
  {
    stepNumber: 4,
    title: 'AI 긴급상황 분석 & 개인정보 마스킹',
    desc: '메시지 내용을 AI가 분석하여 사고유형/긴급도 추출 및 개인정보 자동 비식별화',
    standard: 'TTAK.KO-12.0414',
    icon: Bot,
    actionName: '4단계 AI 분석 실행',
  },
  {
    stepNumber: 5,
    title: 'CAP 기반 긴급경보 변환',
    desc: '국내 표준 공통경보프로토콜(CAP) XML 포맷으로 구조화된 해상경보 생성',
    standard: 'TTAK.OT-06.0055/R4',
    icon: AlertTriangle,
    actionName: '5단계 CAP 경보 변환',
  },
  {
    stepNumber: 6,
    title: '관계기관 통합 전달',
    desc: '해양경찰청, 어업지도선, 어선안전조업국으로 원클릭 표준 경보 전파',
    standard: '해양안전 통합망',
    icon: Send,
    actionName: '6단계 관계기관 전달',
  },
];

export const ScenarioGuideModal: React.FC<ScenarioGuideModalProps> = ({
  isOpen,
  onClose,
  currentStep,
  onJumpToStep,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">2026 ICT 표준 챌린지 시연 시나리오</h3>
                <p className="text-xs text-blue-200">심사위원을 위한 6단계 표준 연계 원클릭 투어</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Steps List */}
          <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-800/60">
            {SCENARIO_STEPS.map((s) => {
              const Icon = s.icon;
              const isCurrent = currentStep === s.stepNumber;
              const isPassed = currentStep > s.stepNumber;

              return (
                <div
                  key={s.stepNumber}
                  className={`pt-2.5 first:pt-0 p-3 rounded-xl transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-950/80 border border-blue-500/60 ring-2 ring-blue-500/20'
                      : isPassed
                      ? 'bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/80'
                      : 'bg-slate-900/50 border border-slate-800 hover:bg-slate-800/40'
                  }`}
                  onClick={() => {
                    onJumpToStep(s.stepNumber);
                    onClose();
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isPassed
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 animate-pulse'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : s.stepNumber}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
                          <Icon className="w-4 h-4 text-blue-400" />
                          STEP {s.stepNumber}. {s.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50 font-mono">
                          {s.standard}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{s.desc}</p>
                    </div>

                    <button
                      type="button"
                      className={`text-xs px-2.5 py-1.5 rounded-lg shrink-0 flex items-center gap-1 font-medium transition-colors ${
                        isCurrent
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                      }`}
                    >
                      <span>실행</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Guide Note */}
          <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              각 단계를 누르면 해당 기능으로 즉시 이동합니다.
            </span>
            <button
              onClick={() => {
                onJumpToStep(1);
                onClose();
              }}
              className="text-xs text-blue-400 hover:underline font-semibold"
            >
              1단계부터 시작
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
