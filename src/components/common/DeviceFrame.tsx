import React from 'react';
import { Smartphone, Monitor, Sparkles, ChevronRight, HelpCircle, ShieldCheck } from 'lucide-react';
import { SCENARIO_STEPS } from '../demo/ScenarioGuideModal';

interface DeviceFrameProps {
  children: React.ReactNode;
  currentScenarioStep: number;
  onOpenDemoTour: () => void;
  onJumpToStep: (step: number) => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  currentScenarioStep,
  onOpenDemoTour,
  onJumpToStep,
}) => {
  const [isFrameMode, setIsFrameMode] = React.useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-0 sm:p-4 md:p-6 select-none">
      {/* Top Presentation Bar */}
      <div className="w-full max-w-5xl mx-auto mb-3 hidden sm:flex items-center justify-between px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-md text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-white whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            해상 안심 통신 플랫폼 Blue Call
          </span>
          <span className="text-slate-400 border-l border-slate-700 pl-3 hidden md:inline whitespace-nowrap">
            MMSI 기반 안심 연결 &amp; 긴급상황 대응
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Step Navigator Pills */}
          <div className="hidden lg:flex items-center gap-1">
            {SCENARIO_STEPS.map((s) => (
              <button
                key={s.stepNumber}
                type="button"
                onClick={() => onJumpToStep(s.stepNumber)}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all whitespace-nowrap ${
                  currentScenarioStep === s.stepNumber
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title={s.title}
              >
                S{s.stepNumber}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenDemoTour}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>시연 가이드</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFrameMode(!isFrameMode)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1 whitespace-nowrap"
            title="뷰포트 모드 전환"
          >
            {isFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden md:inline">전체화면</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden md:inline">폰 프레임</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container - Phone Frame or Full Container */}
      <main
        className={`w-full transition-all duration-300 flex flex-col ${
          isFrameMode
            ? 'max-w-[440px] h-[100dvh] sm:h-[860px] rounded-none sm:rounded-[36px] border-0 sm:border-[8px] sm:border-slate-800 shadow-2xl bg-slate-950 overflow-hidden relative'
            : 'max-w-3xl h-[100dvh] sm:h-[900px] rounded-none sm:rounded-3xl border-0 sm:border border-slate-800 shadow-2xl bg-slate-950 overflow-hidden relative'
        }`}
      >
        {children}
      </main>
    </div>
  );
};
