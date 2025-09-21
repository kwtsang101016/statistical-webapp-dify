// Dify Workflow Configuration
// Each workflow has its own API key (from your published workflows)

export const DIFY_WORKFLOWS = {
  // Statistical Data Generator
  DATA_GENERATION: {
    id: 'a5d947f1-c858-4daa-a348-2b628543f1a6',
    apiKey: 'app-PKUe3YkOiEyTtsPhEsRXhXTn'
  },
  
  // Statistical Analysis Advisor  
  ANALYSIS_ADVISOR: {
    id: '474746c2-5562-4eda-bab4-638db738d69a',
    apiKey: 'app-mw7Yoc7WSz74HUCtPMGWo4as'
  },
  
  // Statistical Results Interpreter - REMOVED to free up workflow slot
  // RESULTS_INTERPRETER: {
  //   id: 'bb243e09-f6ce-4e85-9c2c-f0d737d9b9fe',
  //   apiKey: 'app-73CkJ8TJ9nAcwoD7c5Vyhtg4'
  // },
  
  // Data Quality Checker
  DATA_QUALITY: {
    id: '7756b560-3f81-4fea-a786-3dbd29bee25c',
    apiKey: 'app-y3dzE5hviCOKcJpnYgAyOOyp'
  },
  
  // Distribution Detector
  DISTRIBUTION_DETECTOR: {
    id: 'cc525721-3818-49b6-b1ff-2b0bbdb57772',
    apiKey: 'app-9cXvgTRC5IbztcVpjB9iGBcX'
  }
} as const;

export const DIFY_CONFIG = {
  BASE_URL: import.meta.env.VITE_DIFY_BASE_URL || 'https://api.dify.ai/v1',
  API_KEY: import.meta.env.VITE_DIFY_API_KEY || '',
  DEFAULT_USER: 'statistical-webapp-user'
} as const;

// Workflow descriptions for documentation
export const WORKFLOW_DESCRIPTIONS = {
  'DATA_GENERATION': 'Generates statistical data from natural language prompts',
  'ANALYSIS_ADVISOR': 'Recommends appropriate statistical tests and analysis methods',
  'RESULTS_INTERPRETER': 'Explains statistical results in plain language',
  'DATA_QUALITY': 'Assesses data quality and suggests improvements',
  'DISTRIBUTION_DETECTOR': 'Identifies likely probability distribution of data'
} as const;
