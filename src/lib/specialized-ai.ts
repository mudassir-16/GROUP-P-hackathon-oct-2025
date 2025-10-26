import { HybridAI } from './hybrid-ai';

export interface SpecializedAIModels {
  ideaRefinement: string;
  solutionBlueprint: string;
  summarization: string;
  semanticLinking: string;
  impactEvaluation: string;
  conversationalAI: string;
}

export class SpecializedAI {
  private static instance: SpecializedAI;
  private hybridAI: HybridAI;

  private constructor() {
    this.hybridAI = HybridAI.getInstance();
  }

  public static getInstance(): SpecializedAI {
    if (!SpecializedAI.instance) {
      SpecializedAI.instance = new SpecializedAI();
    }
    return SpecializedAI.instance;
  }

  async refineIdea(idea: string, context?: string): Promise<string> {
    try {
      const prompt = `Refine and expand this idea: "${idea}"
      
      ${context ? `Context: ${context}` : ''}
      
      Please provide:
      1. Enhanced version of the idea
      2. Key components and features
      3. Potential applications
      4. Implementation considerations
      5. Next steps for development
      
      Format as a structured response.`;
      
      return await this.hybridAI.generateChatResponse(prompt);
    } catch (error) {
      console.error('Error refining idea:', error);
      return 'Unable to refine idea at this time.';
    }
  }

  async generateBlueprint(problem: string, solution: string): Promise<string> {
    try {
      const prompt = `Create a detailed solution blueprint for:
      
      Problem: ${problem}
      Solution: ${solution}
      
      Please provide:
      1. Technical architecture
      2. Implementation phases
      3. Required resources
      4. Timeline and milestones
      5. Risk assessment
      6. Success metrics
      
      Format as a comprehensive blueprint.`;
      
      return await this.hybridAI.generateChatResponse(prompt);
    } catch (error) {
      console.error('Error generating blueprint:', error);
      return 'Unable to generate blueprint at this time.';
    }
  }

  async summarizeBlueprint(blueprint: string): Promise<string> {
    try {
      const prompt = `Summarize this solution blueprint into key points:
      
      ${blueprint}
      
      Please provide:
      1. Executive summary
      2. Key components
      3. Implementation timeline
      4. Expected outcomes
      5. Resource requirements
      
      Format as a concise summary.`;
      
      return await this.hybridAI.generateChatResponse(prompt);
    } catch (error) {
      console.error('Error summarizing blueprint:', error);
      return 'Unable to summarize blueprint at this time.';
    }
  }

  async linkToSDGs(description: string): Promise<string> {
    try {
      const prompt = `Analyze this description and identify relevant UN Sustainable Development Goals (SDGs):
      
      ${description}
      
      Please provide:
      1. Primary SDG alignment (1-17)
      2. Secondary SDG connections
      3. Impact potential for each SDG
      4. Measurement indicators
      5. Global relevance
      
      Format as a structured SDG analysis.`;
      
      return await this.hybridAI.generateChatResponse(prompt);
    } catch (error) {
      console.error('Error linking to SDGs:', error);
      return 'Unable to analyze SDG alignment at this time.';
    }
  }

  async evaluateImpact(description: string): Promise<string> {
    try {
      const prompt = `Evaluate the potential impact of this solution:
      
      ${description}
      
      Please provide:
      1. Social impact assessment
      2. Economic impact potential
      3. Environmental benefits
      4. Scalability analysis
      5. Risk factors
      6. Success probability
      
      Format as a comprehensive impact evaluation.`;
      
      return await this.hybridAI.generateChatResponse(prompt);
    } catch (error) {
      console.error('Error evaluating impact:', error);
      return 'Unable to evaluate impact at this time.';
    }
  }

  async converse(message: string, context?: string): Promise<string> {
    try {
      const prompt = `You are an AI innovation assistant. Respond to this message: "${message}"
      
      ${context ? `Context: ${context}` : ''}
      
      Provide helpful insights, ask clarifying questions, or suggest next steps for the innovation process.`;
      
      return await this.hybridAI.generateChatResponse(prompt);
    } catch (error) {
      console.error('Error in conversation:', error);
      return 'I need more information to provide a helpful response.';
    }
  }
}