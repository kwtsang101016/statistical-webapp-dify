// Deployment configuration for different environments
// Handles API availability across GitHub Pages, Vercel, local development

export const DEPLOYMENT_CONFIG = {
  // Detect environment
  isGitHubPages: window.location.hostname.includes('github.io'),
  isVercel: window.location.hostname.includes('vercel.app'),
  isLocal: window.location.hostname === 'localhost',
  
  // API availability by environment
  isDifyAvailable: () => {
    // Dify APIs work on most platforms, but check for specific restrictions
    const hostname = window.location.hostname;
    
    // Known working environments
    if (hostname === 'localhost') return true;
    if (hostname.includes('vercel.app')) return true;
    if (hostname.includes('netlify.app')) return true;
    
    // GitHub Pages - test at runtime
    if (hostname.includes('github.io')) {
      // Return true but with fallback handling
      return true;
    }
    
    return true; // Default to available
  },
  
  // Fallback behavior when APIs are blocked
  useFallback: () => {
    return !DEPLOYMENT_CONFIG.isDifyAvailable();
  }
};

// API configuration based on environment
export const getAPIConfig = () => {
  if (DEPLOYMENT_CONFIG.isDifyAvailable()) {
    return {
      useDify: true,
      baseUrl: 'https://api.dify.ai/v1',
      fallbackMessage: null
    };
  } else {
    return {
      useDify: false,
      baseUrl: null,
      fallbackMessage: 'AI features are not available on this deployment. For full AI capabilities, visit the local or Vercel deployment.'
    };
  }
};

// Helper to show deployment info to users
export const getDeploymentInfo = () => {
  const config = getAPIConfig();
  
  return {
    environment: DEPLOYMENT_CONFIG.isLocal ? 'Local Development' :
                DEPLOYMENT_CONFIG.isVercel ? 'Vercel Production' :
                DEPLOYMENT_CONFIG.isGitHubPages ? 'GitHub Pages' : 'Unknown',
    aiAvailable: config.useDify,
    message: config.fallbackMessage,
    recommendations: DEPLOYMENT_CONFIG.isGitHubPages ? [
      'For full AI features, consider deploying to Vercel',
      'Local development has all AI capabilities',
      'Current deployment may have limited AI functionality'
    ] : []
  };
};

