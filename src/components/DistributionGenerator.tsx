import { useState } from 'react';
import { BarChart3, X, Plus, Trash2 } from 'lucide-react';

type DistributionType = 'normal' | 'exponential' | 'binomial' | 'poisson' | 'uniform';

interface DistributionParams {
  normal: { mean: number; stdDev: number };
  exponential: { lambda: number };
  binomial: { n: number; p: number };
  poisson: { lambda: number };
  uniform: { min: number; max: number };
}

interface Dataset {
  id: string;
  name: string;
  data: number[][];
  columns: string[];
  selectedColumns: string[];
  source: 'generate';
  metadata?: {
    distribution?: string;
    parameters?: Record<string, number>;
  };
}

interface DistributionGeneratorProps {
  onDatasetAdded: (dataset: Dataset) => void;
  onBack: () => void;
}

interface DatasetConfig {
  id: string;
  name: string;
  distribution: DistributionType;
  parameters: DistributionParams[DistributionType];
  sampleSize: number;
}

const DEFAULT_PARAMS: DistributionParams = {
  normal: { mean: 0, stdDev: 1 },
  exponential: { lambda: 1 },
  binomial: { n: 10, p: 0.5 },
  poisson: { lambda: 3 },
  uniform: { min: 0, max: 1 }
};

const DISTRIBUTION_INFO = {
  normal: { name: 'Normal', description: 'Bell curve distribution' },
  exponential: { name: 'Exponential', description: 'Time between events' },
  binomial: { name: 'Binomial', description: 'Success/failure trials' },
  poisson: { name: 'Poisson', description: 'Count of events' },
  uniform: { name: 'Uniform', description: 'Equal probability range' }
};

