import React from 'react';

// Local types to avoid import issues
type DistributionType = 'normal' | 'exponential' | 'binomial' | 'poisson' | 'uniform';

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

const DISTRIBUTION_INFO: Record<DistributionType, DistributionInfo> = {
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

interface DistributionSelectorProps {
  selectedDistribution: DistributionType;
  onDistributionChange: (distribution: DistributionType) => void;
}

const DistributionSelector: React.FC<DistributionSelectorProps> = ({
  selectedDistribution,
  onDistributionChange
}) => {
  const distributions: DistributionType[] = ['normal', 'exponential', 'binomial', 'poisson', 'uniform'];

  return (
    <div className="space-y-3">
      {distributions.map((distribution) => (
        <button
          key={distribution}
          onClick={() => onDistributionChange(distribution)}
          className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
            selectedDistribution === distribution
              ? 'border-primary-500 bg-primary-50 text-primary-900'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{DISTRIBUTION_INFO[distribution].name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {DISTRIBUTION_INFO[distribution].description}
              </p>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 ${
              selectedDistribution === distribution
                ? 'border-primary-500 bg-primary-500'
                : 'border-gray-300'
            }`}>
              {selectedDistribution === distribution && (
                <div className="w-full h-full rounded-full bg-white scale-50"></div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default DistributionSelector;
