# GitHub Pages Deployment Guide

This guide will help you deploy your statistical webapp to GitHub Pages so it's live online.

## Prerequisites

1. **GitHub Account**: Create one at https://github.com if you don't have one
2. **Git Installed**: Download from https://git-scm.com/download/win

## Step-by-Step Deployment

### Step 1: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the "+" icon in the top right → "New repository"
3. Fill in the details:
   - **Repository name**: `statistical-webapp` (or your preferred name)
   - **Description**: "Statistical Data Analysis Webapp for STA2002"
   - **Visibility**: Public (required for free GitHub Pages)
   - **Initialize**: Leave all checkboxes unchecked
4. Click "Create repository"

### Step 2: Initialize Git and Upload Code

Open PowerShell/Command Prompt in your project directory and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Statistical webapp with multi-modal data analysis"

# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/statistical-webapp.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section in the left sidebar
4. Under "Source", select "GitHub Actions"
5. Save the settings

### Step 4: Verify Deployment

1. Go to the "Actions" tab in your repository
2. You should see a workflow running called "Deploy to GitHub Pages"
3. Wait for it to complete (green checkmark)
4. Your webapp will be live at: `https://YOUR_USERNAME.github.io/statistical-webapp/`

## Troubleshooting

### Common Issues

1. **Git not found**: Install Git from https://git-scm.com/download/win
2. **Authentication error**: You may need to set up GitHub authentication
3. **Build fails**: Check the Actions tab for error details
4. **Page not loading**: Wait a few minutes for GitHub Pages to update

### GitHub Authentication Setup

If you get authentication errors:

1. **Option 1 - Personal Access Token**:
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token with "repo" permissions
   - Use token as password when pushing

2. **Option 2 - GitHub CLI**:
   ```bash
   # Install GitHub CLI
   winget install GitHub.cli
   
   # Authenticate
   gh auth login
   ```

### Manual Deployment (Alternative)

If GitHub Actions don't work:

1. Build your project locally:
   ```bash
   npm run build
   ```

2. Upload the `dist` folder contents to a branch called `gh-pages`
3. Enable GitHub Pages to use the `gh-pages` branch

## Updating Your Webapp

After making changes:

```bash
# Add changes
git add .

# Commit changes
git commit -m "Update: describe your changes"

# Push to GitHub
git push origin main
```

The GitHub Action will automatically rebuild and deploy your webapp.

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in your `public` folder with your domain
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use your custom domain

## Success!

Once deployed, your webapp will be accessible at:
`https://YOUR_USERNAME.github.io/statistical-webapp/`

Share this link with your classmates and instructors! 🎉
