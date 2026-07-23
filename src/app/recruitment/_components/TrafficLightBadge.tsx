import React from 'react';

interface TrafficLightBadgeProps {
  status: 'GREEN' | 'YELLOW' | 'RED' | string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const TrafficLightBadge: React.FC<TrafficLightBadgeProps> = ({
  status,
  score,
  size = 'md',
}) => {
  let badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let label = '🟢 VERDE (Aprobado)';
  let dotColor = 'bg-emerald-400 animate-pulse';

  if (status === 'YELLOW') {
    badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    label = '🟡 AMARILLO (Revisión Excepcional)';
    dotColor = 'bg-amber-400 animate-ping';
  } else if (status === 'RED') {
    badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    label = '🔴 ROJO (Descartado)';
    dotColor = 'bg-rose-400';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base font-semibold',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border ${badgeStyle} ${sizeClasses[size]} transition-all`}
    >
      <span className={`h-2 w-2 rounded-full ${dotColor}`} />
      <span>{label}</span>
      {score !== undefined && (
        <span className="ml-1 font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-xs">
          {score}%
        </span>
      )}
    </div>
  );
};
