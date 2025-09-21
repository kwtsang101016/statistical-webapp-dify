import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Import Dify test functions for browser console
import { testDifyWorkflows, testSingleWorkflow } from './utils/difyTest'
import { debugWorkflow, debugAllWorkflows } from './utils/debugDify'

// Make test functions available in browser console
if (typeof window !== 'undefined') {
  (window as any).testDify = testDifyWorkflows;
  (window as any).testSingleWorkflow = testSingleWorkflow;
  (window as any).debugWorkflow = debugWorkflow;
  (window as any).debugAllWorkflows = debugAllWorkflows;
  console.log('🔧 Dify test functions loaded:');
  console.log('  - testDify() - Test all workflows');
  console.log('  - debugAllWorkflows() - Debug failing workflows');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
