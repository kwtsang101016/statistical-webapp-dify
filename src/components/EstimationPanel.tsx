import React, { useMemo } from 'react';
import { DistributionType, DistributionParams } from '../utils/distributions';
import { estimateMLE, estimateMoM } from '../utils/statistics';
import { Calculator, Target, TrendingUp } from 'lucide-react';

interface EstimationPanelProps {
  data: number[];
  distribution: DistributionType;
  trueParams: DistributionParams[DistributionType];
}

const EstimationPanel: React.FC<EstimationPanelProps> = ({
  data,
  distribution,
  trueParams
}) => {
  const mleResult = useMemo(() => {
    return estimateMLE(data, distribution, trueParams);
  }, [data, distribution, trueParams]);

  const momResult = useMemo(() => {
    return estimateMoM(data, distribution, trueParams);
  }, [data, distribution, trueParams]);

  const EstimationCard: React.FC<{
    title: string;
    result: any;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, result, icon, color }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
      
      <div className="space-y-3">
        {Object.entries(result.estimatedParams).map(([param, value]) => {
          const trueValue = (trueParams as any)[param];
          const error = Math.abs((value as number) - trueValue);
          const errorPercent = (error / Math.abs(trueValue)) * 100;
          
          return (
            <div key={param} className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-gray-700">{param}:</span>
                <span className="ml-2 text-sm text-gray-900">{Number(value).toFixed(3)}</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">
                  True: {Number(trueValue).toFixed(3)}
                </div>
                <div className={`text-xs ${errorPercent < 5 ? 'text-green-600' : errorPercent < 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                  Error: {errorPercent.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
        
        {result.logLikelihood !== undefined && (
          <div className="pt-3 border-t border-gray-200">
            <div className="text-sm">
              <span className="text-gray-600">Log-Likelihood:</span>
              <span className="ml-2 font-medium text-gray-900">
                {result.logLikelihood.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Parameter Estimation Methods</h3>
        <p className="text-sm text-gray-600 mb-6">
          Compare Maximum Likelihood Estimation (MLE) and Method of Moments (MoM) 
          with the true parameters used to generate the data.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EstimationCard
            title="Maximum Likelihood Estimation"
            result={mleResult}
            icon={<Target className="h-5 w-5 text-blue-500" />}
            color="bg-blue-100"
          />
          
          <EstimationCard
            title="Method of Moments"
            result={momResult}
            icon={<Calculator className="h-5 w-5 text-green-500" />}
            color="bg-green-100"
          />
        </div>
      </div>

      {/* Method Comparison */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Method Comparison</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">MLE Log-Likelihood:</span>
            <span className="font-medium">{mleResult.logLikelihood?.toFixed(2) || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">MoM Log-Likelihood:</span>
            <span className="font-medium">{momResult.logLikelihood?.toFixed(2) || 'N/A'}</span>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> Higher log-likelihood indicates better fit. 
              MLE typically provides more efficient estimates, while MoM is often easier to compute.
            </p>
          </div>
        </div>
      </div>

      {/* Educational Information */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Learning Objectives
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Understand how different estimation methods work</li>
          <li>• Compare accuracy of MLE vs MoM for different distributions</li>
          <li>• Observe how sample size affects estimation quality</li>
          <li>• Learn to interpret log-likelihood values</li>
        </ul>
      </div>
    </div>
  );
};

export default EstimationPanel;
