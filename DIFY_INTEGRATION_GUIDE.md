# Dify Integration Guide for Statistical Webapp

This guide explains how to integrate your statistical webapp with Dify AI workflows for enhanced functionality.

## 🚀 Integration Overview

Your webapp now has **Dify-powered AI capabilities** that replace and enhance the existing LLM integration:

### New Components Added:
- `src/utils/difyApi.ts` - Dify API integration layer
- `src/components/DifyEnhancedDataGenerator.tsx` - AI data generation with smart recommendations
- `src/components/SmartAnalysisAdvisor.tsx` - Intelligent analysis recommendations

## 🔧 Setup Instructions

### 1. Environment Variables
Add to your `.env` file:

```bash
# Dify API Configuration
VITE_DIFY_BASE_URL=https://api.dify.ai/v1
VITE_DIFY_API_KEY=your-dify-api-key-here

# Optional: Keep existing LLM APIs as fallback
VITE_DASHSCOPE_API_KEY=your-dashscope-key
```

### 2. Required Dify Workflows

You need to create these workflows in your Dify workspace:

#### A. Data Generation Workflow ✅ ACTIVE
- **Purpose**: Generate statistical data from natural language prompts
- **Input**: `query` (string) - User's data generation request
- **Output**: `result` (string) - JSON formatted data array
- **Example**: "Generate 100 test scores" → `{"data": [75, 82, 68, ...], "description": "Test scores"}`

#### B. Analysis Advisor Workflow ✅ ACTIVE
- **Purpose**: Recommend appropriate statistical tests
- **Inputs**: 
  - `data_summary` (string) - JSON with basic stats
  - `user_goal` (string) - What user wants to analyze
  - `sample_size` (number) - Data size
- **Output**: `result` (string) - Analysis recommendation

#### C. Data Quality Checker Workflow ✅ ACTIVE
- **Purpose**: Assess data quality and suggest improvements
- **Inputs**:
  - `data` (string) - JSON array of sample data
  - `sample_size` (number) - Total data size
- **Output**: `result` (string) - Quality assessment

#### D. Distribution Detector Workflow ✅ ACTIVE
- **Purpose**: Identify likely probability distribution
- **Inputs**:
  - `data_stats` (string) - JSON with descriptive statistics
  - `sample_data` (paragraph) - Complete dataset
- **Output**: `result` (string) - Distribution analysis

#### ~~E. Results Interpreter Workflow~~ ❌ REMOVED
- **Status**: Removed to free up workflow slot for advanced features
- **Reason**: Not actively used in current UI, can be re-added later if needed

## 🔄 Migration Steps

### Step 1: Update Imports
Replace existing LLM imports with Dify imports:

```typescript
// OLD
import { callLLMAPI } from '../utils/llmApi';

// NEW  
import { difyAPI } from '../utils/difyApi';
```

### Step 2: Update Components
Replace `AIDataGenerator` with `DifyEnhancedDataGenerator`:

```typescript
// In App.tsx or parent component
import { DifyEnhancedDataGenerator } from './components/DifyEnhancedDataGenerator';

// Replace the existing AIDataGenerator usage
{inputMethod === 'ai' && (
  <DifyEnhancedDataGenerator
    onDatasetAdded={handleDatasetAdded}
    onBack={() => setInputMethod(null)}
  />
)}
```

### Step 3: Add Smart Analysis Advisor
Integrate the analysis advisor into your analysis components:

```typescript
import { SmartAnalysisAdvisor } from './components/SmartAnalysisAdvisor';

// Add to your analysis interface
<SmartAnalysisAdvisor
  data={currentData}
  currentAnalysis="I want to compare two groups"
  onRecommendationSelect={(rec) => console.log('Recommended:', rec)}
/>
```

## 🎯 Enhanced Features

### 1. Smart Data Generation
- **Context-aware**: Understands statistical context better than generic LLMs
- **Educational focus**: Generates data suitable for learning
- **Automatic recommendations**: Suggests appropriate analysis methods

### 2. Intelligent Analysis Advisor
- **Data quality assessment**: Checks for issues before analysis
- **Method recommendation**: Suggests best statistical tests
- **Confidence scoring**: Indicates reliability of recommendations

### 3. Educational Tutor Integration
```typescript
// Get tutorial explanations
const tutorial = await difyAPI.getTutorialExplanation(
  'central limit theorem',
  currentData
);
```

### 4. Results Interpretation
```typescript
// Explain statistical results
const explanation = await difyAPI.interpretResults(
  't-test',
  { pValue: 0.03, tStatistic: 2.45 },
  'undergraduate'
);
```

## 🧪 Testing Integration

### 1. Test Data Generation
```typescript
const testResult = await difyAPI.generateStatisticalData(
  "Generate 50 test scores with mean 75"
);
console.log('Generated:', testResult);
```

### 2. Test Analysis Recommendation
```typescript
const recommendation = await difyAPI.getAnalysisRecommendation(
  [75, 82, 68, 90, 77],
  "Compare student performance"
);
console.log('Recommendation:', recommendation);
```

## 🔍 Workflow Configuration Examples

### Data Generation Workflow Prompt:
```
You are a statistical data generator. Generate realistic data based on user requests.

User Request: {{query}}
Data Type: {{data_type}}
Output Format: {{format}}

Generate appropriate statistical data and return as JSON:
{
  "data": [numerical array],
  "description": "brief description",
  "distribution": "detected distribution type"
}
```

### Analysis Advisor Workflow Prompt:
```
You are a statistical analysis advisor for students.

Data Summary: {{data_summary}}
User Goal: {{user_goal}}
Sample Size: {{sample_size}}

Recommend the most appropriate statistical test and return as JSON:
{
  "recommendedTest": "test name",
  "reasoning": "why this test",
  "confidence": "high/medium/low",
  "prerequisites": ["assumption 1", "assumption 2"],
  "interpretation": "how to read results"
}
```

## 🚀 Deployment Notes

### Development
```bash
npm run dev
# Dify API calls will use local proxy configuration
```

### Production
Update your deployment environment variables:
- Set `VITE_DIFY_API_KEY` in Vercel/Netlify
- Ensure CORS is configured for your domain in Dify

## 📈 Benefits of Integration

1. **Smarter Data Generation**: Context-aware, educationally appropriate
2. **Guided Analysis**: AI recommends best statistical methods
3. **Educational Enhancement**: Plain language explanations
4. **Quality Assurance**: Automatic data quality checking
5. **Scalable Architecture**: Easy to add new AI capabilities

## 🔧 Troubleshooting

### Common Issues:
1. **API Key not working**: Check Dify workspace settings
2. **Workflow not found**: Verify workflow IDs in difyApi.ts
3. **CORS errors**: Configure allowed origins in Dify
4. **Timeout errors**: Increase timeout for complex workflows

### Debug Mode:
```typescript
// Enable detailed logging
const difyAPI = new DifyStatisticalAPI(baseUrl, apiKey);
// Check browser console for detailed API responses
```

## 🎯 Next Steps

1. **Create the required workflows** in your Dify workspace
2. **Update workflow IDs** in `difyApi.ts`
3. **Test each component** individually
4. **Deploy and monitor** API usage
5. **Iterate and improve** based on user feedback

Your statistical webapp is now powered by intelligent Dify workflows! 🚀
