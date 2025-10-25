// API Configuration for OpenIdeaX
export const API_CONFIG = {
  // Gemini Configuration
  GEMINI: {
    API_KEY: process.env.GEMINI_API_KEY || 'AIzaSyA6zy6EpfxxbFX2BNELCd37amzDXG8xyUE',
    MODEL: 'gemini-1.5-pro',
    MAX_TOKENS: 2048,
    TEMPERATURE: 0.7,
    TOP_K: 40,
    TOP_P: 0.95,
  },

  // SDG API Configuration
  SDG: {
    API_URL: process.env.SDG_API_URL || 'https://unstats.un.org/SDGAPI/v1/sdg',
    API_KEY: process.env.SDG_API_KEY || '',
  },

  // Notion Integration
  NOTION: {
    API_KEY: process.env.NOTION_API_KEY || '',
    DATABASE_ID: process.env.NOTION_DATABASE_ID || '',
    API_URL: 'https://api.notion.com/v1',
  },

  // GitHub Integration
  GITHUB: {
    TOKEN: process.env.GITHUB_TOKEN || '',
    REPO_OWNER: process.env.GITHUB_REPO_OWNER || '',
    REPO_NAME: process.env.GITHUB_REPO_NAME || 'openideax-blueprints',
    API_URL: 'https://api.github.com',
  },

  // Application Configuration
  APP: {
    URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
}

// SDG Goals Configuration
export const SDG_GOALS = [
  { id: 1, title: "No Poverty", color: "#E5243B" },
  { id: 2, title: "Zero Hunger", color: "#DDA63A" },
  { id: 3, title: "Good Health and Well-being", color: "#4C9F38" },
  { id: 4, title: "Quality Education", color: "#C5192D" },
  { id: 5, title: "Gender Equality", color: "#FF3A21" },
  { id: 6, title: "Clean Water and Sanitation", color: "#26BDE2" },
  { id: 7, title: "Affordable and Clean Energy", color: "#FCC30B" },
  { id: 8, title: "Decent Work and Economic Growth", color: "#A21942" },
  { id: 9, title: "Industry, Innovation and Infrastructure", color: "#FD6925" },
  { id: 10, title: "Reduced Inequalities", color: "#DD1367" },
  { id: 11, title: "Sustainable Cities and Communities", color: "#FD9D24" },
  { id: 12, title: "Responsible Consumption and Production", color: "#BF8B2E" },
  { id: 13, title: "Climate Action", color: "#3F7E44" },
  { id: 14, title: "Life Below Water", color: "#0A97D9" },
  { id: 15, title: "Life on Land", color: "#56C02B" },
  { id: 16, title: "Peace, Justice and Strong Institutions", color: "#00689D" },
  { id: 17, title: "Partnerships for the Goals", color: "#19486A" },
]

// Impact Metrics Configuration
export const IMPACT_METRICS = {
  SOCIAL: {
    name: "Social Impact",
    weight: 0.3,
    indicators: ["People Reached", "Lives Improved", "Community Engagement"],
  },
  ENVIRONMENTAL: {
    name: "Environmental Impact", 
    weight: 0.25,
    indicators: ["Carbon Reduction", "Resource Efficiency", "Biodiversity"],
  },
  ECONOMIC: {
    name: "Economic Impact",
    weight: 0.25,
    indicators: ["Jobs Created", "Economic Growth", "Cost Savings"],
  },
  INNOVATION: {
    name: "Innovation Score",
    weight: 0.2,
    indicators: ["Technology Advancement", "Scalability", "Uniqueness"],
  },
}
