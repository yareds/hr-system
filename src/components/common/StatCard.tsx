import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  icon?: React.ReactNode;
  iconBgColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBgColor = 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {icon && (
          <div className={`p-2.5 rounded-lg ${iconBgColor}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
        {trend && (
          <div
            className={`inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded ${
              trend.isPositive
                ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40'
                : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>

      {(subtitle || trend?.label) && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {subtitle || trend?.label}
        </p>
      )}
    </div>
  );
};
