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
    const requestBody = {
      model: 'qwen-turbo',
      input: {
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates statistical data based on user descriptions. Always respond with valid JSON containing the generated data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      parameters: {
        temperature: 0.7,
        max_tokens: 1000
      }
    };

    const response = await fetch('/api/dashscope', {
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
    } else {
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

// Fallback function to generate simulated data
function generateSimulatedData(prompt: string): LLMResponse {
  console.log('Using simulated data generation as fallback');
  
  // Simple pattern matching to generate appropriate data
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('random') || lowerPrompt.includes('number')) {
    const numbers = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
    return {
      success: true,
      data: JSON.stringify({ data: numbers, description: 'Simulated random numbers' })
    };
  }
  
  if (lowerPrompt.includes('score') || lowerPrompt.includes('test')) {
    const scores = Array.from({ length: 20 }, () => Math.floor(Math.random() * 40) + 60);
    return {
      success: true,
      data: JSON.stringify({ data: scores, description: 'Simulated test scores' })
    };
  }
  
  if (lowerPrompt.includes('height') || lowerPrompt.includes('cm')) {
    const heights = Array.from({ length: 15 }, () => Math.floor(Math.random() * 30) + 150);
    return {
      success: true,
      data: JSON.stringify({ data: heights, description: 'Simulated heights in cm' })
    };
  }
  
  // Default: random numbers
  const defaultData = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
  return {
    success: true,
    data: JSON.stringify({ data: defaultData, description: 'Simulated data' })
  };
}

// Main function to call the best available API
export async function callLLMAPI(prompt: string): Promise<LLMResponse> {
  // Try APIs in order of preference
  const apis = [
    { name: 'DashScope', fn: callDashScopeAPI },
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
