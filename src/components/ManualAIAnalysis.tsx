import { useState } from 'react';
import { Brain, CheckCircle, BarChart3, TrendingUp } from 'lucide-react';
import { difyAPI } from '../utils/difyApi';

interface ManualAIAnalysisProps {
  data: number[];
}

export function ManualAIAnalysis({ data }: ManualAIAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    quality?: any;
    recommendation?: any;
    distribution?: any;
  }>({});

  const runQualityCheck = async () => {
    setIsAnalyzing(true);
    try {
      const result = await difyAPI.checkDataQuality(data);
      if (result.success) {
        const parsed = JSON.parse(result.data || '{}');
        setResults(prev => ({ ...prev, quality: parsed }));
      }
    } catch (error) {
      console.error('Quality check failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runAnalysisRecommendation = async () => {
    setIsAnalyzing(true);
    try {
      const result = await difyAPI.getAnalysisRecommendation(data, 'I want to analyze this data');
      if (result.success) {
        const parsed = JSON.parse(result.data || '{}');
        setResults(prev => ({ ...prev, recommendation: parsed }));
      }
    } catch (error) {
      console.error('Analysis recommendation failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runDistributionDetection = async () => {
    setIsAnalyzing(true);
    try {
      const result = await difyAPI.detectDistribution(data);
      if (result.success) {
        const parsed = JSON.parse(result.data || '{}');
        setResults(prev => ({ ...prev, distribution: parsed }));
      }
    } catch (error) {
      console.error('Distribution detection failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          AI Analysis Tools
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={runQualityCheck}
            disabled={isAnalyzing}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Check Quality
          </button>
          
          <button
            onClick={runAnalysisRecommendation}
            disabled={isAnalyzing}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Get Recommendation
          </button>
          
          <button
            onClick={runDistributionDetection}
            disabled={isAnalyzing}
            className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Detect Distribution
          </button>
        </div>
      </div>

      {/* Results Display */}
      {results.quality && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Data Quality Assessment</h4>
          <p className="text-sm text-blue-800">
            Quality: {results.quality.quality} (Score: {results.quality.overall_score})
          </p>
          {results.quality.suggestions && (
            <ul className="text-xs text-blue-700 mt-2 list-disc list-inside">
              {results.quality.suggestions.map((suggestion: string, i: number) => (
                <li key={i}>{suggestion}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {results.recommendation && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">AI Recommendation</h4>
          <p className="text-sm text-green-800 font-medium">
            {results.recommendation.recommendedTest}
          </p>
          <p className="text-xs text-green-700 mt-1">
            {results.recommendation.reasoning}
          </p>
        </div>
      )}

      {results.distribution && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-2">Distribution Analysis</h4>
          <p className="text-sm text-orange-800">
            Most Likely: {results.distribution.most_likely_distribution}
          </p>
          <p className="text-xs text-orange-700">
            Confidence: {results.distribution.confidence}
          </p>
        </div>
      )}
    </div>
  );
}
