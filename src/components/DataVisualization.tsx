import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { GeneratedData } from '../types/statistics';

interface DataVisualizationProps {
  data: GeneratedData;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data }) => {
  const histogramData = useMemo(() => {
    const values = data.values;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const numBins = Math.min(20, Math.ceil(Math.sqrt(values.length)));
    const binWidth = (max - min) / numBins;
    
    const bins = Array.from({ length: numBins }, (_, i) => ({
      bin: `${(min + i * binWidth).toFixed(2)}-${(min + (i + 1) * binWidth).toFixed(2)}`,
      count: 0,
      density: 0,
      binStart: min + i * binWidth,
      binEnd: min + (i + 1) * binWidth
    }));
    
    // Count values in each bin
    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), numBins - 1);
      bins[binIndex].count++;
    });
    
    // Calculate density
    bins.forEach(bin => {
      bin.density = bin.count / (values.length * binWidth);
    });
    
    return bins;
  }, [data.values]);

  const densityData = useMemo(() => {
    const values = data.values;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const numPoints = 100;
    const step = (max - min) / numPoints;
    
    return Array.from({ length: numPoints }, (_, i) => {
      const x = min + i * step;
      // Simple kernel density estimation
      const bandwidth = (max - min) / 20;
      let density = 0;
      
      values.forEach(value => {
        const diff = (x - value) / bandwidth;
        density += Math.exp(-0.5 * diff * diff) / (bandwidth * Math.sqrt(2 * Math.PI));
      });
      
      density /= values.length;
      
      return { x: Number(x.toFixed(2)), y: density };
    });
  }, [data.values]);

  return (
    <div className="space-y-6">
      {/* Histogram */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Histogram</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="bin" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'count' ? `${value} observations` : `${value.toFixed(4)} density`,
                  name === 'count' ? 'Count' : 'Density'
                ]}
                labelFormatter={(label) => `Range: ${label}`}
              />
              <Bar dataKey="count" fill="#3b82f6" opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Density Plot */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Density Plot</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={densityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="x" 
                tick={{ fontSize: 12 }}
                label={{ value: 'Value', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Density', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(4)}`, 'Density']}
                labelFormatter={(label) => `Value: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Data Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Distribution:</span>
            <span className="ml-2 font-medium">{data.distribution}</span>
          </div>
          <div>
            <span className="text-gray-600">Sample Size:</span>
            <span className="ml-2 font-medium">{data.sampleSize.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Range:</span>
            <span className="ml-2 font-medium">
              {data.summaryStats.min.toFixed(2)} - {data.summaryStats.max.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Mean:</span>
            <span className="ml-2 font-medium">{data.summaryStats.mean.toFixed(3)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;

