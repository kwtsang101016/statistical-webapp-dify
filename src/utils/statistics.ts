// Local types to avoid import issues
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

export interface EstimationResult {
  method: 'MLE' | 'MoM';
  estimatedParams: Record<string, number>;
  logLikelihood?: number;
  standardErrors?: Record<string, number>;
  confidenceIntervals?: Record<string, [number, number]>;
}

// Calculate summary statistics
export function calculateSummaryStats(data: number[]): SummaryStatistics {
  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;
  
  // Basic statistics
  const mean = data.reduce((sum, x) => sum + x, 0) / n;
  const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (n - 1);
  const standardDeviation = Math.sqrt(variance);
  
  // Median and quartiles
  const median = calculatePercentile(sorted, 50);
  const q1 = calculatePercentile(sorted, 25);
  const q3 = calculatePercentile(sorted, 75);
  
  // Mode (most frequent value)
  const frequency: Record<number, number> = {};
  data.forEach(x => {
    const rounded = Math.round(x * 100) / 100; // Round to 2 decimal places
    frequency[rounded] = (frequency[rounded] || 0) + 1;
  });
  
  const maxFreq = Math.max(...Object.values(frequency));
  const mode = maxFreq > 1 ? 
    parseFloat(Object.keys(frequency).find(key => frequency[parseFloat(key)] === maxFreq) || '0') : 
    null;
  
  // Skewness and Kurtosis
  const skewness = calculateSkewness(data, mean, standardDeviation);
  const kurtosis = calculateKurtosis(data, mean, standardDeviation);
  
  return {
    mean,
    median,
    mode,
    variance,
    standardDeviation,
    min: sorted[0],
    max: sorted[n - 1],
    range: sorted[n - 1] - sorted[0],
    quartiles: { q1, q2: median, q3 },
    interquartileRange: q3 - q1,
    skewness,
    kurtosis
  };
}

// Calculate percentile using linear interpolation
function calculatePercentile(sorted: number[], percentile: number): number {
  const n = sorted.length;
  const index = (percentile / 100) * (n - 1);
  
  if (Number.isInteger(index)) {
    return sorted[index];
  }
  
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

// Calculate skewness
function calculateSkewness(data: number[], mean: number, stdDev: number): number {
  const n = data.length;
  const sum = data.reduce((sum, x) => sum + Math.pow((x - mean) / stdDev, 3), 0);
  return (n / ((n - 1) * (n - 2))) * sum;
}

// Calculate kurtosis
function calculateKurtosis(data: number[], mean: number, stdDev: number): number {
  const n = data.length;
  const sum = data.reduce((sum, x) => sum + Math.pow((x - mean) / stdDev, 4), 0);
  return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
}

// Maximum Likelihood Estimation
export function estimateMLE(
  data: number[],
  distribution: string,
  initialParams: Record<string, number>
): EstimationResult {
  // Simplified MLE implementation
  // In a real application, you'd use numerical optimization
  
  const n = data.length;
  const mean = data.reduce((sum, x) => sum + x, 0) / n;
  const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n;
  
  let estimatedParams: Record<string, number> = {};
  
  switch (distribution) {
    case 'normal':
      estimatedParams = {
        mean: mean,
        stdDev: Math.sqrt(variance)
      };
      break;
      
    case 'exponential':
      estimatedParams = {
        lambda: 1 / mean
      };
      break;
      
    case 'poisson':
      estimatedParams = {
        lambda: mean
      };
      break;
      
    case 'uniform':
      estimatedParams = {
        min: Math.min(...data),
        max: Math.max(...data)
      };
      break;
      
    case 'binomial':
      // For binomial, we need to know n (number of trials)
      // This is a simplified version
      estimatedParams = {
        n: Math.max(...data) + 1, // Rough estimate
        p: mean / (Math.max(...data) + 1)
      };
      break;
  }
  
  return {
    method: 'MLE',
    estimatedParams,
    logLikelihood: calculateLogLikelihood(data, distribution, estimatedParams)
  };
}

// Method of Moments estimation
export function estimateMoM(
  data: number[],
  distribution: string,
  initialParams: Record<string, number>
): EstimationResult {
  const n = data.length;
  const mean = data.reduce((sum, x) => sum + x, 0) / n;
  const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n;
  
  let estimatedParams: Record<string, number> = {};
  
  switch (distribution) {
    case 'normal':
      estimatedParams = {
        mean: mean,
        stdDev: Math.sqrt(variance)
      };
      break;
      
    case 'exponential':
      estimatedParams = {
        lambda: 1 / mean
      };
      break;
      
    case 'poisson':
      estimatedParams = {
        lambda: mean
      };
      break;
      
    case 'uniform':
      const stdDev = Math.sqrt(variance);
      estimatedParams = {
        min: mean - Math.sqrt(3) * stdDev,
        max: mean + Math.sqrt(3) * stdDev
      };
      break;
      
    case 'binomial':
      // For binomial MoM: E[X] = np, Var[X] = np(1-p)
      const p = 1 - (variance / mean);
      const n_est = mean / p;
      estimatedParams = {
        n: Math.round(n_est),
        p: Math.max(0.01, Math.min(0.99, p))
      };
      break;
  }
  
  return {
    method: 'MoM',
    estimatedParams,
    logLikelihood: calculateLogLikelihood(data, distribution, estimatedParams)
  };
}

// Calculate log-likelihood (simplified)
function calculateLogLikelihood(
  data: number[],
  distribution: string,
  params: Record<string, number>
): number {
  // This is a simplified implementation
  // In practice, you'd implement the actual likelihood functions
  
  let logLikelihood = 0;
  
  switch (distribution) {
    case 'normal':
      const { mean, stdDev } = params;
      data.forEach(x => {
        logLikelihood += -0.5 * Math.log(2 * Math.PI * stdDev * stdDev) - 
                        0.5 * Math.pow((x - mean) / stdDev, 2);
      });
      break;
      
    case 'exponential':
      const { lambda } = params;
      data.forEach(x => {
        logLikelihood += Math.log(lambda) - lambda * x;
      });
      break;
      
    // Add other distributions as needed
    default:
      logLikelihood = -Infinity;
  }
  
  return logLikelihood;
}
