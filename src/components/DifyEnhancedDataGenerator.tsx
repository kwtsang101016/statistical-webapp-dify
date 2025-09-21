import { useState } from 'react';
import { Brain, X, Send, Loader, AlertCircle, Lightbulb, BarChart } from 'lucide-react';
import { difyAPI } from '../utils/difyApi';

interface Dataset {
  id: string;
  name: string;
  data: number[][];
  columns: string[];
  selectedColumns: string[];
  source: 'ai';
  metadata?: {
    aiPrompt?: string;
    difyWorkflowId?: string;
    analysisRecommendation?: string;
  };
}

interface DifyEnhancedDataGeneratorProps {
  onDatasetAdded: (dataset: Dataset) => void;
  onBack: () => void;
}

export function DifyEnhancedDataGenerator({ onDatasetAdded, onBack }: DifyEnhancedDataGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [generatedData, setGeneratedData] = useState<number[] | null>(null);

  const smartExamplePrompts = [
    {
      category: "Financial Analysis",
      prompts: [
        "Generate 100 daily stock returns with realistic volatility clustering",
        "Create 50 gold price changes showing market correlation patterns",
        "Generate portfolio returns data for risk analysis"
      ]
    },
    {
      category: "Educational Statistics", 
      prompts: [
        "Generate student test scores showing normal distribution with outliers",
        "Create exam data demonstrating central limit theorem",
        "Generate grade data for ANOVA analysis demonstration"
      ]
    },
    {
      category: "Scientific Research",
      prompts: [
        "Generate experimental data with measurement errors",
        "Create clinical trial results with treatment effects",
        "Generate survey responses with realistic patterns"
      ]
    }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError('');
    setRecommendation('');

    try {
      // Step 1: Generate data using Dify workflow
      console.log('🚀 Calling Dify data generation workflow...');
      const dataResult = await difyAPI.generateStatisticalData(prompt);

      if (!dataResult.success) {
        throw new Error(dataResult.error || 'Data generation failed');
      }

      // Parse the generated data
      let parsedData: number[] = [];

      try {
        const responseData = JSON.parse(dataResult.data || '{}');
        parsedData = Array.isArray(responseData.data) ? responseData.data : responseData;
        // description = responseData.description || 'AI-generated statistical data';
      } catch (parseError) {
        // Fallback: try to extract numbers from text response
        const numbers = (dataResult.data || '').match(/[\d.-]+/g);
        if (numbers && numbers.length > 0) {
          parsedData = numbers.map(n => parseFloat(n)).filter(n => !isNaN(n));
          // description = 'AI-generated data from text response';
        } else {
          throw new Error('Could not parse generated data');
        }
      }

      if (parsedData.length === 0) {
        throw new Error('No valid numerical data generated');
      }

      setGeneratedData(parsedData);

      // Step 2: Skip automatic analysis to avoid API conflicts
      console.log('🧠 Data generation complete - use manual AI analysis buttons for insights');
      setRecommendation('Use the AI Analysis buttons below to get intelligent insights about your data!');

      // Step 3: Create dataset
      const dataset: Dataset = {
        id: Date.now().toString(),
        name: `AI Generated: ${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}`,
        data: [parsedData],
        columns: ['Generated Values'],
        selectedColumns: ['Generated Values'],
        source: 'ai',
        metadata: {
          aiPrompt: prompt,
          difyWorkflowId: dataResult.workflow_run_id,
          analysisRecommendation: recommendation
        }
      };

      onDatasetAdded(dataset);

    } catch (err) {
      console.error('Data generation error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSmartPromptSelect = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Dify AI Data Generator
          </h2>
        </div>
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Smart Example Prompts */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
          Smart Example Prompts
        </h3>
        
        {smartExamplePrompts.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-2">
            <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              {category.category}
            </h4>
            <div className="grid gap-2">
              {category.prompts.map((examplePrompt, promptIndex) => (
                <button
                  key={promptIndex}
                  onClick={() => handleSmartPromptSelect(examplePrompt)}
                  className="text-left p-3 text-sm bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors"
                >
                  {examplePrompt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe the data you want to generate:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Generate 100 student test scores with a mean of 75 and some outliers..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-none"
            disabled={isGenerating}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <Loader className="animate-spin h-4 w-4 mr-2" />
              Generating with AI...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Generate Data
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-red-800">Generation Failed</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* AI Recommendation */}
      {recommendation && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <BarChart className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">AI Analysis Recommendation</h4>
              <p className="text-sm text-blue-700 mt-1">{recommendation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Data Preview */}
      {generatedData && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-2">
            Generated {generatedData.length} data points
          </h4>
          <p className="text-xs text-green-700 font-mono">
            [{generatedData.slice(0, 10).map(n => n.toFixed(2)).join(', ')}
            {generatedData.length > 10 ? '...' : ''}]
          </p>
        </div>
      )}

      {/* Integration Info */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="text-sm font-medium text-purple-800 mb-2">
          🚀 Powered by Dify AI Workflows
        </h4>
        <p className="text-xs text-purple-700">
          This enhanced data generator uses your custom Dify workflows for intelligent data generation, 
          analysis recommendations, and educational insights.
        </p>
      </div>
    </div>
  );
}
