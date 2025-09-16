# LLM API Setup Guide for China

This guide helps you set up LLM APIs that work well in China for the AI data generation feature.

## 🚀 Quick Setup

### 1. Create Environment File
Copy the example environment file:
```bash
cp env.example .env
```

### 2. Set Your API Key
Create a `.env` file in the project root and add your API key:
```env
VITE_DASHSCOPE_API_KEY=your-actual-api-key-here
```

**Important**: Vite requires the `VITE_` prefix for environment variables to be accessible in the browser. Even if your system environment variable is named `DASHSCOPE_API_KEY`, you need to set `VITE_DASHSCOPE_API_KEY` in the `.env` file.

### 3. Restart Development Server
```bash
npm run dev
```

## 🔑 Supported APIs

### 1. 阿里云DashScope (Alibaba Cloud DashScope) - Recommended
- **Website**: https://dashscope.console.aliyun.com/
- **Pros**: Reliable, good performance, integrated with Alibaba ecosystem
- **Setup**: 
  1. Register for Alibaba Cloud account
  2. Enable DashScope service
  3. Get API key from console
  4. Set `VITE_DASHSCOPE_API_KEY` in .env

### 2. 百度文心一言 (Baidu ERNIE)
- **Website**: https://cloud.baidu.com/product/wenxinworkshop
- **Pros**: Good Chinese language support, competitive pricing
- **Setup**:
  1. Register for Baidu Cloud account
  2. Enable ERNIE service
  3. Get API Key and Secret Key
  4. Set `VITE_BAIDU_API_KEY` and `VITE_BAIDU_SECRET_KEY` in .env

### 3. 智谱AI (Zhipu AI)
- **Website**: https://open.bigmodel.cn/
- **Pros**: Good performance, reasonable pricing
- **Setup**:
  1. Register for Zhipu AI account
  2. Get API key
  3. Set `VITE_ZHIPU_API_KEY` in .env

## 🛠️ Environment Variable Setup

### Option 1: Create .env file (Recommended)
```bash
# Copy the example file
cp env.example .env

# Edit .env and add your actual API key
VITE_DASHSCOPE_API_KEY=sk-0bce80a7fc184aea9aa906b2b5a75e47
```

### Option 2: Set Environment Variable
**Windows (PowerShell):**
```powershell
# Temporary (current session)
$env:VITE_DASHSCOPE_API_KEY = "sk-0bce80a7fc184aea9aa906b2b5a75e47"

# Permanent (user level)
[Environment]::SetEnvironmentVariable("VITE_DASHSCOPE_API_KEY", "sk-0bce80a7fc184aea9aa906b2b5a75e47", "User")
```

**Windows (Command Prompt):**
```cmd
setx VITE_DASHSCOPE_API_KEY "sk-0bce80a7fc184aea9aa906b2b5a75e47"
```

**macOS/Linux:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export VITE_DASHSCOPE_API_KEY="sk-0bce80a7fc184aea9aa906b2b5a75e47"
```

## 📝 Usage Tips

### 1. Better Prompts
Use specific prompts that ask for JSON format:
```
Generate 100 random numbers from a normal distribution with mean 170 and standard deviation 10. Return as a JSON array: [170.5, 165.2, 175.8, ...]
```

### 2. Fallback Behavior
If the LLM API fails, the system will:
- Try other available APIs
- Fall back to simulated data generation
- Show helpful error messages

### 3. API Priority
The system tries APIs in this order:
1. 阿里云DashScope (DashScope)
2. 智谱AI (Zhipu)
3. 百度文心一言 (Baidu)

## 🔧 Troubleshooting

### Common Issues

1. **"API key not found"**
   - Make sure you've set the environment variable correctly
   - Restart your development server after setting the variable
   - Check that the variable name starts with `VITE_`

2. **"API call failed"**
   - Check your internet connection
   - Verify your API key is valid
   - Check if you have sufficient API credits

3. **"Invalid response format"**
   - The AI response couldn't be parsed as data
   - Try using more specific prompts
   - Check the browser console for detailed error messages

### Getting Help
- Check the browser console for detailed error messages
- Try different example prompts
- Verify your API key is working in the provider's console

## 💡 Example Prompts

Here are some effective prompts for data generation:

```
Generate 50 random numbers from an exponential distribution with lambda=0.5. Return as JSON array.
```

```
Create 200 test scores with mean 75 and standard deviation 15. Return as JSON array.
```

```
Generate 30 sales data points between 1000 and 5000. Return as JSON array.
```

Remember to always ask for JSON format for best results!
