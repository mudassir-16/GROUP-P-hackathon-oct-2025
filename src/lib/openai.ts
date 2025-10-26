import { GoogleGenerativeAI } from '@google/generative-ai';
import { Problem, Solution, Roadmap, ImpactScore, AIPersona } from '@/types';

// Use Gemini API
const getApiKey = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (apiKey && apiKey !== 'your-gemini-api-key-here' && apiKey.length > 20) {
    return apiKey;
  }
  
  console.warn('No valid Gemini API key found. Please set GEMINI_API_KEY environment variable.');
  return 'your-gemini-api-key-here';
};

export class OpenIdeaXAI {
  private static instance: OpenIdeaXAI;
  private genAI: GoogleGenerativeAI;
  
  public static getInstance(): OpenIdeaXAI {
    if (!OpenIdeaXAI.instance) {
      OpenIdeaXAI.instance = new OpenIdeaXAI();
    }
    return OpenIdeaXAI.instance;
  }

  private constructor() {
    const apiKey = getApiKey();
    
    // If API key looks like a placeholder, throw error to trigger fallback
    if (apiKey === 'your-gemini-api-key-here') {
      throw new Error('Invalid API key format - using Mock AI instead');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private async generateWithTimeout(prompt: string, timeoutMs: number = 10000): Promise<string> {
    const model = this.genAI.getGenerativeModel({ 
      model: "gemini-pro-latest",
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      }
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('API call timeout')), timeoutMs);
    });

    const apiPromise = model.generateContent(prompt).then(async (result) => {
      const response = await result.response;
      return response.text();
    });

