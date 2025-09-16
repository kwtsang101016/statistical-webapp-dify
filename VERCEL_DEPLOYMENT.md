# Deploy to Vercel for AI API Support

## Why Vercel?

GitHub Pages only serves static files and cannot run server-side code or proxy API calls. Vercel provides serverless functions that can act as a proxy for the DashScope API, solving the CORS issue.

## Steps to Deploy:

### 1. Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with your GitHub account

### 2. Deploy Your Project
- Click "New Project" in Vercel dashboard
- Import your GitHub repository: `kwtsang101016/statistical-webapp`
- Vercel will automatically detect it's a React project

### 3. Set Environment Variables
- In your Vercel project dashboard, go to "Settings" → "Environment Variables"
- Add: `DASHSCOPE_API_KEY` = `sk-0bce80a7fc184aea9aa906b2b5a75e47`

### 4. Update API URL
- After deployment, Vercel will give you a URL like `https://statistical-webapp-xxx.vercel.app`
- Update the API URL in `src/utils/llmApi.ts` line 43:
  ```typescript
  : 'https://your-vercel-url.vercel.app/api/dashscope';
  ```

### 5. Redeploy
- Push changes to GitHub
- Vercel will automatically redeploy

## Benefits:
- ✅ **Real AI API calls** work in production
- ✅ **No CORS issues** - serverless function handles proxy
- ✅ **Automatic deployments** from GitHub
- ✅ **Free hosting** for personal projects
- ✅ **Custom domain** support

## Alternative: Keep GitHub Pages
If you prefer to keep GitHub Pages, the current setup with simulated data works perfectly for educational purposes!
