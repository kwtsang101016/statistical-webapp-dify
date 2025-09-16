import React, { useState } from 'react';
import { callDashScopeAPI } from '../utils/llmApi';

export function APITest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing API...');
    
    try {
      const response = await callDashScopeAPI('Generate 5 random numbers between 1 and 10');
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">API Test</h3>
      <button
        onClick={testAPI}
        disabled={loading}
        className="btn-primary mb-4"
      >
        {loading ? 'Testing...' : 'Test DashScope API'}
      </button>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
        {result}
      </pre>
    </div>
  );
}

