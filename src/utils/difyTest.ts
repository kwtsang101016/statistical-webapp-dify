// Test script for Dify workflow integration
// Use this to verify your workflows are working correctly

import { difyAPI } from './difyApi';

export async function testDifyWorkflows() {
  console.log('🧪 Testing Dify Workflows Integration...\n');

  // Test 1: Data Generation
  console.log('1️⃣ Testing Data Generation Workflow...');
  try {
    const dataResult = await difyAPI.generateStatisticalData(
      '生成50个学生考试成绩，平均分75分，标准差10分'
    );
    console.log('✅ Data Generation Result:', dataResult);
  } catch (error) {
    console.error('❌ Data Generation Error:', error);
  }

  // Test 2: Analysis Advisor
  console.log('\n2️⃣ Testing Analysis Advisor Workflow...');
  try {
    const testData = [75, 82, 68, 90, 77, 85, 73, 88, 79, 81];
    const advisorResult = await difyAPI.getAnalysisRecommendation(
      testData,
      '我想比较两组学生的成绩差异'
    );
    console.log('✅ Analysis Advisor Result:', advisorResult);
  } catch (error) {
    console.error('❌ Analysis Advisor Error:', error);
  }

  // Test 3: Data Quality Checker
  console.log('\n3️⃣ Testing Data Quality Checker Workflow...');
  try {
    const testData = [75, 82, 68, 90, 77, 85, 73, 88, 79, 81, 999]; // Include outlier
    const qualityResult = await difyAPI.checkDataQuality(testData);
    console.log('✅ Data Quality Result:', qualityResult);
  } catch (error) {
    console.error('❌ Data Quality Error:', error);
  }

  // Test 4: Distribution Detector
  console.log('\n4️⃣ Testing Distribution Detector Workflow...');
  try {
    const testData = [75, 82, 68, 90, 77, 85, 73, 88, 79, 81];
    const distributionResult = await difyAPI.detectDistribution(testData);
    console.log('✅ Distribution Detector Result:', distributionResult);
  } catch (error) {
    console.error('❌ Distribution Detector Error:', error);
  }

  // Test 5: Results Interpreter - REMOVED
  console.log('\n5️⃣ Results Interpreter - Removed to free up workflow slot');

  console.log('\n🎉 Dify Workflow Testing Complete!');
}

// Helper function to test individual workflow
export async function testSingleWorkflow(workflowName: string) {
  console.log(`🧪 Testing ${workflowName} workflow...`);
  
  switch (workflowName) {
    case 'data-generation':
      return testDifyWorkflows();
    case 'analysis-advisor':
      const testData = [75, 82, 68, 90, 77];
      return difyAPI.getAnalysisRecommendation(testData, 'Test analysis');
    case 'data-quality':
      return difyAPI.checkDataQuality([75, 82, 68, 90, 77]);
    case 'distribution-detector':
      return difyAPI.detectDistribution([75, 82, 68, 90, 77]);
    case 'results-interpreter':
      return { success: false, error: 'Results Interpreter removed to free up workflow slot' };
    default:
      console.error('Unknown workflow:', workflowName);
  }
}

// Browser console helper
if (typeof window !== 'undefined') {
  (window as any).testDify = testDifyWorkflows;
  (window as any).testSingleWorkflow = testSingleWorkflow;
  console.log('🔧 Dify test functions available:');
  console.log('  - testDify() - Test all workflows');
  console.log('  - testSingleWorkflow("workflow-name") - Test specific workflow');
}

