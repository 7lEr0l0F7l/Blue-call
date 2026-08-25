import React from 'react';
import { Wifi, Signal, Battery, Compass, ShieldAlert, Sparkles } from 'lucide-react';

interface TopHeaderProps {
  onOpenDemoTour?: () => void;
  onOpenStandards?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenDemoTour,
  onOpenStandards,
}) => {
  const [currentTime, setCurrentTime] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-900 text-white select-none border-b border-slate-800">
      {/* Android System Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 text-xs text-slate-300 font-mono tracking-tight bg-slate-950/80">
        <span className="font-semibold text-slate-200">{currentTime || '14:24'}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-blue-400 font-sans font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            LTE-M 해상망
          </span>
          <Signal className="w-3.5 h-3.5 text-slate-200" />
          <Wifi className="w-3.5 h-3.5 text-slate-200" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px]">98%</span>
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Main Maritime Branding Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-400/30 shrink-0">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-xl tracking-wider text-white flex items-center whitespace-nowrap">
                BLUE CALL
              </h1>
            </div>
            <p className="text-[11px] text-blue-200 font-medium whitespace-nowrap">
              해상 안심 통신 서비스
            </p>
          </div>
        </div>

        {/* Demo Scenario Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenDemoTour && (
            <button
              id="header-demo-tour-btn"
              type="button"
              onClick={onOpenDemoTour}
              className="text-[11px] bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 active:scale-95 text-slate-950 font-bold px-3 py-1.5 rounded-xl shadow transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>시연 가이드</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
