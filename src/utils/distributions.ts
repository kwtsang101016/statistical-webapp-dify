// Local types to avoid import issues
export type DistributionType = 'normal' | 'exponential' | 'binomial' | 'poisson' | 'uniform';

export interface DistributionParams {
  normal: { mean: number; stdDev: number };
  exponential: { lambda: number };
  binomial: { n: number; p: number };
  poisson: { lambda: number };
  uniform: { min: number; max: number };
}

interface DistributionInfo {
  name: string;
  description: string;
  parameters: Array<{
    name: string;
    description: string;
    min?: number;
    max?: number;
    step?: number;
  }>;
  formula: string;
  useCases: string[];
}

// Distribution information for educational purposes
export const DISTRIBUTION_INFO: Record<DistributionType, DistributionInfo> = {
  normal: {
    name: 'Normal Distribution',
    description: 'A continuous probability distribution that is symmetric around the mean, with the famous bell curve shape.',
    parameters: [
      { name: 'mean', description: 'The center (μ) of the distribution', min: -10, max: 10, step: 0.1 },
      { name: 'stdDev', description: 'Standard deviation (σ) - controls spread', min: 0.1, max: 5, step: 0.1 }
    ],
    formula: 'f(x) = (1/σ√(2π)) * e^(-(x-μ)²/(2σ²))',
    useCases: ['Height measurements', 'Test scores', 'Measurement errors', 'Natural phenomena']
  },
  exponential: {
    name: 'Exponential Distribution',
    description: 'Models the time between events in a Poisson process, with a constant hazard rate.',
    parameters: [
      { name: 'lambda', description: 'Rate parameter (λ) - inverse of mean', min: 0.1, max: 5, step: 0.1 }
    ],
    formula: 'f(x) = λe^(-λx) for x ≥ 0',
    useCases: ['Waiting times', 'Lifetimes of electronic components', 'Time between phone calls']
  },
  binomial: {
    name: 'Binomial Distribution',
    description: 'Models the number of successes in a fixed number of independent trials.',
    parameters: [
      { name: 'n', description: 'Number of trials', min: 1, max: 100, step: 1 },
      { name: 'p', description: 'Probability of success', min: 0.01, max: 0.99, step: 0.01 }
    ],
    formula: 'P(X=k) = C(n,k) * p^k * (1-p)^(n-k)',
    useCases: ['Coin flips', 'Quality control', 'Survey responses', 'Medical trials']
  },
  poisson: {
    name: 'Poisson Distribution',
    description: 'Models the number of events occurring in a fixed interval of time or space.',
    parameters: [
      { name: 'lambda', description: 'Average rate of occurrence (λ)', min: 0.1, max: 20, step: 0.1 }
    ],
    formula: 'P(X=k) = (λ^k * e^(-λ)) / k!',
    useCases: ['Number of emails per hour', 'Defects in manufacturing', 'Accidents per day']
  },
  uniform: {
    name: 'Uniform Distribution',
    description: 'All outcomes are equally likely within a specified range.',
    parameters: [
      { name: 'min', description: 'Minimum value (a)', min: -10, max: 10, step: 0.1 },
      { name: 'max', description: 'Maximum value (b)', min: -10, max: 10, step: 0.1 }
    ],
    formula: 'f(x) = 1/(b-a) for a ≤ x ≤ b',
    useCases: ['Random number generation', 'Fair dice rolls', 'Random sampling']
  }
};

// Default parameters for each distribution
export const DEFAULT_PARAMS: DistributionParams = {
  normal: { mean: 0, stdDev: 1 },
  exponential: { lambda: 1 },
  binomial: { n: 10, p: 0.5 },
  poisson: { lambda: 3 },
  uniform: { min: 0, max: 1 }
};

// Generate random data from distributions
export function generateData(
  distribution: DistributionType,
  params: DistributionParams[DistributionType],
  sampleSize: number,
  seed?: number
): number[] {
  if (seed !== undefined) {
    // Simple linear congruential generator for reproducibility
    let currentSeed = seed;
    const random = () => {
      currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
      return currentSeed / 4294967296;
    };
    
    return generateWithCustomRandom(distribution, params, sampleSize, random);
  }
  
  return generateWithCustomRandom(distribution, params, sampleSize, Math.random);
}

function generateWithCustomRandom(
  distribution: DistributionType,
  params: DistributionParams[DistributionType],
  sampleSize: number,
  random: () => number
): number[] {
  const data: number[] = [];
  
  switch (distribution) {
    case 'normal':
      const { mean, stdDev } = params as DistributionParams['normal'];
      for (let i = 0; i < sampleSize; i++) {
        // Box-Muller transform
        const u1 = random();
        const u2 = random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        data.push(mean + stdDev * z0);
      }
      break;
      
    case 'exponential':
      const { lambda } = params as DistributionParams['exponential'];
      for (let i = 0; i < sampleSize; i++) {
        data.push(-Math.log(random()) / lambda);
      }
      break;
      
    case 'binomial':
      const { n, p } = params as DistributionParams['binomial'];
      for (let i = 0; i < sampleSize; i++) {
        let successes = 0;
        for (let j = 0; j < n; j++) {
          if (random() < p) successes++;
        }
        data.push(successes);
      }
      break;
      
    case 'poisson':
      const { lambda: poissonLambda } = params as DistributionParams['poisson'];
      for (let i = 0; i < sampleSize; i++) {
        // Inverse transform sampling for Poisson
        let k = 0;
        let p = Math.exp(-poissonLambda);
        let F = p;
        const u = random();
        
        while (u > F) {
          k++;
          p *= poissonLambda / k;
          F += p;
        }
        data.push(k);
      }
      break;
      
    case 'uniform':
      const { min, max } = params as DistributionParams['uniform'];
      for (let i = 0; i < sampleSize; i++) {
        data.push(min + random() * (max - min));
      }
      break;
  }
  
  return data;
}
