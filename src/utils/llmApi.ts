// LLM API integration for China-friendly services
// Supports Alibaba Cloud Bailian, Baidu ERNIE, and Zhipu AI

interface LLMResponse {
  success: boolean;
  data?: string;
  error?: string;
}


// Alibaba Cloud DashScope API (Bailian service)
export async function callDashScopeAPI(prompt: string): Promise<LLMResponse> {
  // Use environment variable first, fallback to direct API key for demo
  const apiKey = import.meta.env.VITE_DASHSCOPE_API_KEY || 'sk-0bce80a7fc184aea9aa906b2b5a75e47';
  
  console.log('API Key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
  console.log('All env vars:', import.meta.env);

  try {
    // Try the input.messages format (conversation style)
    const requestBody = {
      model: 'qwen-turbo',
      input: {
        messages: [
          {
            role: 'user',
            content: `Generate statistical data based on this request: ${prompt}. Respond with JSON format containing the data array and description.`
          }
        ]
      },
      parameters: {
        temperature: 0.7,
        max_tokens: 1000
      }
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    // Use different endpoints for development vs production
    const isDevelopment = import.meta.env.DEV;
    const apiUrl = isDevelopment 
      ? '/api/dashscope'  // Use Vite proxy in development
      : 'https://statistical-webapp.vercel.app/api/dashscope'; // Use Vercel serverless function in production

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    const data = await response.json();
    console.log('DashScope API response:', data);
    
    // Try different response formats
    if (data.output && data.output.text) {
      return {
        success: true,
        data: data.output.text
      };
    } else if (data.output && data.output.choices && data.output.choices[0] && data.output.choices[0].message) {
      return {
        success: true,
        data: data.output.choices[0].message.content
      };
    } else if (data.choices && data.choices[0] && data.choices[0].message) {
      return {
        success: true,
        data: data.choices[0].message.content
      };
    } else if (data.result) {
      return {
        success: true,
        data: data.result
      };
    } else if (data.text) {
      return {
        success: true,
        data: data.text
      };
    } else {
      console.log('Full response structure:', JSON.stringify(data, null, 2));
      return {
        success: false,
        error: `Invalid response format from DashScope API: ${JSON.stringify(data)}`
      };
    }
  } catch (error) {
    console.error('DashScope API error:', error);
    return {
      success: false,
      error: `DashScope API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Baidu ERNIE API
export async function callBaiduAPI(prompt: string): Promise<LLMResponse> {
  const apiKey = import.meta.env.VITE_BAIDU_API_KEY;
  const secretKey = import.meta.env.VITE_BAIDU_SECRET_KEY;
  
  if (!apiKey || !secretKey) {
    return {
      success: false,
      error: 'Baidu API credentials not found. Please set VITE_BAIDU_API_KEY and VITE_BAIDU_SECRET_KEY in your .env file.'
    };
  }

  try {
    // First, get access token
    const tokenResponse = await fetch(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`, {
      method: 'POST'
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    // Then call ERNIE API
    const response = await fetch('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_bot_turbo?access_token=' + tokenData.access_token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_output_tokens: 1000
      })
    });

    const data = await response.json();
    
    if (data.result) {
      return {
        success: true,
        data: data.result
      };
    } else {
      return {
        success: false,
        error: 'Invalid response format from Baidu API'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Baidu API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Zhipu AI API
export async function callZhipuAPI(prompt: string): Promise<LLMResponse> {
  const apiKey = import.meta.env.VITE_ZHIPU_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: 'Zhipu API key not found. Please set VITE_ZHIPU_API_KEY in your .env file.'
    };
  }

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return {
        success: true,
        data: data.choices[0].message.content
      };
    } else {
      return {
        success: false,
        error: 'Invalid response format from Zhipu API'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Zhipu API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Enhanced simulated data generation
function generateSimulatedData(prompt: string): LLMResponse {
  console.log('Using enhanced simulated data generation');
  
  const lowerPrompt = prompt.toLowerCase();
  
  // Extract numbers from prompt for sample size
  const numberMatch = prompt.match(/\d+/);
  const sampleSize = numberMatch ? Math.min(parseInt(numberMatch[0]), 100) : 20;
  
  // Generate data based on prompt content
  if (lowerPrompt.includes('score') || lowerPrompt.includes('test') || lowerPrompt.includes('exam')) {
    const scores = Array.from({ length: sampleSize }, () => Math.floor(Math.random() * 40) + 60);
    return {
      success: true,
      data: JSON.stringify({ 
        data: scores, 
        description: `Simulated test scores (${sampleSize} students, range: 60-100)` 
      })
    };
  }
  
  if (lowerPrompt.includes('height') || lowerPrompt.includes('cm') || lowerPrompt.includes('tall')) {
    const heights = Array.from({ length: sampleSize }, () => Math.floor(Math.random() * 30) + 150);
    return {
      success: true,
      data: JSON.stringify({ 
        data: heights, 
        description: `Simulated heights in cm (${sampleSize} people, range: 150-180cm)` 
      })
    };
  }
  
  if (lowerPrompt.includes('weight') || lowerPrompt.includes('kg')) {
    const weights = Array.from({ length: sampleSize }, () => Math.floor(Math.random() * 30) + 50);
    return {
      success: true,
      data: JSON.stringify({ 
        data: weights, 
        description: `Simulated weights in kg (${sampleSize} people, range: 50-80kg)` 
      })
    };
  }
  
  if (lowerPrompt.includes('age') || lowerPrompt.includes('year')) {
    const ages = Array.from({ length: sampleSize }, () => Math.floor(Math.random() * 50) + 18);
    return {
      success: true,
      data: JSON.stringify({ 
        data: ages, 
        description: `Simulated ages (${sampleSize} people, range: 18-68 years)` 
      })
    };
  }
  
  if (lowerPrompt.includes('salary') || lowerPrompt.includes('income') || lowerPrompt.includes('wage')) {
    const salaries = Array.from({ length: sampleSize }, () => Math.floor(Math.random() * 50000) + 30000);
    return {
      success: true,
      data: JSON.stringify({ 
        data: salaries, 
        description: `Simulated annual salaries (${sampleSize} people, range: $30k-$80k)` 
      })
    };
  }
  
  if (lowerPrompt.includes('temperature') || lowerPrompt.includes('celsius') || lowerPrompt.includes('°c')) {
    const temps = Array.from({ length: sampleSize }, () => Math.floor(Math.random() * 20) + 15);
    return {
      success: true,
      data: JSON.stringify({ 
        data: temps, 
        description: `Simulated temperatures (${sampleSize} readings, range: 15-35°C)` 
      })
    };
  }
  
  // Default: random numbers with context
  const defaultData = Array.from({ length: sampleSize }, () => Math.floor(Math.random() * 100));
  return {
    success: true,
    data: JSON.stringify({ 
      data: defaultData, 
      description: `Simulated random numbers (${sampleSize} values, range: 0-100)` 
    })
  };
}

// Main function to call the best available API
export async function callLLMAPI(prompt: string): Promise<LLMResponse> {
  console.log('Attempting to call DashScope API...');
  
  try {
    const result = await callDashScopeAPI(prompt);
    if (result.success) {
      console.log('DashScope API succeeded!');
      return result;
    }
    console.warn('DashScope API failed:', result.error);
  } catch (error) {
    console.warn('DashScope API error:', error);
  }

  // If DashScope fails, try other APIs
  const apis = [
    { name: 'Zhipu', fn: callZhipuAPI },
    { name: 'Baidu', fn: callBaiduAPI }
  ];

  for (const api of apis) {
    try {
      const result = await api.fn(prompt);
      if (result.success) {
        return result;
      }
      console.warn(`${api.name} API failed:`, result.error);
    } catch (error) {
      console.warn(`${api.name} API error:`, error);
    }
  }

  // If all APIs fail, use simulated data
  console.log('All APIs failed, using simulated data generation');
  return generateSimulatedData(prompt);
}
