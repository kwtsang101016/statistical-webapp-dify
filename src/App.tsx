import { useState } from 'react';
import { BarChart3, X } from 'lucide-react';
import { DataInputSelector } from './components/DataInputSelector';
import { FileUploadComponent } from './components/FileUploadComponent';
import { ColumnSelector } from './components/ColumnSelector';
import { DistributionGenerator } from './components/DistributionGenerator';
import { DifyEnhancedDataGenerator } from './components/DifyEnhancedDataGenerator';
import { SimpleAIAnalysis } from './components/SimpleAIAnalysis';
import { APITest } from './components/APITest';

// Data input types
type DataInputMethod = 'upload' | 'generate' | 'ai';

// Dataset structure
interface Dataset {
  id: string;
  name: string;
  data: number[][];
  columns: string[];
  selectedColumns: string[];
  source: DataInputMethod;
  metadata?: {
    distribution?: string;
    parameters?: Record<string, number>;
    aiPrompt?: string;
  };
}

// Simple types for distribution generation
type DistributionType = 'normal' | 'exponential' | 'binomial' | 'poisson' | 'uniform';



const DISTRIBUTION_INFO = {
  normal: {
    name: 'Normal Distribution',
    description: 'A continuous probability distribution that is symmetric around the mean, with the famous bell curve shape.',
    formula: 'f(x) = (1/σ√2π)) * e^(-(x-μ)²/(2σ²))',
    useCases: ['Height measurements', 'Test scores', 'Measurement errors', 'Natural phenomena']
  },
  exponential: {
    name: 'Exponential Distribution',
    description: 'Models the time between events in a Poisson process, with a constant hazard rate.',
    formula: 'f(x) = λe^(-λx) for x ≤0',
    useCases: ['Waiting times', 'Lifetimes of electronic components', 'Time between phone calls']
  },
  binomial: {
    name: 'Binomial Distribution',
    description: 'Models the number of successes in a fixed number of independent trials.',
    formula: 'P(X=k) = C(n,k) * p^k * (1-p)^(n-k)',
    useCases: ['Coin flips', 'Quality control', 'Survey responses', 'Medical trials']
  },
  poisson: {
    name: 'Poisson Distribution',
    description: 'Models the number of events occurring in a fixed interval of time or space.',
    formula: 'P(X=k) = (λ^k * e^(-λ)) / k!',
    useCases: ['Number of emails per hour', 'Defects in manufacturing', 'Accidents per day']
  },
  uniform: {
    name: 'Uniform Distribution',
    description: 'All outcomes are equally likely within a specified range.',
    formula: 'f(x) = 1/(b-a) for a ≤x ≤b',
    useCases: ['Random number generation', 'Fair dice rolls', 'Random sampling']
  }
};


// Simple statistics calculation
function calculateStats(data: number[]) {
  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;
  const mean = data.reduce((sum, x) => sum + x, 0) / n;
  const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);
  
  return {
    mean: mean.toFixed(3),
    median: sorted[Math.floor(n / 2)].toFixed(3),
    variance: variance.toFixed(3),
    stdDev: stdDev.toFixed(3),
    min: sorted[0].toFixed(3),
    max: sorted[n - 1].toFixed(3),
    range: (sorted[n - 1] - sorted[0]).toFixed(3)
  };
}

// MLE and MoM estimation
interface EstimationResult {
  method: 'MLE' | 'MoM';
  estimatedParams: Record<string, number>;
  logLikelihood?: number;
  standardErrors?: Record<string, number>;
}

