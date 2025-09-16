import React from 'react';
import type { SummaryStatistics as SummaryStats } from '../utils/statistics';
import { TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';

interface SummaryStatisticsProps {
  stats: SummaryStats;
}

const SummaryStatistics: React.FC<SummaryStatisticsProps> = ({ stats }) => {
  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ 
    title, 
    value, 
    icon, 
    color 
  }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const getSkewnessIcon = (skewness: number) => {
    if (skewness > 0.5) return <TrendingUp className="h-5 w-5 text-orange-500" />;
    if (skewness < -0.5) return <TrendingDown className="h-5 w-5 text-blue-500" />;
    return <Minus className="h-5 w-5 text-green-500" />;
  };

  const getSkewnessColor = (skewness: number) => {
    if (skewness > 0.5) return 'bg-orange-100';
    if (skewness < -0.5) return 'bg-blue-100';
    return 'bg-green-100';
  };

  const getSkewnessText = (skewness: number) => {
    if (skewness > 0.5) return 'Right-skewed';
    if (skewness < -0.5) return 'Left-skewed';
    return 'Symmetric';
  };

  return (
    <div className="space-y-6">
      {/* Central Tendency */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Central Tendency</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Mean"
            value={stats.mean.toFixed(3)}
            icon={<Target className="h-5 w-5 text-blue-500" />}
            color="bg-blue-100"
          />
          <StatCard
            title="Median"
            value={stats.median.toFixed(3)}
            icon={<Minus className="h-5 w-5 text-green-500" />}
            color="bg-green-100"
          />
          <StatCard
            title="Mode"
            value={stats.mode !== null ? stats.mode.toFixed(3) : 'N/A'}
            icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
            color="bg-purple-100"
          />
        </div>
      </div>

      {/* Variability */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Variability</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Standard Deviation"
            value={stats.standardDeviation.toFixed(3)}
            icon={<TrendingUp className="h-5 w-5 text-red-500" />}
            color="bg-red-100"
          />
          <StatCard
            title="Variance"
            value={stats.variance.toFixed(3)}
            icon={<TrendingUp className="h-5 w-5 text-orange-500" />}
            color="bg-orange-100"
          />
          <StatCard
            title="Range"
            value={stats.range.toFixed(3)}
            icon={<Minus className="h-5 w-5 text-indigo-500" />}
            color="bg-indigo-100"
          />
        </div>
      </div>

      {/* Quartiles */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quartiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Q1 (25th percentile)"
            value={stats.quartiles.q1.toFixed(3)}
            icon={<TrendingDown className="h-5 w-5 text-blue-500" />}
            color="bg-blue-100"
          />
          <StatCard
            title="Q2 (50th percentile)"
            value={stats.quartiles.q2.toFixed(3)}
            icon={<Minus className="h-5 w-5 text-green-500" />}
            color="bg-green-100"
          />
          <StatCard
            title="Q3 (75th percentile)"
            value={stats.quartiles.q3.toFixed(3)}
            icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
            color="bg-purple-100"
          />
        </div>
      </div>

      {/* Shape */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Distribution Shape</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Skewness"
            value={stats.skewness.toFixed(3)}
            icon={getSkewnessIcon(stats.skewness)}
            color={getSkewnessColor(stats.skewness)}
          />
          <StatCard
            title="Kurtosis"
            value={stats.kurtosis.toFixed(3)}
            icon={<Target className="h-5 w-5 text-indigo-500" />}
            color="bg-indigo-100"
          />
          <StatCard
            title="IQR"
            value={stats.interquartileRange.toFixed(3)}
            icon={<Minus className="h-5 w-5 text-gray-500" />}
            color="bg-gray-100"
          />
        </div>
        
        {/* Skewness Interpretation */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Skewness Interpretation:</strong> {getSkewnessText(stats.skewness)} 
            {Math.abs(stats.skewness) > 1 && ' (strongly)'}
            {Math.abs(stats.skewness) > 0.5 && Math.abs(stats.skewness) <= 1 && ' (moderately)'}
            {Math.abs(stats.skewness) <= 0.5 && ' (approximately symmetric)'}
          </p>
        </div>
      </div>

      {/* Min/Max */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Range</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Minimum"
            value={stats.min.toFixed(3)}
            icon={<TrendingDown className="h-5 w-5 text-red-500" />}
            color="bg-red-100"
          />
          <StatCard
            title="Maximum"
            value={stats.max.toFixed(3)}
            icon={<TrendingUp className="h-5 w-5 text-green-500" />}
            color="bg-green-100"
          />
        </div>
      </div>
    </div>
  );
};

export default SummaryStatistics;
