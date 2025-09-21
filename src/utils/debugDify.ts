// Debug utility to test individual workflows with exact parameters
// This will help us identify what each workflow actually expects

export async function debugWorkflow(workflowApiKey: string, inputs: Record<string, any>) {
  try {
    console.log('🔍 Testing workflow with inputs:', inputs);
    
    const response = await fetch('https://api.dify.ai/v1/workflows/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${workflowApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs,
        response_mode: 'blocking',
        user: 'debug-user'
      })
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response text:', responseText);

    if (response.ok) {
      return { success: true, data: responseText };
    } else {
      return { success: false, error: responseText };
    }
  } catch (error) {
    console.error('Debug error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Test each workflow individually
export async function debugAllWorkflows() {
  console.log('🧪 Debugging All Workflows...\n');

  // Test Analysis Advisor with minimal inputs
  console.log('1️⃣ Testing Analysis Advisor with minimal inputs...');
  await debugWorkflow('app-mw7Yoc7WSz74HUCtPMGWo4as', {
    data_summary: '{"length":5,"mean":75}',
    user_goal: 'test',
    sample_size: 5
  });

  // Test with different parameter names
  console.log('2️⃣ Testing Analysis Advisor with different parameter names...');
  await debugWorkflow('app-mw7Yoc7WSz74HUCtPMGWo4as', {
    query: 'analyze data',
    data: '[75,80,70]'
  });

  // Test Data Quality with minimal inputs
  console.log('3️⃣ Testing Data Quality with minimal inputs...');
  await debugWorkflow('app-y3dzE5hviCOKcJpnYgAyOOyp', {
    data: '[75,80,70,85,90]',
    sample_size: 5
  });

  // Test with different parameter names
  console.log('4️⃣ Testing Data Quality with different parameter names...');
  await debugWorkflow('app-y3dzE5hviCOKcJpnYgAyOOyp', {
    query: 'check quality of data: [75,80,70,85,90]'
  });
}

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).debugWorkflow = debugWorkflow;
  (window as any).debugAllWorkflows = debugAllWorkflows;
  console.log('🔧 Debug functions loaded:');
  console.log('  - debugWorkflow(apiKey, inputs) - Test specific workflow');
  console.log('  - debugAllWorkflows() - Test all with different parameters');
}