function estimateMLE(data: number[], distribution: DistributionType): EstimationResult {
  let estimatedParams: Record<string, number> = {};
  let logLikelihood: number | undefined;
  const n = data.length;

  switch (distribution) {
    case 'normal':
      const sum = data.reduce((a, b) => a + b, 0);
      const mean = sum / n;
      const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n; // MLE uses n, not n-1
      const stdDev = Math.sqrt(variance);
      estimatedParams = { mean, stdDev };

      // Calculate log-likelihood for Normal distribution
      logLikelihood = data.reduce((acc, x) => {
        const term = -0.5 * Math.log(2 * Math.PI * variance) - Math.pow(x - mean, 2) / (2 * variance);
        return acc + term;
      }, 0);
      break;
      
    case 'exponential':
      const meanExp = data.reduce((a, b) => a + b, 0) / data.length;
      const lambdaExp = 1 / meanExp;
      estimatedParams = { lambda: lambdaExp };

      // Calculate log-likelihood for Exponential distribution
      logLikelihood = data.reduce((acc, x) => {
        return acc + Math.log(lambdaExp) - lambdaExp * x;
      }, 0);
      break;
      
    case 'poisson':
      const lambdaPois = data.reduce((a, b) => a + b, 0) / data.length;
      estimatedParams = { lambda: lambdaPois };

      // Calculate log-likelihood for Poisson distribution
      logLikelihood = data.reduce((acc, k) => {
        return acc + k * Math.log(lambdaPois) - lambdaPois - Math.log(factorial(k));
      }, 0);
      break;
      
    case 'uniform':
      const minUni = Math.min(...data);
      const maxUni = Math.max(...data);
      estimatedParams = { min: minUni, max: maxUni };

      // Log-likelihood for Uniform distribution
      if (minUni < maxUni) {
        logLikelihood = -n * Math.log(maxUni - minUni);
      } else {
        logLikelihood = -Infinity; // Invalid range
      }
      break;
      
    case 'binomial':
      // For binomial, we need to assume n is known or estimate it
      // This is a simplified version - in practice, n would be user input
      const sampleMeanBin = data.reduce((a, b) => a + b, 0) / data.length;
      const pBin = Math.min(0.99, Math.max(0.01, sampleMeanBin / 10)); // Assume n=10 for demo
      estimatedParams = { n: 10, p: pBin };
      break;
  }
  
  return { method: 'MLE', estimatedParams, logLikelihood };
}

function estimateMoM(data: number[], distribution: DistributionType): EstimationResult {
  let estimatedParams: Record<string, number> = {};
  const n = data.length;
  const m1 = data.reduce((a, b) => a + b, 0) / n; // First moment (mean)
  const m2 = data.reduce((a, b) => a + Math.pow(b, 2), 0) / n; // Second moment

  switch (distribution) {
    case 'normal':
      const mean = m1;
      const variance = m2 - Math.pow(m1, 2);
      const stdDev = Math.sqrt(variance);
      estimatedParams = { mean, stdDev };
      break;
      
    case 'exponential':
      const lambdaExp = 1 / m1;
      estimatedParams = { lambda: lambdaExp };
      break;
      
    case 'poisson':
      const lambdaPois = m1;
      estimatedParams = { lambda: lambdaPois };
      break;
      
    case 'uniform':
      // E[X] = (a+b)/2 = m1
      // Var[X] = (b-a)^2/12 = m2 - m1^2
      const varianceUni = m2 - Math.pow(m1, 2);
      const sqrtTerm = Math.sqrt(3 * varianceUni);
      const minUni = m1 - sqrtTerm;
      const maxUni = m1 + sqrtTerm;
      estimatedParams = { min: minUni, max: maxUni };
      break;
      
    case 'binomial':
      // E[X] = np, Var[X] = np(1-p)
      // m1 = np, m2 - m1^2 = np(1-p)
      const pBin = 1 - (m2 - Math.pow(m1, 2)) / m1;
      const nBin = m1 / pBin;
      estimatedParams = { n: nBin, p: pBin };
      break;
  }
  
  return { method: 'MoM', estimatedParams };
}

function factorial(k: number): number {
  if (k < 0) return NaN;
  if (k === 0) return 1;
  let result = 1;
  for (let i = 2; i <= k; i++) {
    result *= i;
  }
  return result;
}

type AnalysisTab = 'basic' | 'mle-mom';

