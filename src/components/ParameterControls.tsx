import React, { useCallback } from 'react';
import type { DistributionType, DistributionParams } from '../utils/distributions';
import { DISTRIBUTION_INFO } from '../utils/distributions';

interface ParameterControlsProps {
  distribution: DistributionType;
  parameters: DistributionParams[DistributionType];
  onParameterChange: (params: DistributionParams[DistributionType]) => void;
}

const ParameterControls: React.FC<ParameterControlsProps> = ({
  distribution,
  parameters,
  onParameterChange
}) => {
  const handleParameterChange = useCallback((paramName: string, value: number) => {
    const newParams = { ...parameters, [paramName]: value };
    onParameterChange(newParams);
  }, [parameters, onParameterChange]);

  const paramInfo = DISTRIBUTION_INFO[distribution].parameters;

  return (
    <div className="space-y-4">
      {paramInfo.map((param) => {
        const value = (parameters as any)[param.name];
        
        return (
          <div key={param.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {param.name}: {value.toFixed(param.step === 1 ? 0 : 2)}
            </label>
            <input
              type="range"
              min={param.min || 0}
              max={param.max || 10}
              step={param.step || 0.01}
              value={value}
              onChange={(e) => handleParameterChange(param.name, Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{param.min || 0}</span>
              <span className="text-gray-600">{param.description}</span>
              <span>{param.max || 10}</span>
            </div>
          </div>
        );
      })}
      
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default ParameterControls;