export function DistributionGenerator({ onDatasetAdded, onBack }: DistributionGeneratorProps) {
  const [datasets, setDatasets] = useState<DatasetConfig[]>([
    {
      id: '1',
      name: 'Dataset 1',
      distribution: 'normal',
      parameters: DEFAULT_PARAMS.normal,
      sampleSize: 100
    }
  ]);

  const addDataset = () => {
    const newId = (datasets.length + 1).toString();
    setDatasets(prev => [...prev, {
      id: newId,
      name: `Dataset ${newId}`,
      distribution: 'normal',
      parameters: DEFAULT_PARAMS.normal,
      sampleSize: 100
    }]);
  };

  const removeDataset = (id: string) => {
    if (datasets.length > 1) {
      setDatasets(prev => prev.filter(d => d.id !== id));
    }
  };

  const updateDataset = (id: string, updates: Partial<DatasetConfig>) => {
    setDatasets(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const generateData = (distribution: DistributionType, params: DistributionParams[DistributionType], sampleSize: number): number[] => {
    const data: number[] = [];
    
    for (let i = 0; i < sampleSize; i++) {
      switch (distribution) {
        case 'normal':
          const { mean, stdDev } = params as DistributionParams['normal'];
          const u1 = Math.random();
          const u2 = Math.random();
          const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
          data.push(mean + stdDev * z0);
          break;
          
        case 'exponential':
          const { lambda } = params as DistributionParams['exponential'];
          data.push(-Math.log(Math.random()) / lambda);
          break;
          
        case 'binomial':
          const { n, p } = params as DistributionParams['binomial'];
          let successes = 0;
          for (let j = 0; j < n; j++) {
            if (Math.random() < p) successes++;
          }
          data.push(successes);
          break;
          
        case 'poisson':
          const { lambda: poissonLambda } = params as DistributionParams['poisson'];
          let k = 0;
          let prob = Math.exp(-poissonLambda);
          let F = prob;
          const u = Math.random();
          
          while (u > F) {
            k++;
            prob *= poissonLambda / k;
            F += prob;
          }
          data.push(k);
          break;
          
        case 'uniform':
          const { min, max } = params as DistributionParams['uniform'];
          data.push(min + Math.random() * (max - min));
          break;
      }
    }
    
    return data;
  };

  const handleGenerate = () => {
    datasets.forEach(dataset => {
      const data = generateData(dataset.distribution, dataset.parameters, dataset.sampleSize);
      
      const newDataset: Dataset = {
        id: `generated_${dataset.id}_${Date.now()}`,
        name: dataset.name,
        data: [data], // Single column of data
        columns: [dataset.name],
        selectedColumns: [dataset.name],
        source: 'generate',
        metadata: {
          distribution: dataset.distribution,
          parameters: dataset.parameters
        }
      };
      
      onDatasetAdded(newDataset);
    });
  };

  const renderParameterControls = (dataset: DatasetConfig) => {
    const { distribution, parameters } = dataset;
    
    switch (distribution) {
      case 'normal':
        const normalParams = parameters as DistributionParams['normal'];
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mean: {normalParams.mean.toFixed(2)}
              </label>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.1"
                value={normalParams.mean}
                onChange={(e) => updateDataset(dataset.id, {
                  parameters: { ...normalParams, mean: Number(e.target.value) }
                })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Std Dev: {normalParams.stdDev.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={normalParams.stdDev}
                onChange={(e) => updateDataset(dataset.id, {
                  parameters: { ...normalParams, stdDev: Number(e.target.value) }
                })}
                className="w-full"
              />
            </div>
          </div>
        );
        
      case 'exponential':
        const expParams = parameters as DistributionParams['exponential'];
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lambda: {expParams.lambda.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={expParams.lambda}
              onChange={(e) => updateDataset(dataset.id, {
                parameters: { lambda: Number(e.target.value) }
              })}
              className="w-full"
            />
          </div>
        );
        
      case 'binomial':
        const binParams = parameters as DistributionParams['binomial'];
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                n (trials): {binParams.n}
              </label>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={binParams.n}
                onChange={(e) => updateDataset(dataset.id, {
                  parameters: { ...binParams, n: Number(e.target.value) }
                })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                p (probability): {binParams.p.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.01"
                max="0.99"
                step="0.01"
                value={binParams.p}
                onChange={(e) => updateDataset(dataset.id, {
                  parameters: { ...binParams, p: Number(e.target.value) }
                })}
                className="w-full"
              />
            </div>
          </div>
        );
        
      case 'poisson':
        const poisParams = parameters as DistributionParams['poisson'];
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lambda: {poisParams.lambda.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="20"
              step="0.1"
              value={poisParams.lambda}
              onChange={(e) => updateDataset(dataset.id, {
                parameters: { lambda: Number(e.target.value) }
              })}
              className="w-full"
            />
          </div>
        );
        
      case 'uniform':
        const uniParams = parameters as DistributionParams['uniform'];
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min: {uniParams.min.toFixed(2)}
              </label>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.1"
                value={uniParams.min}
                onChange={(e) => updateDataset(dataset.id, {
                  parameters: { ...uniParams, min: Number(e.target.value) }
                })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max: {uniParams.max.toFixed(2)}
              </label>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.1"
                value={uniParams.max}
                onChange={(e) => updateDataset(dataset.id, {
                  parameters: { ...uniParams, max: Number(e.target.value) }
                })}
                className="w-full"
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Generate Data</h3>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {datasets.map((dataset) => (
          <div key={dataset.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-primary-600" />
                <h4 className="font-medium text-gray-900">{dataset.name}</h4>
              </div>
              {datasets.length > 1 && (
                <button
                  onClick={() => removeDataset(dataset.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distribution
                </label>
                <select
                  value={dataset.distribution}
                  onChange={(e) => updateDataset(dataset.id, {
                    distribution: e.target.value as DistributionType,
                    parameters: DEFAULT_PARAMS[e.target.value as DistributionType]
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {Object.entries(DISTRIBUTION_INFO).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.name} - {info.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sample Size: {dataset.sampleSize}
                </label>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={dataset.sampleSize}
                  onChange={(e) => updateDataset(dataset.id, {
                    sampleSize: Number(e.target.value)
                  })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Parameters</h5>
              {renderParameterControls(dataset)}
            </div>
          </div>
        ))}

        <button
          onClick={addDataset}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Another Dataset</span>
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleGenerate}
          className="btn-primary"
        >
          Generate All Datasets
        </button>
      </div>
    </div>
  );
}

