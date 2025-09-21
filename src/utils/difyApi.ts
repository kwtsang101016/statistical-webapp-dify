// Dify API integration for statistical webapp
// Replaces direct LLM calls with intelligent Dify workflows

import { DIFY_WORKFLOWS } from '../config/difyConfig';

interface DifyResponse {
  success: boolean;
  data?: string;
  error?: string;
  workflow_run_id?: string;
}

// interface DifyWorkflowRequest {
//   inputs: Record<string, any>;
//   response_mode: 'blocking' | 'streaming';
//   user: string;
// }

export class DifyStatisticalAPI {
  private baseUrl: string;
  // private apiKey: string; // Not used in current implementation

  constructor(baseUrl?: string, _apiKey?: string) {
    // Use your Dify API credentials
    this.baseUrl = baseUrl || import.meta.env.VITE_DIFY_BASE_URL || 'https://api.dify.ai/v1';
    // apiKey parameter kept for future use but not currently needed
    console.log('Dify API initialized with base URL:', this.baseUrl);
  }

  private async callDifyWorkflow(
    workflowConfig: { id: string; apiKey: string }, 
    inputs: Record<string, any>,
    user: string = 'statistical-webapp-user'
  ): Promise<DifyResponse> {
    try {
      // Each app has its own API key - use the specific workflow's API key
      const response = await fetch(`${this.baseUrl}/workflows/run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workflowConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs,
          response_mode: 'blocking',
          user
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        data: result.data?.outputs?.result || result.answer || '',
        workflow_run_id: result.workflow_run_id
      };

    } catch (error) {
      console.error('Dify workflow error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // AI Data Generation with your statistical data generator workflow
  async generateStatisticalData(prompt: string): Promise<DifyResponse> {
    return this.callDifyWorkflow(DIFY_WORKFLOWS.DATA_GENERATION, {
      query: prompt,
      data_type: 'statistical',
      format: 'json'
    });
  }

  // Statistical Analysis Advisor
  async getAnalysisRecommendation(data: number[], userGoal: string): Promise<DifyResponse> {
    // Create rich data summary (now up to 256 characters!)
    const mean = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(2);
    const std = Math.sqrt(data.reduce((sum, x) => sum + Math.pow(x - parseFloat(mean), 2), 0) / data.length).toFixed(2);
    const min = Math.min(...data).toFixed(2);
    const max = Math.max(...data).toFixed(2);
    
    const richSummary = `{"n":${data.length},"mean":${mean},"std":${std},"min":${min},"max":${max},"range":${(parseFloat(max) - parseFloat(min)).toFixed(2)}}`;

    return this.callDifyWorkflow(DIFY_WORKFLOWS.ANALYSIS_ADVISOR, {
      data_summary: richSummary,               // Rich summary under 256 chars
      user_goal: userGoal,                     // Required: string
      sample_size: data.length                 // Required: number
    });
  }

  // Results Interpreter - REMOVED to free up workflow slot
  // This functionality can be added back later if needed
  // async interpretResults(...) { ... }

  // Data Quality Checker
  async checkDataQuality(data: number[]): Promise<DifyResponse> {
    // Ensure we have valid data
    if (!data || data.length === 0) {
      return { success: false, error: 'No data provided for quality check' };
    }

    return this.callDifyWorkflow(DIFY_WORKFLOWS.DATA_QUALITY, {
      data: JSON.stringify(data.slice(0, 100)), // Send sample for analysis
      sample_size: data.length  // Proper number type
    });
  }

  // Smart Distribution Detector
  async detectDistribution(data: number[]): Promise<DifyResponse> {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const dataStats = {
      length: data.length,
      mean: mean,
      variance: data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / data.length,
      std: Math.sqrt(data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / data.length),
      min: Math.min(...data),
      max: Math.max(...data),
      range: Math.max(...data) - Math.min(...data)
    };

    return this.callDifyWorkflow(DIFY_WORKFLOWS.DISTRIBUTION_DETECTOR, {
      data_stats: JSON.stringify(dataStats),
      sample_data: JSON.stringify(data) // Send FULL dataset now!
    });
  }

  // Educational Tutor (using analysis advisor for now)
  async getTutorialExplanation(topic: string, currentData?: number[]): Promise<DifyResponse> {
    return this.callDifyWorkflow(DIFY_WORKFLOWS.ANALYSIS_ADVISOR, {
      user_goal: `Explain the concept: ${topic}`,
      data_summary: currentData ? JSON.stringify({
        size: currentData.length,
        type: 'numerical'
      }) : '{}',
      sample_size: currentData?.length || 0  // Proper number type
    });
  }
}

// Create singleton instance
export const difyAPI = new DifyStatisticalAPI();

// Backward compatibility wrapper for existing code
export async function callLLMAPI(prompt: string): Promise<{success: boolean, data?: string, error?: string}> {
  console.log('Using Dify AI workflow instead of direct LLM API');
  return difyAPI.generateStatisticalData(prompt);
}
