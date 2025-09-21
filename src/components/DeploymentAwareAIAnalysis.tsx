import { useState, useEffect } from 'react';
import { Brain, AlertTriangle, ExternalLink, Github } from 'lucide-react';
import { SimpleAIAnalysis } from './SimpleAIAnalysis';
import { getDeploymentInfo } from '../utils/deploymentConfig';

interface DeploymentAwareAIAnalysisProps {
  data: number[];
}

export function DeploymentAwareAIAnalysis({ data }: DeploymentAwareAIAnalysisProps) {
  const [deploymentInfo] = useState(getDeploymentInfo());
  const [aiTested, setAiTested] = useState(false);
  const [aiWorking, setAiWorking] = useState(false);

  useEffect(() => {
    // Test if AI is actually working on this deployment
    testAIAvailability();
  }, []);

  const testAIAvailability = async () => {
    try {
      // Quick test of Dify API
      const response = await fetch('https://api.dify.ai/v1/workflows/run', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer app-PKUe3YkOiEyTtsPhEsRXhXTn', // Your working API key
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {
            query: 'test',
            data_type: 'test',
            format: 'json'
          },
          response_mode: 'blocking',
          user: 'deployment-test'
        })
      });

      setAiWorking(response.status === 200 || response.status === 400); // 400 is OK (wrong params), connection works
      setAiTested(true);
    } catch (error) {
      console.warn('AI availability test failed:', error);
      setAiWorking(false);
      setAiTested(true);
    }
  };

  if (!aiTested) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-blue-600 animate-pulse mr-2" />
          <span className="text-blue-800">Testing AI availability...</span>
        </div>
      </div>
    );
  }

  if (!aiWorking) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 mb-2">
              AI Features Limited on {deploymentInfo.environment}
            </h3>
            <p className="text-sm text-yellow-800 mb-3">
              {deploymentInfo.message || 'AI workflows may not be available on this deployment.'}
            </p>
            
            {deploymentInfo.recommendations.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-yellow-800">Recommendations:</p>
                <ul className="text-xs text-yellow-700 list-disc list-inside">
                  {deploymentInfo.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-3 flex items-center space-x-4">
              <a
                href="https://your-vercel-deployment.vercel.app"
                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Try Full Version on Vercel
              </a>
              <a
                href="https://github.com/kwtsang101016/statistical-webapp"
                className="inline-flex items-center text-xs text-gray-600 hover:text-gray-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-3 w-3 mr-1" />
                Run Locally
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AI is working - show full AI analysis
  return <SimpleAIAnalysis data={data} />;
}
