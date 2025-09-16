# Quick Reference Card - Statistical Webapp Setup

## Essential Commands

### 1. Project Setup
```bash
# Create project
npm create vite@latest statistical-webapp -- --template react-ts
cd statistical-webapp
npm install
```

### 2. Install Packages
```bash
# Install Tailwind CSS (use v3.4.0, NOT v4!)
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
npm install recharts lucide-react
npx tailwindcss init -p
```

### 3. Start Development
```bash
npm run dev
# Open http://localhost:5173/
```

## Common Issues & Quick Fixes

| Problem | Solution |
|---------|----------|
| PowerShell interactive prompts | Type `y`, select React, select TypeScript |
| Import errors | Restart dev server, clear browser cache |
| Tailwind not working | Use v3.4.0, check config file |
| Port already in use | `npm run dev -- --port 3000` |
| Module not found | Check file paths, verify exports |

## File Structure
```
statistical-webapp/
├── src/
│   ├── App.tsx          # Main application
│   ├── index.css        # Tailwind imports
│   └── main.tsx         # Entry point
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Dependencies
```

## Key Configuration Files

### tailwind.config.js
```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { primary: { 500: '#3b82f6' } } } },
  plugins: [],
}
```

### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Deployment Commands
```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

## Testing Checklist
- [ ] Development server starts without errors
- [ ] Browser loads at http://localhost:5173/
- [ ] Distribution selector works
- [ ] Parameter sliders update values
- [ ] "Generate Data" button creates data
- [ ] Statistics display correctly
- [ ] No console errors in browser

## Emergency Contacts
- **Office Hours**: Check course schedule
- **TAs**: Available during posted hours
- **Online**: Tencent Meeting 748-5967-3028

---
*Keep this reference handy during development!*