function App() {
  const [dataInputMethod, setDataInputMethod] = useState<DataInputMethod | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [activeDataset, setActiveDataset] = useState<Dataset | null>(null);
  const [analysisData, setAnalysisData] = useState<number[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<AnalysisTab>('basic');
  const [selectedDistribution, setSelectedDistribution] = useState<DistributionType>('normal');
  const [mleResult, setMleResult] = useState<EstimationResult | null>(null);
  const [momResult, setMomResult] = useState<EstimationResult | null>(null);

  const handleDatasetAdded = (dataset: Dataset) => {
    setDatasets(prev => [...prev, dataset]);
    setActiveDataset(dataset);
    
    // For generated and AI data, automatically trigger analysis
    if (dataset.source === 'generate' || dataset.source === 'ai') {
      handleColumnSelection(dataset, dataset.selectedColumns);
    }
  };

  const handleColumnSelection = (dataset: Dataset, selectedColumns: string[]) => {
    const updatedDataset = { ...dataset, selectedColumns };
    setDatasets(prev => prev.map(d => d.id === dataset.id ? updatedDataset : d));
    setActiveDataset(updatedDataset);
    
    // Extract data for selected columns
    let extractedData: number[] = [];
    
    if (dataset.source === 'generate' || dataset.source === 'ai') {
      // For generated/AI data, the data is already in the format we need
      extractedData = dataset.data[0] || [];
    } else {
      // For uploaded data, extract based on selected columns
      const columnIndices = selectedColumns.map(col => dataset.columns.indexOf(col));
      extractedData = dataset.data.map(row => 
        columnIndices.map(idx => row[idx])
      ).flat();
    }
    
    setAnalysisData(extractedData);
    
    // Calculate statistics
    const calculatedStats = calculateStats(extractedData);
    setStats(calculatedStats);
    
    // Calculate MLE and MoM estimates
    const mle = estimateMLE(extractedData, selectedDistribution);
    const mom = estimateMoM(extractedData, selectedDistribution);
    setMleResult(mle);
    setMomResult(mom);
  };

  const handleDeleteDataset = (datasetId: string) => {
    setDatasets(prev => prev.filter(d => d.id !== datasetId));
    
    // If we're deleting the active dataset, clear the analysis
    if (activeDataset?.id === datasetId) {
      setActiveDataset(null);
      setAnalysisData([]);
      setStats(null);
      setMleResult(null);
      setMomResult(null);
      
      // If there are other datasets, select the first one
      const remainingDatasets = datasets.filter(d => d.id !== datasetId);
      if (remainingDatasets.length > 0) {
        setActiveDataset(remainingDatasets[0]);
      }
    }
  };

  const handleClearAllData = () => {
    setDatasets([]);
    setActiveDataset(null);
    setAnalysisData([]);
    setStats(null);
    setMleResult(null);
    setMomResult(null);
    setDataInputMethod(null);
  };

  const renderDataInputComponent = () => {
    switch (dataInputMethod) {
      case 'upload':
        return (
          <FileUploadComponent
            onDatasetAdded={handleDatasetAdded}
            onBack={() => setDataInputMethod(null)}
          />
        );
      case 'generate':
        return (
          <DistributionGenerator
            onDatasetAdded={handleDatasetAdded}
            onBack={() => setDataInputMethod(null)}
          />
        );
      case 'ai':
        return (
          <DifyEnhancedDataGenerator
            onDatasetAdded={handleDatasetAdded}
            onBack={() => setDataInputMethod(null)}
          />
        );
      default:
        return (
          <DataInputSelector
            onMethodSelect={setDataInputMethod}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
      <div>
                <h1 className="text-3xl font-bold text-gray-900">Statistical Data Analysis Webapp</h1>
                <p className="text-gray-600">Upload, generate, or create data with AI for comprehensive analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Data Input */}
              <div className="space-y-6">
                {/* API Test Component - Remove this after testing */}
                <div className="card">
                  <APITest />
                </div>
                
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Data Input</h2>
                    {datasets.length > 0 && (
                      <button
                        onClick={() => setDataInputMethod(null)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        + New Analysis
                      </button>
                    )}
                  </div>
                  {renderDataInputComponent()}
      </div>

            {/* Dataset Management */}
            {datasets.length > 0 && (
      <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Your Datasets</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleClearAllData}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {datasets.map(dataset => (
                    <div
                      key={dataset.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        activeDataset?.id === dataset.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => setActiveDataset(dataset)}
                        >
                          <div className="font-medium">{dataset.name}</div>
                          <div className="text-sm text-gray-600">
                            {dataset.source} • {dataset.columns.length} columns • {dataset.data.length} rows
                            {dataset.selectedColumns.length > 0 && (
                              <span className="ml-2 text-green-600">
                                ✓ Analyzed
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDataset(dataset.id);
                          }}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                          title="Delete dataset"
                        >
                          <X className="h-4 w-4" />
        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Column Selection - Only for uploaded data */}
            {activeDataset && activeDataset.selectedColumns.length === 0 && activeDataset.source === 'upload' && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Columns for Analysis</h2>
                <ColumnSelector
                  dataset={activeDataset}
                  onColumnSelection={(selectedColumns) => 
                    handleColumnSelection(activeDataset, selectedColumns)
                  }
                />
              </div>
            )}
          </div>

          {/* Right Column - Analysis Results */}
          <div className="space-y-6">
            {/* Manual AI Analysis - Disabled */}

            {/* Student-Friendly AI Analysis */}
            {analysisData.length > 0 && (
              <SimpleAIAnalysis data={analysisData} />
            )}

            {analysisData.length > 0 && stats ? (
              <>
                {/* Dataset Info */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
      <div>
                        <h3 className="font-medium text-primary-900">{activeDataset?.name}</h3>
                        <p className="text-sm text-primary-700">
                          Source: {activeDataset?.source} ↓
                          Columns: {activeDataset?.selectedColumns.join(', ')} ↓
                          Sample size: {analysisData.length.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteDataset(activeDataset!.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete this dataset"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Analysis Tabs */}
                  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveTab('basic')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'basic'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Basic Statistics
                    </button>
                    <button
                      onClick={() => setActiveTab('mle-mom')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'mle-mom'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      MLE / MoM
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'basic' && (
                  <>
                    {/* Data Display */}
                    <div className="card">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Preview</h2>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Sample of first 20 values: {analysisData.slice(0, 20).map(x => x.toFixed(2)).join(', ')}
                          {analysisData.length > 20 && '...'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total samples: {analysisData.length.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Summary Statistics */}
                    <div className="card">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary Statistics</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-600">Mean</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.mean}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-600">Median</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.median}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-600">Std Dev</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.stdDev}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-600">Variance</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.variance}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-600">Min</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.min}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-600">Max</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.max}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'mle-mom' && (
                  <>
                    {/* Distribution Selection for MLE/MoM */}
                    <div className="card">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribution Model</h2>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select distribution to fit:
                        </label>
                        <select
                          value={selectedDistribution}
                          onChange={(e) => {
                            setSelectedDistribution(e.target.value as DistributionType);
                            // Recalculate MLE/MoM with new distribution
                            const mle = estimateMLE(analysisData, e.target.value as DistributionType);
                            const mom = estimateMoM(analysisData, e.target.value as DistributionType);
                            setMleResult(mle);
                            setMomResult(mom);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {Object.entries(DISTRIBUTION_INFO).map(([key, info]) => (
                            <option key={key} value={key}>
                              {info.name} - {info.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* MLE Results */}
                    {mleResult && (
                      <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Maximum Likelihood Estimation (MLE)</h2>
                        <div className="space-y-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-medium text-blue-900 mb-2">Estimated Parameters</h3>
                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(mleResult.estimatedParams).map(([param, value]) => (
                                <div key={param} className="bg-white rounded-lg p-3">
                                  <p className="text-sm font-medium text-gray-600 capitalize">{param}</p>
                                  <p className="text-lg font-bold text-gray-900">{value.toFixed(4)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          {mleResult.logLikelihood !== undefined && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm font-medium text-gray-600">Log-Likelihood</p>
                              <p className="text-lg font-bold text-gray-900">{mleResult.logLikelihood.toFixed(4)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* MoM Results */}
                    {momResult && (
                      <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Method of Moments (MoM)</h2>
                        <div className="space-y-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h3 className="font-medium text-green-900 mb-2">Estimated Parameters</h3>
                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(momResult.estimatedParams).map(([param, value]) => (
                                <div key={param} className="bg-white rounded-lg p-3">
                                  <p className="text-sm font-medium text-gray-600 capitalize">{param}</p>
                                  <p className="text-lg font-bold text-gray-900">{value.toFixed(4)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
      </div>
                    )}

                    {/* Comparison */}
                    {mleResult && momResult && (
      <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">MLE vs MoM Comparison</h2>
                        <div className="space-y-3">
                          {Object.keys(mleResult.estimatedParams).map(param => (
                            <div key={param} className="bg-gray-50 rounded-lg p-4">
                              <h3 className="font-medium text-gray-900 mb-2 capitalize">{param}</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-blue-600 font-medium">MLE</p>
                                  <p className="text-lg font-bold text-gray-900">
                                    {mleResult.estimatedParams[param].toFixed(4)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-green-600 font-medium">MoM</p>
                                  <p className="text-lg font-bold text-gray-900">
                                    {momResult.estimatedParams[param].toFixed(4)}
        </p>
      </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                  Difference: {(mleResult.estimatedParams[param] - momResult.estimatedParams[param]).toFixed(4)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="card text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data to Analyze Yet</h3>
                <p className="text-gray-600 mb-6">
                  Choose a data source (upload, generate, or AI) to get started with your analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>STA2002: Probability and Statistics II - Interactive Data Analysis Tool</p>
            <p className="text-sm mt-1">Built with React, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
