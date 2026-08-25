import React from 'react';
import { Home, MessageSquare, History, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export type NavTab = 'home' | 'chat' | 'history' | 'settings';

interface BottomNavBarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  unreadCount = 1,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: '홈', icon: Home },
    { id: 'chat' as NavTab, label: '메시지', icon: MessageSquare, badge: unreadCount },
    { id: 'history' as NavTab, label: '기록', icon: History },
    { id: 'settings' as NavTab, label: '설정', icon: Settings },
  ];

  return (
    <nav
      id="bluecall-bottom-nav"
      className="bg-slate-900 border-t border-slate-800 px-3 py-1.5 flex items-center justify-around select-none z-30"
      aria-label="하단 네비게이션 바"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`nav-btn-${tab.id}`}
            onClick={() => onSelectTab(tab.id)}
            className="flex flex-col items-center justify-center flex-1 py-1 relative group focus:outline-none"
          >
            <div
              className={`relative px-4 py-1 rounded-full transition-all duration-200 ${
                isActive ? 'bg-blue-600/30 text-blue-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-blue-600/40 rounded-full border border-blue-400/40"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <div className="relative z-10">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-blue-400' : ''}`} />
                {tab.badge && tab.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center border-2 border-slate-900">
                    {tab.badge}
                  </span>
                )}
              </div>
            </div>
            <span
              className={`text-xs mt-1 font-medium transition-colors ${
                isActive ? 'text-blue-300 font-semibold' : 'text-slate-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
