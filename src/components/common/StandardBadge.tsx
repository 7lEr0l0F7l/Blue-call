import React from 'react';
import { ShieldCheck, Cpu, Radio, AlertTriangle } from 'lucide-react';

interface StandardBadgeProps {
  code: string;
  badge?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export const StandardBadge: React.FC<StandardBadgeProps> = ({
  code,
  badge,
  size = 'sm',
  onClick,
}) => {
  const getIcon = () => {
    if (code.includes('0619')) return <Radio className="w-3.5 h-3.5" />;
    if (code.includes('0410')) return <Radio className="w-3.5 h-3.5" />;
    if (code.includes('0055')) return <AlertTriangle className="w-3.5 h-3.5" />;
    return <ShieldCheck className="w-3.5 h-3.5" />;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-medium rounded-md transition-all ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      } bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 active:scale-95`}
      title={`${code} 표준 적용 영역`}
    >
      <span className="text-blue-700">{getIcon()}</span>
      <span className="font-semibold">{code}</span>
      {badge && <span className="text-blue-600 border-l border-blue-300 pl-1.5 ml-0.5">{badge}</span>}
    </button>
  );
};
