# Statistical Data Analysis Webapp

A comprehensive web application for statistical data analysis, built with React, TypeScript, and Tailwind CSS. This webapp supports multiple data input methods and provides both basic statistics and advanced parameter estimation (MLE/MoM).

## Features

### Multi-Modal Data Input
- **File Upload**: Upload CSV/Excel files with automatic column detection
- **Distribution Generation**: Generate synthetic data from probability distributions
- **AI-Generated Data**: Create data using natural language prompts via LLM APIs

### Analysis Methods
- **Basic Statistics**: Descriptive statistics, data visualization, and summary reports
- **MLE/MoM**: Maximum Likelihood Estimation and Method of Moments parameter estimation
- **Tab-based Interface**: Clean, organized analysis workflow

### Supported Distributions
- Normal, Exponential, Binomial, Poisson
- Uniform, Chi-square, t-distribution, F-distribution, Gamma

## Live Demo

🌐 **[View Live Webapp](https://yourusername.github.io/statistical-webapp/)**

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/statistical-webapp.git
cd statistical-webapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Environment Setup (Optional)

For AI data generation features, create a `.env` file:
```
VITE_DASHSCOPE_API_KEY=your-api-key-here
```

## Usage

1. **Choose Data Input Method**: Upload files, generate distributions, or use AI
2. **Select Analysis Type**: Basic Statistics or MLE/MoM
3. **Configure Parameters**: Adjust distribution parameters or select columns
4. **View Results**: Interactive charts and statistical summaries

## Educational Context

This webapp was developed for STA2002: Probability and Statistics II, designed to help students:
- Understand statistical concepts through interactive visualization
- Compare different parameter estimation methods
- Learn through hands-on data analysis
- Prepare for advanced statistical methods (confidence intervals, ANOVA, regression)

## Contributing

This is an educational project. Feel free to:
- Report issues
- Suggest new features
- Add new statistical methods
- Improve the user interface

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with modern web technologies
- Designed for educational purposes
- Supports multiple LLM APIs for data generation
- Extensible architecture for future statistical methods