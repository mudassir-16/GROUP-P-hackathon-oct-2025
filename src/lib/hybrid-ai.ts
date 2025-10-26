import { OpenIdeaXAI } from './openai';
import { DeepSeekAI } from './deepseek-ai';
import { MockAI } from './mock-ai';
import { Problem, Solution, Roadmap, ImpactScore, AIPersona } from '@/types';

export class HybridAI {
  private static instance: HybridAI;
  private geminiAI?: OpenIdeaXAI;
  private deepseekAI?: DeepSeekAI;
  private mockAI: MockAI;
  private useMock: boolean;

  private constructor() {
    this.mockAI = MockAI.getInstance();
    
    // Check if we have valid API keys for both DeepSeek and Gemini
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    const forceMockAI = process.env.USE_MOCK_AI === 'true';
    
    // Use Mock AI only if explicitly requested or if no valid API keys
    this.useMock = forceMockAI || 
                   !geminiApiKey || geminiApiKey === 'AIzaSyAW_7dVCb7tGx74-lG4ckULytwzOymPdQE' ||
                   !deepseekApiKey || deepseekApiKey === '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';
    
    // Only initialize real AI services if not using mock
    if (!this.useMock) {
      try {
        this.geminiAI = OpenIdeaXAI.getInstance();
        this.deepseekAI = DeepSeekAI.getInstance();
      } catch (error) {
        console.warn('Failed to initialize AI services, falling back to Mock AI:', error);
        this.useMock = true;
      }
    }
  }

  public static getInstance(): HybridAI {
    if (!HybridAI.instance) {
      HybridAI.instance = new HybridAI();
    }
    return HybridAI.instance;
  }

  async synthesizeProblem(challenge: string, context?: string): Promise<Problem> {
    if (this.useMock || !this.deepseekAI || !this.geminiAI) {
      console.log('Using Mock AI for demonstration');
      return await this.mockAI.synthesizeProblem(challenge, context);
    }
    
    try {
      // Try DeepSeek first, fallback to Gemini if DeepSeek fails
      return await this.deepseekAI.synthesizeProblem(challenge, context);
    } catch (error) {
      console.error('DeepSeek AI service failed, trying Gemini:', error);
      try {
        return await this.geminiAI.synthesizeProblem(challenge, context);
      } catch (geminiError) {
        console.error('Gemini AI service also failed, falling back to Mock AI:', geminiError);
        return await this.mockAI.synthesizeProblem(challenge, context);
      }
    }
  }

  async composeSolution(problem: Problem, constraints?: string[]): Promise<Solution> {
    if (this.useMock || !this.geminiAI) {
      return await this.mockAI.composeSolution(problem, constraints);
    }
    
    try {
      // Use Gemini for solution composition
      return await this.geminiAI.composeSolution(problem, constraints);
    } catch (error) {
      console.error('Gemini AI service failed, falling back to Mock AI:', error);
      return await this.mockAI.composeSolution(problem, constraints);
    }
  }

  async buildRoadmap(solution: Solution): Promise<Roadmap> {
    if (this.useMock || !this.deepseekAI) {
      return await this.mockAI.buildRoadmap(solution);
    }
    
    try {
      // Use DeepSeek for roadmap building
      return await this.deepseekAI.buildRoadmap(solution);
    } catch (error) {
      console.error('DeepSeek AI service failed, falling back to Mock AI:', error);
      return await this.mockAI.buildRoadmap(solution);
    }
  }

  async calculateImpactScore(problem: Problem, solution: Solution): Promise<ImpactScore> {
    if (this.useMock || !this.geminiAI) {
      return await this.mockAI.calculateImpactScore(problem, solution);
    }
    
    try {
      // Use Gemini for impact scoring
      return await this.geminiAI.calculateImpactScore(problem, solution);
    } catch (error) {
      console.error('Gemini AI service failed, falling back to Mock AI:', error);
      return await this.mockAI.calculateImpactScore(problem, solution);
    }
  }

  async getAIPersonas(): Promise<AIPersona[]> {
    if (this.useMock || !this.geminiAI) {
      return await this.mockAI.getAIPersonas();
    }
    
    try {
      return await this.geminiAI.getAIPersonas();
    } catch (error) {
      console.error('Gemini AI service failed, falling back to Mock AI:', error);
      return await this.mockAI.getAIPersonas();
    }
  }

  async generateVisualPrototype(solution: Solution): Promise<string> {
    if (this.useMock || !this.deepseekAI || !this.geminiAI) {
      return await this.mockAI.generateVisualPrototype(solution);
    }
    
    try {
      // Try DeepSeek first, fallback to Gemini if DeepSeek fails
      return await this.deepseekAI.generateVisualPrototype(solution);
    } catch (error) {
      console.error('DeepSeek AI service failed, trying Gemini:', error);
      try {
        return await this.geminiAI.generateVisualPrototype(solution);
      } catch (geminiError) {
        console.error('Gemini AI service also failed, falling back to Mock AI:', geminiError);
        return await this.mockAI.generateVisualPrototype(solution);
      }
    }
  }

  async generatePitchDeck(problem: Problem, solution: Solution, roadmap: Roadmap): Promise<string> {
    if (this.useMock || !this.geminiAI) {
      return await this.mockAI.generatePitchDeck(problem, solution, roadmap);
    }
    
    try {
      // Use Gemini for pitch decks
      return await this.geminiAI.generatePitchDeck(solution, problem, roadmap);
    } catch (error) {
      console.error('Gemini AI service failed, falling back to Mock AI:', error);
      return await this.mockAI.generatePitchDeck(problem, solution, roadmap);
    }
  }

  async generateChatResponse(message: string, persona?: AIPersona): Promise<string> {
    // Force MockAI usage if USE_MOCK_AI is true
    if (process.env.USE_MOCK_AI === 'true') {
      return await this.mockAI.generateChatResponse(message, persona?.name);
    }
    
    if (this.useMock || !this.geminiAI || !this.deepseekAI) {
      return await this.mockAI.generateChatResponse(message, persona?.name);
    }
    
    try {
      // Use Gemini for chat responses as requested
      return await this.geminiAI.generateChatResponse(message, persona?.name);
    } catch (error) {
      console.error('Gemini AI service failed, trying DeepSeek:', error);
      try {
        return await this.deepseekAI.generateChatResponse(message, persona?.name);
      } catch (deepseekError) {
        console.error('DeepSeek AI service also failed, falling back to Mock AI:', deepseekError);
        return await this.mockAI.generateChatResponse(message, persona?.name);
      }
    }
  }

  async synthesizeIdeas(messages: any[]): Promise<string> {
    if (this.useMock || !this.geminiAI) {
      return await this.mockAI.generateChatResponse(`Synthesize these ideas: ${messages.map(m => m.content).join(', ')}`);
    }
    
    try {
      const prompt = `Synthesize the key ideas and insights from this collaborative ideation session:

${messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n')}

Please provide:
1. Key themes and patterns
2. Most promising ideas
3. Potential challenges identified
4. Next steps for development
5. Potential challenges and solutions

Format as a structured synthesis report.`;

      return await this.geminiAI.generateChatResponse(prompt);
    } catch (error) {
      console.error('Gemini AI service failed, falling back to Mock AI:', error);
      return await this.mockAI.generateChatResponse(`Synthesize these ideas: ${messages.map(m => m.content).join(', ')}`);
    }
  }

}