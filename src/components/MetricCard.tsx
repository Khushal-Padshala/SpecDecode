import React from 'react';
import { HelpCircle, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  delta?: string;
  isPositiveDelta?: boolean;
  icon?: React.ReactNode;
  variant?: 'cyan' | 'green' | 'purple' | 'amber' | 'neutral';
  badgeText?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  unit,
  description,
  delta,
  isPositiveDelta = true,
  icon,
  variant = 'cyan',
  badgeText
}) => {
  const variantStyles = {
    cyan: {
      border: 'border-pink-200/80 hover:border-pink-300',
      bg: 'bg-white shadow-xs',
      valueColor: 'text-pink-600',
      glow: 'group-hover:shadow-md group-hover:shadow-pink-500/10',
      iconBg: 'bg-pink-50 text-pink-600 border-pink-200'
    },
    green: {
      border: 'border-emerald-200/80 hover:border-emerald-300',
      bg: 'bg-white shadow-xs',
      valueColor: 'text-emerald-700',
      glow: 'group-hover:shadow-md group-hover:shadow-emerald-500/10',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    purple: {
      border: 'border-rose-200/80 hover:border-rose-300',
      bg: 'bg-white shadow-xs',
      valueColor: 'text-rose-600',
      glow: 'group-hover:shadow-md group-hover:shadow-rose-500/10',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200'
    },
    amber: {
      border: 'border-amber-200/80 hover:border-amber-300',
      bg: 'bg-white shadow-xs',
      valueColor: 'text-amber-700',
      glow: 'group-hover:shadow-md group-hover:shadow-amber-500/10',
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    neutral: {
      border: 'border-pink-100 hover:border-pink-200',
      bg: 'bg-white shadow-xs',
      valueColor: 'text-slate-800',
      glow: 'group-hover:shadow-md group-hover:shadow-pink-500/5',
      iconBg: 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }[variant];

  return (
    <div
      id={id}
      className={`group relative rounded-xl border p-5 transition-all duration-300 ${variantStyles.border} ${variantStyles.bg} ${variantStyles.glow}`}
    >
      {/* Header with Title and Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {title}
        </span>
        {icon && (
          <div className={`p-1.5 rounded-lg border text-xs ${variantStyles.iconBg}`}>
            {icon}
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${variantStyles.valueColor}`}>
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-slate-700 font-mono">
            {unit}
          </span>
        )}
      </div>

      {/* Delta and Description */}
      <div className="mt-2.5 flex items-center justify-between gap-2 text-xs">
        {description && (
          <p className="text-slate-700 text-[11px] leading-snug line-clamp-1">
            {description}
          </p>
        )}
        
        {delta && (
          <div className={`inline-flex items-center gap-1 font-mono text-[11px] font-medium ${
            isPositiveDelta ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            {isPositiveDelta ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{delta}</span>
          </div>
        )}
      </div>

      {/* Optional Badge */}
      {badgeText && (
        <div className="absolute top-2 right-2 text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-pink-50 border border-pink-200 text-pink-700 font-medium">
          {badgeText}
        </div>
      )}
    </div>
  );
};
