// Statistical distribution types
export type DistributionType = 'normal' | 'exponential' | 'binomial' | 'poisson' | 'uniform';

export interface DistributionParams {
  normal: { mean: number; stdDev: number };
  exponential: { lambda: number };
  binomial: { n: number; p: number };
  poisson: { lambda: number };
  uniform: { min: number; max: number };
}

export interface ParameterInfo {
  name: string;
  description: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface DistributionInfo {
  name: string;
  description: string;
  parameters: ParameterInfo[];
  formula: string;
  useCases: string[];
}

// Data generation result
export interface GeneratedData {
  values: number[];
  distribution: DistributionType;
  parameters: DistributionParams[DistributionType];
  sampleSize: number;
  summaryStats: SummaryStatistics;
}

// Summary statistics
export interface SummaryStatistics {
  mean: number;
  median: number;
  mode: number | null;
  variance: number;
  standardDeviation: number;
  min: number;
  max: number;
  range: number;
  quartiles: {
    q1: number;
    q2: number;
    q3: number;
  };
  interquartileRange: number;
  skewness: number;
  kurtosis: number;
}

// Estimation methods
export interface EstimationResult {
  method: 'MLE' | 'MoM';
  estimatedParams: Record<string, number>;
  logLikelihood?: number;
  standardErrors?: Record<string, number>;
  confidenceIntervals?: Record<string, [number, number]>;
}

// Chart data for visualization
export interface ChartData {
  histogram: Array<{ bin: string; count: number; density: number }>;
  boxplot: {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    outliers: number[];
  };
  density: Array<{ x: number; y: number }>;
}
