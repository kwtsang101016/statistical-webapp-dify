import { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { difyAPI } from '../utils/difyApi';

interface SmartAnalysisAdvisorProps {
  data: number[];
  currentAnalysis?: string;
  onRecommendationSelect?: (recommendation: string) => void;
}

interface AnalysisRecommendation {
  recommendedTest: string;
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
  prerequisites: string[];
  interpretation: string;
}

export function SmartAnalysisAdvisor({ data, currentAnalysis, onRecommendationSelect }: SmartAnalysisAdvisorProps) {
  const [recommendation, setRecommendation] = useState<AnalysisRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataQuality, setDataQuality] = useState<{
    quality: 'excellent' | 'good' | 'poor';
    issues: string[];
    suggestions: string[];
  } | null>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      // Add delay to prevent rapid API calls
      const timer = setTimeout(() => {
        analyzeData();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [data]);

  const analyzeData = async () => {
    setIsLoading(true);
    try {
      // Add validation
      if (!data || data.length === 0) {
        console.log('No data to analyze');
        return;
      }

      console.log('🔍 Analyzing data:', data.length, 'points');

      // Step 1: Check data quality (with error handling)
      try {
        const qualityResult = await difyAPI.checkDataQuality(data);
        if (qualityResult.success) {
          try {
            const qualityData = JSON.parse(qualityResult.data || '{}');
            setDataQuality(qualityData);
          } catch {
            // Fallback for text response
            setDataQuality({
              quality: 'good',
              issues: [],
              suggestions: [qualityResult.data || '']
            });
          }
        } else {
          console.warn('Data quality check failed:', qualityResult.error);
        }
      } catch (error) {
        console.warn('Data quality check error:', error);
      }

      // Step 2: Get analysis recommendation (with delay and error handling)
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between calls
        const recommendationResult = await difyAPI.getAnalysisRecommendation(
          data, 
          currentAnalysis || "I want to understand my data better"
        );

        if (recommendationResult.success) {
          try {
            const recData = JSON.parse(recommendationResult.data || '{}');
            setRecommendation(recData);
          } catch {
            // Fallback for text response
            setRecommendation({
              recommendedTest: "Statistical Analysis",
              reasoning: recommendationResult.data || "AI analysis completed",
              confidence: 'medium',
              prerequisites: [],
              interpretation: "Review the analysis results carefully"
            });
          }
        } else {
          console.warn('Analysis recommendation failed:', recommendationResult.error);
        }
      } catch (error) {
        console.warn('Analysis recommendation error:', error);
      }

    } catch (error) {
      console.error('Analysis advisor error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'good': return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'poor': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <TrendingUp className="h-5 w-5 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center">
          <Brain className="h-6 w-6 text-purple-600 animate-pulse mr-3" />
          <span className="text-gray-600">AI is analyzing your data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Data Quality Assessment */}
      {dataQuality && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-start space-x-3">
            {getQualityIcon(dataQuality.quality)}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                Data Quality: {dataQuality.quality.charAt(0).toUpperCase() + dataQuality.quality.slice(1)}
              </h3>
              
              {dataQuality.issues.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1">Issues detected:</p>
                  <ul className="text-xs text-red-600 list-disc list-inside">
                    {dataQuality.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {dataQuality.suggestions.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1">Suggestions:</p>
                  <ul className="text-xs text-blue-600 list-disc list-inside">
                    {dataQuality.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Recommendation */}
      {recommendation && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">
                  Recommended Analysis: {recommendation.recommendedTest}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(recommendation.confidence)}`}>
                  {recommendation.confidence} confidence
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {recommendation.reasoning}
              </p>

              {recommendation.prerequisites.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Prerequisites:</p>
                  <ul className="text-xs text-gray-600 list-disc list-inside">
                    {recommendation.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-1">How to interpret results:</p>
                <p className="text-xs text-gray-600">{recommendation.interpretation}</p>
              </div>

              {onRecommendationSelect && (
                <button
                  onClick={() => onRecommendationSelect(recommendation.recommendedTest)}
                  className="w-full mt-3 px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                >
                  Apply Recommendation
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Data Summary */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Data Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-500">Sample Size:</span>
            <span className="ml-2 font-medium">{data.length}</span>
          </div>
          <div>
            <span className="text-gray-500">Mean:</span>
            <span className="ml-2 font-medium">
              {(data.reduce((a, b) => a + b, 0) / data.length).toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Min:</span>
            <span className="ml-2 font-medium">{Math.min(...data).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">Max:</span>
            <span className="ml-2 font-medium">{Math.max(...data).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Powered by Dify */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          🤖 Powered by Dify AI Workflows
        </p>
      </div>
    </div>
  );
}
