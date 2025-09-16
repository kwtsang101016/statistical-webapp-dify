import React from 'react';
import { Upload, BarChart3, Brain, ArrowLeft } from 'lucide-react';

interface DataInputSelectorProps {
  onMethodSelect: (method: 'upload' | 'generate' | 'ai') => void;
}

export function DataInputSelector({ onMethodSelect }: DataInputSelectorProps) {
  const methods = [
    {
      id: 'upload' as const,
      title: 'Upload Dataset',
      description: 'Upload your own CSV or Excel file for analysis',
      icon: Upload,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:border-blue-300 hover:bg-blue-100'
    },
    {
      id: 'generate' as const,
      title: 'Generate Data',
      description: 'Create synthetic data using probability distributions',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:border-green-300 hover:bg-green-100'
    },
    {
      id: 'ai' as const,
      title: 'AI-Generated Data',
      description: 'Ask AI to create custom datasets for your analysis',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:border-purple-300 hover:bg-purple-100'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Data Source</h3>
        <p className="text-gray-600">Select how you'd like to get data for your analysis</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {methods.map((method) => {
          const IconComponent = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => onMethodSelect(method.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${method.bgColor} ${method.borderColor} ${method.hoverColor}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${method.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${method.color}`} />
                </div>
                <div className="text-left flex-1">
                  <h4 className="font-semibold text-gray-900">{method.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                </div>
                <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