    return Promise.race([apiPromise, timeoutPromise]);
  }

  async synthesizeProblem(challenge: string, context?: string): Promise<Problem> {
    const prompt = `Analyze: "${challenge}" ${context ? `Context: ${context}` : ''}

Create JSON: {title, description, category, sdgGoals: [1-17], complexity: "low|medium|high"}`;

    try {
      const text = await this.generateWithTimeout(prompt, 8000);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : '{}';
      const parsed = JSON.parse(jsonString);
      
      return {
        id: `prob_${Date.now()}`,
        title: parsed.title || `Problem: ${challenge.substring(0, 50)}...`,
        description: parsed.description || `Analysis of: ${challenge}`,
        category: parsed.category || 'Innovation',
        sdgGoals: parsed.sdgGoals || [1, 2, 3],
        complexity: parsed.complexity || 'medium',
        createdAt: new Date(),
      };
    } catch (e) {
      console.error("Failed to parse problem synthesis response:", e);
      throw new Error("Failed to parse problem synthesis response from AI.");
    }
  }

  async composeSolution(problem: Problem, constraints?: string[]): Promise<Solution> {
    const prompt = `Problem: "${problem.title}" - ${problem.description}
Category: ${problem.category}, SDG: ${problem.sdgGoals.join(',')}, Complexity: ${problem.complexity}
${constraints && constraints.length > 0 ? `Constraints: ${constraints.join(', ')}` : ''}

Create solution JSON: {title, description, approach, techStack: [], implementation, timeline, resources: [], stakeholders: [], kpis: [], impactScore: 1-10, feasibilityScore: 1-10, sustainabilityScore: 1-10, sdgAlignment: []}`;

    try {
      const text = await this.generateWithTimeout(prompt, 10000);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : '{}';
      const parsed = JSON.parse(jsonString);
      
      return {
        id: `sol_${Date.now()}`,
        problemId: problem.id,
        title: parsed.title || `Solution for ${problem.title}`,
        description: parsed.description || `A comprehensive solution addressing ${problem.title}`,
        approach: parsed.approach || 'Multi-faceted approach combining technology and innovation',
        techStack: parsed.techStack || ['AI/ML', 'Cloud Computing', 'Mobile Apps'],
        implementation: parsed.implementation || 'Phased implementation with pilot programs',
        timeline: parsed.timeline || '12-18 months',
        resources: parsed.resources || ['Development Team', 'Technology Infrastructure', 'Funding'],
        stakeholders: parsed.stakeholders || ['End Users', 'Government', 'NGOs'],
        kpis: parsed.kpis || ['User Adoption', 'Impact Metrics', 'ROI'],
        impactScore: parsed.impactScore || 8.5,
        feasibilityScore: parsed.feasibilityScore || 7.8,
        sustainabilityScore: parsed.sustainabilityScore || 9.2,
        sdgAlignment: parsed.sdgAlignment || [1, 2, 3, 4, 5],
        createdAt: new Date(),
      };
    } catch (e) {
      console.error("Failed to parse solution composition response:", e);
      throw new Error("Failed to parse solution composition response from AI.");
    }
  }

  async buildRoadmap(solution: Solution): Promise<Roadmap> {
    const prompt = `Solution: "${solution.title}" - ${solution.description}

Create roadmap JSON: {phases: [{name, description, duration, deliverables: [], dependencies: [], resources: []}], totalDuration, milestones: [{name, description, targetDate, successCriteria: [], dependencies: []}], dependencies: [], risks: [{description, probability: "low|medium|high", impact: "low|medium|high", mitigation}]}`;

    try {
      const text = await this.generateWithTimeout(prompt, 8000);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : '{}';
      const parsed = JSON.parse(jsonString);
      
      return {
        id: `roadmap_${Date.now()}`,
        solutionId: solution.id,
        phases: parsed.phases?.map((p: any, index: number) => ({ 
          ...p, 
          id: `phase_${Date.now()}_${index}` 
        })) || [
          {
            id: 'phase_1',
            name: 'Research & Planning',
            description: 'Initial research and planning phase',
            duration: '3 months',
            deliverables: ['Research Report', 'Technical Specifications'],
            dependencies: [],
            resources: ['Research Team', 'Analysts']
          }
        ],
        totalDuration: parsed.totalDuration || '18 months',
        milestones: parsed.milestones?.map((m: any, index: number) => ({ 
          ...m, 
          id: `milestone_${Date.now()}_${index}`,
          targetDate: m.dueDate || m.date || 'TBD',
          successCriteria: m.successCriteria || ['Milestone achieved'],
          dependencies: m.dependencies || []
        })) || [
          { id: 'milestone_1', name: 'Research Complete', targetDate: '3 months', successCriteria: ['Research completed'], dependencies: [] }
        ],
        dependencies: parsed.dependencies || [],
        risks: parsed.risks?.map((r: any, index: number) => ({ 
          ...r, 
          id: `risk_${Date.now()}_${index}`,
          description: r.description || r.name || 'Unknown risk',
          probability: r.probability || 'medium',
          impact: r.impact || 'medium',
          mitigation: r.mitigation || 'To be determined'
        })) || [
          { id: 'risk_1', description: 'Technical Challenges', probability: 'medium', impact: 'high', mitigation: 'Expert consultation' }
        ],
        createdAt: new Date(),
      };
    } catch (e) {
      console.error("Failed to parse roadmap generation response:", e);
      throw new Error("Failed to parse roadmap generation response from AI.");
    }
  }

  async calculateImpactScore(problem: Problem, solution: Solution): Promise<ImpactScore> {
    const prompt = `Problem: "${problem.title}" Solution: "${solution.title}"

Calculate impact JSON: {relevance: 1-10, feasibility: 1-10, impact: 1-10, sustainability: 1-10, innovation: 1-10, collaboration: 1-10}`;

    try {
      const text = await this.generateWithTimeout(prompt, 6000);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : '{}';
      const parsed = JSON.parse(jsonString);
      
      return {
        relevance: parsed.relevance || 8.5,
        feasibility: parsed.feasibility || 7.8,
        impact: parsed.impact || 8.5,
        sustainability: parsed.sustainability || 8.5,
        innovation: parsed.innovation || 9.2,
        collaboration: parsed.collaboration || 8.0,
      };
    } catch (e) {
      console.error("Failed to parse impact score response:", e);
      throw new Error("Failed to parse impact score response from AI.");
    }
  }

  async getAIPersonas(): Promise<AIPersona[]> {
    return [
      { 
        id: '1', 
        name: 'Dr. Innovate', 
        role: 'Innovation Specialist',
        expertise: ['Disruptive Technologies', 'Emerging Trends', 'Creative Problem Solving'],
        perspective: 'Focuses on groundbreaking ideas and disruptive technologies.'
      },
      { 
        id: '2', 
        name: 'Prof. Pragmatic', 
        role: 'Implementation Expert',
        expertise: ['Project Management', 'Resource Optimization', 'Practical Solutions'],
        perspective: 'Emphasizes practical implementation and resource optimization.'
      },
      { 
        id: '3', 
        name: 'Eco-Warrior', 
        role: 'Sustainability Advocate',
        expertise: ['Environmental Science', 'Social Impact', 'Green Technologies'],
        perspective: 'Prioritizes environmental sustainability and social impact.'
      },
    ];
  }

  async generateVisualPrototype(solution: Solution): Promise<string> {
    const prompt = `Create UI/UX description for: "${solution.title}" - ${solution.description}`;

    try {
      return await this.generateWithTimeout(prompt, 5000);
    } catch (e) {
      console.error("Failed to generate visual prototype:", e);
      return 'Visual prototype generation failed.';
    }
  }

  async generatePitchDeck(solution: Solution, problem: Problem, roadmap: Roadmap): Promise<string> {
    const prompt = `Create pitch deck for: "${solution.title}"
Problem: ${problem.title}
Timeline: ${roadmap.totalDuration}
Create slides: Problem, Solution, Architecture, Impact, Roadmap`;

    try {
      return await this.generateWithTimeout(prompt, 6000);
    } catch (e) {
      console.error("Failed to generate pitch deck:", e);
      return 'Pitch deck generation failed.';
    }
  }

  async generateChatResponse(message: string, persona?: string): Promise<string> {
    // Remove AI trigger prefixes
    const cleanMessage = message.replace(/^(hey ai|@ai|\/ai)\s*/i, '').trim();
    
    const prompt = persona
      ? `You are ${persona}, an expert innovation facilitator. A user asked: "${cleanMessage}"

Please provide a helpful, detailed, and relevant response that:
- Directly addresses their question
- Provides specific insights and actionable advice
- Uses examples when appropriate
- Asks follow-up questions to help them further
- Maintains a professional yet friendly tone

Do not give generic responses like "I need more information". Instead, provide valuable insights based on your expertise.`
      : `You are an AI innovation facilitator and expert consultant. A user asked: "${cleanMessage}"

Please provide a helpful, detailed, and relevant response that:
- Directly addresses their question with specific insights
- Provides actionable advice and practical suggestions
- Uses relevant examples and case studies when appropriate
- Asks thoughtful follow-up questions to help them explore further
- Maintains a professional yet approachable tone
- Focuses on innovation, problem-solving, and social impact

Do not give generic responses like "I need more information". Instead, leverage your knowledge to provide valuable, specific insights that help the user.`;

    try {
      return await this.generateWithTimeout(prompt, 4000);
    } catch (e) {
      console.error("Failed to generate chat response:", e);
      return 'I apologize, but I encountered an issue generating a response. Could you please rephrase your question or provide more specific details about what you\'d like to know?';
    }
  }
}