import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  trend?: { value: number; isPositive: boolean };
}

const colorGradients: Record<string, string> = {
  blue: 'from-blue-500 to-cyan-500',
  red: 'from-red-500 to-pink-500',
  green: 'from-emerald-500 to-teal-500',
  purple: 'from-purple-500 to-indigo-500',
  yellow: 'from-amber-500 to-orange-500',
};

export default function StatCard({ title, value, icon, color = 'blue', trend }: StatCardProps) {
  return (
    <div className="card-premium p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorGradients[color] || colorGradients.blue} flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
