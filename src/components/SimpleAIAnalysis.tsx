import { useState } from 'react';
import { Brain, CheckCircle, BarChart3, TrendingUp, Loader, AlertCircle } from 'lucide-react';

interface SimpleAIAnalysisProps {
  data: number[];
}

interface AIResult {
  type: 'quality' | 'recommendation' | 'distribution';
  content: string;
  success: boolean;
}

export function SimpleAIAnalysis({ data }: SimpleAIAnalysisProps) {
  const [results, setResults] = useState<AIResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAIAnalysis = async (analysisType: 'quality' | 'recommendation' | 'distribution') => {
    setIsAnalyzing(true);
    
    try {
      let apiKey = '';
      let inputs = {};
      
      // Configure based on analysis type
      switch (analysisType) {
        case 'quality':
          apiKey = 'app-y3dzE5hviCOKcJpnYgAyOOyp';
          inputs = {
            data: JSON.stringify(data.slice(0, 20)), // Smaller sample to avoid issues
            sample_size: data.length
          };
          break;
          
        case 'recommendation':
          apiKey = 'app-mw7Yoc7WSz74HUCtPMGWo4as';
          // Create rich data summary (up to 256 characters!)
          const mean = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(2);
          const std = Math.sqrt(data.reduce((sum, x) => sum + Math.pow(x - parseFloat(mean), 2), 0) / data.length).toFixed(2);
          const min = Math.min(...data).toFixed(2);
          const max = Math.max(...data).toFixed(2);
          const richSummary = `{"n":${data.length},"mean":${mean},"std":${std},"min":${min},"max":${max},"range":${(parseFloat(max) - parseFloat(min)).toFixed(2)}}`;
          
          inputs = {
            data_summary: richSummary, // Rich summary under 256 chars
            user_goal: 'analyze this dataset',
            sample_size: data.length
          };
          break;
          
        case 'distribution':
          apiKey = 'app-9cXvgTRC5IbztcVpjB9iGBcX';
          const dataMean = data.reduce((a, b) => a + b, 0) / data.length;
          const stats = {
            length: data.length,
            mean: dataMean,
            variance: data.reduce((sum, x) => sum + Math.pow(x - dataMean, 2), 0) / data.length,
            std: Math.sqrt(data.reduce((sum, x) => sum + Math.pow(x - dataMean, 2), 0) / data.length),
            min: Math.min(...data),
            max: Math.max(...data),
            range: Math.max(...data) - Math.min(...data)
          };
          inputs = {
            data_stats: JSON.stringify(stats),
            sample_data: JSON.stringify(data) // Send FULL dataset with paragraph type!
          };
          break;
      }

      // Make API call
      const response = await fetch('https://api.dify.ai/v1/workflows/run', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs,
          response_mode: 'blocking',
          user: 'student-user'
        })
      });

      if (response.ok) {
        const result = await response.json();
        const aiOutput = result.data?.outputs?.result || 'AI analysis completed';
        
        // Parse JSON if possible, otherwise use as text
        let displayContent = aiOutput;
        
        console.log(`🔍 Raw ${analysisType} response:`, aiOutput);
        
        try {
          // Clean up the response - remove markdown code blocks
          let cleanedOutput = aiOutput.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          
          // Try to find JSON content if wrapped in text
          const jsonMatch = cleanedOutput.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            cleanedOutput = jsonMatch[0];
          }
          
          const parsed = JSON.parse(cleanedOutput);
          console.log(`✅ Parsed ${analysisType} JSON:`, parsed);
          
          // Format based on analysis type
          switch (analysisType) {
            case 'quality':
              displayContent = `Quality: ${parsed.quality || 'Unknown'}\nScore: ${parsed.overall_score || 'N/A'}\nSuggestions: ${(parsed.suggestions || []).join('; ')}`;
              break;
            case 'recommendation':
              displayContent = `Recommended Test: ${parsed.recommendedTest || 'Statistical Analysis'}\n\nReasoning: ${parsed.reasoning || 'No specific reasoning provided'}\n\nConfidence: ${parsed.confidence || 'Medium'}\n\nEducational Notes: ${parsed.educational_notes || 'No additional notes'}`;
              break;
            case 'distribution':
              displayContent = `Most Likely Distribution: ${parsed.most_likely_distribution || 'Unknown'}\n\nConfidence: ${parsed.confidence || 'Medium'}\n\nCharacteristics: ${parsed.characteristics?.symmetry || 'Unknown symmetry'}\n\nExplanation: ${parsed.educational_explanation || 'No explanation provided'}`;
              break;
          }
        } catch (parseError) {
          console.warn(`❌ JSON parsing failed for ${analysisType}:`, parseError);
          console.log('Full raw response:', result);
          console.log('AI Output:', aiOutput);
          
          // If it's just "AI analysis completed", there might be an issue with the workflow
          if (aiOutput.includes('AI analysis completed')) {
            displayContent = `⚠️ Workflow returned generic response. This might indicate:\n• Workflow prompt needs JSON output instruction\n• LLM node configuration issue\n• Input parameters not reaching the LLM\n\nRaw response: ${aiOutput}`;
          } else {
            // Use raw text if JSON parsing fails, but make it more readable
            displayContent = aiOutput.substring(0, 500) + (aiOutput.length > 500 ? '...' : '');
          }
        }

        setResults(prev => [...prev, {
          type: analysisType,
          content: displayContent,
          success: true
        }]);
      } else {
        const errorText = await response.text();
        setResults(prev => [...prev, {
          type: analysisType,
          content: `Analysis failed: ${errorText}`,
          success: false
        }]);
      }
    } catch (error) {
      setResults(prev => [...prev, {
        type: analysisType,
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: false
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'quality': return <CheckCircle className="h-4 w-4" />;
      case 'recommendation': return <BarChart3 className="h-4 w-4" />;
      case 'distribution': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getAnalysisTitle = (type: string) => {
    switch (type) {
      case 'quality': return 'Data Quality Assessment';
      case 'recommendation': return 'Analysis Recommendation';
      case 'distribution': return 'Distribution Analysis';
      default: return 'AI Analysis';
    }
  };

  return (
    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-purple-900 flex items-center">
        <Brain className="h-5 w-5 mr-2" />
        AI Analysis Tools
      </h3>
      
      <p className="text-sm text-purple-700">
        Get intelligent insights about your data using AI workflows:
      </p>

      {/* Analysis Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => runAIAnalysis('quality')}
          disabled={isAnalyzing}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
          Check Quality
        </button>
        
        <button
          onClick={() => runAIAnalysis('recommendation')}
          disabled={isAnalyzing}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <BarChart3 className="h-4 w-4 mr-2" />}
          Get Recommendation
        </button>
        
        <button
          onClick={() => runAIAnalysis('distribution')}
          disabled={isAnalyzing}
          className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}
          Detect Distribution
        </button>
      </div>

      {/* Results Display */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-purple-900">AI Analysis Results:</h4>
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                result.success
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start space-x-2">
                {result.success ? (
                  <div className="text-green-600">{getAnalysisIcon(result.type)}</div>
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h5 className={`text-sm font-medium ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {getAnalysisTitle(result.type)}
                  </h5>
                  <p className={`text-xs mt-1 whitespace-pre-line ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <p className="text-xs text-purple-600">
          🤖 Powered by Dify AI Workflows
        </p>
      </div>
    </div>
  );
}
