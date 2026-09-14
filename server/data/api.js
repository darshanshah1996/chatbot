export default {
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    baseUrl: 'https://api.groq.com/openai/v1',
  },
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: 'https://openrouter.ai/api/v1',
  },
  ollama: {
    baseUrl: 'http://localhost:11434/api',
  },
  firecrawl: {
    apiKey: process.env.FIRECRAWL_API_KEY,
  },
};
