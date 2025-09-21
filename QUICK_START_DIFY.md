# 🚀 Quick Start Guide - Dify Integration

Your statistical webapp is now ready to use Dify AI workflows! Follow these steps to get it running.

## ✅ **What's Already Done:**

✅ **5 Dify workflows created** with IDs configured  
✅ **Webapp code updated** with Dify API integration  
✅ **New AI-powered components** ready to use  
✅ **Test utilities** for verification  

## 🔧 **Setup Steps:**

### **Step 1: Get Your Dify API Key**
1. **Go to your Dify workspace**
2. **Click on your profile/settings**
3. **Find "API Keys" or "访问密钥"**
4. **Create a new API key**
5. **Copy the key** (starts with `app-` usually)

### **Step 2: Configure Environment**
1. **Copy the environment file:**
   ```bash
   cd statistical-webapp
   cp env.example .env
   ```

2. **Edit `.env` file and add your API key:**
   ```bash
   VITE_DIFY_API_KEY=your-actual-dify-api-key-here
   ```

### **Step 3: Install Dependencies & Start**
```bash
cd statistical-webapp
npm install
npm run dev
```

### **Step 4: Test Integration**
1. **Open browser console** (F12)
2. **Run test command:**
   ```javascript
   testDify()
   ```
3. **Check for successful responses** from all 5 workflows

## 🎯 **Your Workflow IDs:**

- **Data Generator**: `a5d947f1-c858-4daa-a348-2b628543f1a6`
- **Analysis Advisor**: `474746c2-5562-4eda-bab4-638db738d69a`  
- **Results Interpreter**: `bb243e09-f6ce-4e85-9c2c-f0d737d9b9fe`
- **Data Quality**: `7756b560-3f81-4fea-a786-3dbd29bee25c`
- **Distribution Detector**: `cc525721-3818-49b6-b1ff-2b0bbdb57772`

## 🧪 **Testing Your Workflows:**

### **Individual Tests:**
```javascript
// Test data generation
testSingleWorkflow('data-generation')

// Test analysis recommendations  
testSingleWorkflow('analysis-advisor')

// Test data quality checking
testSingleWorkflow('data-quality')
```

### **Full Integration Test:**
```javascript
testDify() // Tests all workflows
```

## 🎨 **New Features Available:**

### **1. Enhanced AI Data Generator**
- **Smart example prompts** by category
- **Real-time analysis recommendations**
- **Educational context awareness**

### **2. Smart Analysis Advisor**
- **Automatic data quality assessment**
- **Statistical test recommendations**
- **Confidence scoring**

### **3. Intelligent Results Interpretation**
- **Plain language explanations**
- **Educational context**
- **Student-level appropriate responses**

## 🔧 **Troubleshooting:**

### **Common Issues:**

1. **"API Key not found" error**
   - ✅ Check `.env` file exists
   - ✅ Verify API key format
   - ✅ Restart dev server after adding key

2. **"Workflow not found" error**
   - ✅ Verify workflow IDs in Dify dashboard
   - ✅ Check workflows are published
   - ✅ Ensure workflows have END nodes

3. **CORS errors**
   - ✅ Check Dify workspace CORS settings
   - ✅ Add `localhost:5173` to allowed origins

### **Debug Mode:**
```javascript
// Enable detailed logging
localStorage.setItem('debug', 'dify:*')
// Reload page and check console
```

## 🎉 **You're Ready!**

Your statistical webapp now has **AI superpowers**! 

**Try these features:**
1. **Generate data** with natural language
2. **Get smart analysis recommendations**
3. **Interpret results** in plain language
4. **Check data quality** automatically

## 🚀 **Next Steps:**

1. **Test all workflows** work correctly
2. **Customize prompts** in your Dify workflows
3. **Add more educational features**
4. **Deploy to production** with environment variables

**Happy analyzing!** 📊✨
