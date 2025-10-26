import { Problem, Solution, Roadmap, ImpactScore, AIPersona } from '@/types';

export class MockAI {
  private static instance: MockAI;

  public static getInstance(): MockAI {
    if (!MockAI.instance) {
      MockAI.instance = new MockAI();
    }
    return MockAI.instance;
  }

  async synthesizeProblem(challenge: string, context?: string): Promise<Problem> {
    return {
      id: `prob_${Date.now()}`,
      title: `AI-Generated Problem: ${challenge.substring(0, 50)}...`,
      description: `This is a comprehensive analysis of the challenge: "${challenge}". ${context ? `Context: ${context}` : ''} The problem requires innovative solutions to address global challenges and create positive impact.`,
      category: 'Innovation',
      sdgGoals: [1, 2, 3, 4, 5],
      complexity: 'medium',
      createdAt: new Date(),
    };
  }

  async composeSolution(problem: Problem, constraints?: string[]): Promise<Solution> {
    return {
      id: `sol_${Date.now()}`,
      problemId: problem.id,
      title: `AI-Generated Solution for ${problem.title}`,
      description: `A comprehensive solution that addresses the problem: ${problem.description}. This solution leverages cutting-edge technology and innovative approaches to create maximum impact.`,
      approach: 'Multi-faceted approach combining technology, community engagement, and sustainable practices',
      techStack: ['AI/ML', 'Cloud Computing', 'Mobile Apps', 'Web Platform'],
      implementation: 'Phased implementation starting with pilot programs and scaling globally',
      timeline: '12-18 months',
      resources: ['Development Team', 'Technology Infrastructure', 'Community Partners', 'Funding'],
      stakeholders: ['End Users', 'Government', 'NGOs', 'Private Sector', 'Academic Institutions'],
      kpis: ['User Adoption', 'Impact Metrics', 'Sustainability Score', 'ROI'],
      impactScore: 8.5,
      feasibilityScore: 7.8,
      sustainabilityScore: 9.2,
      sdgAlignment: [1, 2, 3, 4, 5],
      createdAt: new Date(),
    };
  }

  async buildRoadmap(solution: Solution): Promise<Roadmap> {
    return {
      id: `roadmap_${Date.now()}`,
      solutionId: solution.id,
      phases: [
        {
          id: 'phase_1',
          name: 'Research & Planning',
          description: 'Initial research and planning phase',
          duration: '3 months',
          deliverables: ['Research Report', 'Technical Specifications', 'Team Assembly'],
          dependencies: [],
          resources: ['Research Team', 'Analysts', 'Domain Experts'],
          phase: '0-3 months',
          tasks: ['Research Report', 'Technical Specifications', 'Team Assembly']
        },
        {
          id: 'phase_2',
          name: 'Development',
          description: 'Core development and implementation',
          duration: '6 months',
          deliverables: ['MVP', 'Beta Version', 'User Testing'],
          dependencies: ['phase_1'],
          resources: ['Development Team', 'Designers', 'Testers'],
          phase: '3-9 months',
          tasks: ['MVP', 'Beta Version', 'User Testing']
        },
        {
          id: 'phase_3',
          name: 'Launch & Scale',
          description: 'Public launch and scaling',
          duration: '9 months',
          deliverables: ['Full Release', 'User Onboarding', 'Global Expansion'],
          dependencies: ['phase_2'],
          resources: ['Marketing Team', 'Support Team', 'Partnership Team'],
          phase: '9+ months',
          tasks: ['Full Release', 'User Onboarding', 'Global Expansion']
        }
      ],
      totalDuration: '18 months',
        milestones: [
          { 
            id: 'milestone_1', 
            name: 'Research Complete', 
            description: 'Complete initial research phase',
            targetDate: '3 months',
            successCriteria: ['Research report completed', 'Technical specifications defined'],
            dependencies: []
          },
          { 
            id: 'milestone_2', 
            name: 'MVP Ready', 
            description: 'Minimum viable product ready for testing',
            targetDate: '9 months',
            successCriteria: ['MVP developed', 'User testing completed'],
            dependencies: ['milestone_1']
          },
          { 
            id: 'milestone_3', 
            name: 'Full Launch', 
            description: 'Full product launch',
            targetDate: '18 months',
            successCriteria: ['Full product released', 'User adoption achieved'],
            dependencies: ['milestone_2']
          }
        ],
      dependencies: [],
      risks: [
        { 
          id: 'risk_1', 
          description: 'Technical Challenges', 
          probability: 'medium', 
          impact: 'high', 
          mitigation: 'Expert consultation and iterative development' 
        },
        { 
          id: 'risk_2', 
          description: 'Resource Constraints', 
          probability: 'low', 
          impact: 'medium', 
          mitigation: 'Phased approach and external partnerships' 
        }
      ],
      createdAt: new Date(),
    };
  }

  async calculateImpactScore(problem: Problem, solution: Solution): Promise<ImpactScore> {
    return {
      relevance: 8.5,
      feasibility: 7.8,
      impact: 9.0,
      sustainability: 8.8,
      innovation: 9.2,
      collaboration: 8.0,
    };
  }

  async getAIPersonas(): Promise<AIPersona[]> {
    return [
      {
        id: 'persona_1',
        name: 'Dr. Sarah Chen',
        role: 'Sustainability Expert',
        expertise: ['Environmental Science', 'Green Technology', 'Climate Solutions'],
        perspective: 'Analytical and environmentally conscious'
      },
      {
        id: 'persona_2',
        name: 'Marcus Johnson',
        role: 'Tech Innovation Lead',
        expertise: ['AI/ML', 'Emerging Technologies', 'Digital Transformation'],
        perspective: 'Creative and forward-thinking'
      },
      {
        id: 'persona_3',
        name: 'Dr. Aisha Patel',
        role: 'Social Impact Specialist',
        expertise: ['Community Development', 'Social Innovation', 'Inclusive Design'],
        perspective: 'Empathetic and community-focused'
      }
    ];
  }

  async generateVisualPrototype(solution: Solution): Promise<string> {
    return `Visual Prototype for ${solution.title}:

🎨 **User Interface Design**
- Clean, intuitive dashboard
- Mobile-responsive design
- Accessibility features
- Multi-language support

📱 **Key Screens**
1. Landing Page: Clear value proposition
2. Dashboard: Real-time metrics and insights
3. Collaboration Hub: Team communication tools
4. Impact Tracker: Progress visualization

🎯 **Design Principles**
- User-centered design
- Accessibility first
- Scalable architecture
- Brand consistency

This prototype demonstrates the user experience and visual design of the solution.`;
  }

  async generatePitchDeck(problem: Problem, solution: Solution, roadmap: Roadmap): Promise<string> {
    return `Pitch Deck for ${solution.title}:

📊 **Slide 1: Problem Statement**
- ${problem.description}
- Market opportunity: $${solution.impactScore * 10}M
- Target audience: Global

💡 **Slide 2: Solution Overview**
- ${solution.title}
- Key features and benefits
- Competitive advantages

🏗️ **Slide 3: Technical Architecture**
- ${solution.techStack.join(', ')}
- Scalable infrastructure
- Security and compliance

📈 **Slide 4: Impact & Metrics**
- Expected impact: ${solution.impactScore}/10
- Key performance indicators
- Success metrics

🗺️ **Slide 5: Implementation Roadmap**
- ${roadmap.totalDuration} timeline
- Key milestones
- Resource requirements

💰 **Slide 6: Financial Projections**
- Revenue model
- Cost structure
- ROI projections

This pitch deck provides a comprehensive overview for investors and stakeholders.`;
  }

  async generateChatResponse(message: string, persona?: string): Promise<string> {
    // Remove AI trigger prefixes
    const cleanMessage = message.replace(/^(hey ai|@ai|\/ai)\s*/i, '').trim();
    
    // Analyze the message to provide relevant responses
    const lowerMessage = cleanMessage.toLowerCase();
    
    // Restaurant/Food related questions
    if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('mumbai')) {
      if (lowerMessage.includes('mumbai') && lowerMessage.includes('restaurant')) {
        return `Great question about Mumbai restaurants! The main factors affecting restaurants in Mumbai typically include:

🏙️ **Location & Rent**: Prime locations like Bandra, Juhu, and South Mumbai have high rental costs
🍽️ **Competition**: Mumbai has a dense restaurant market with intense competition
👥 **Customer Preferences**: Mumbai diners value variety, quality, and value for money
🚚 **Supply Chain**: Managing fresh ingredients and logistics in a crowded city
💰 **Economic Factors**: Rising costs of ingredients, labor, and utilities
📱 **Technology**: Online ordering, delivery apps, and digital marketing are crucial
🌧️ **Monsoon Challenges**: Heavy rains affect foot traffic and supply chains

Would you like me to elaborate on any of these factors or discuss potential solutions for restaurant owners?`;
      }
    }
    
    // Technology questions
    if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('ai') || lowerMessage.includes('app')) {
      return `That's a fascinating technology question! Based on your query about "${cleanMessage}", here are some key insights:

🔧 **Current Trends**: Technology is rapidly evolving with AI, cloud computing, and mobile-first approaches
📱 **User Experience**: Modern solutions focus on intuitive interfaces and seamless user journeys
🌐 **Scalability**: Cloud-based architectures enable global reach and rapid scaling
🔒 **Security**: Data protection and privacy are critical considerations
💰 **Cost-Effectiveness**: Open-source solutions and cloud services reduce barriers to entry

Would you like me to dive deeper into any specific aspect of technology implementation?`;
    }
    
    // Business/Startup questions
    if (lowerMessage.includes('business') || lowerMessage.includes('startup') || lowerMessage.includes('entrepreneur') || lowerMessage.includes('funding')) {
      return `Excellent business question! Regarding "${cleanMessage}", here are some important considerations:

💡 **Market Research**: Understanding your target audience and market needs is crucial
📊 **Business Model**: Clear revenue streams and value propositions are essential
👥 **Team Building**: Assembling the right talent and expertise
💰 **Funding Strategy**: Exploring various funding options from bootstrapping to venture capital
📈 **Growth Planning**: Scaling strategies and operational efficiency
🎯 **Competitive Advantage**: Differentiating your solution in the market

Would you like me to explore any specific aspect of business development or strategy?`;
    }
    
    // Social impact questions
    if (lowerMessage.includes('social') || lowerMessage.includes('impact') || lowerMessage.includes('community') || lowerMessage.includes('sustainability')) {
      return `That's an important social impact question! For "${cleanMessage}", consider these key factors:

🌍 **Community Needs**: Understanding local challenges and requirements
🤝 **Stakeholder Engagement**: Involving community members in solution design
📊 **Impact Measurement**: Defining and tracking meaningful metrics
🔄 **Sustainability**: Ensuring long-term viability and environmental responsibility
📚 **Education & Training**: Building local capacity and knowledge transfer
🤝 **Partnerships**: Collaborating with NGOs, government, and private sector

Would you like me to elaborate on any specific aspect of social impact or community development?`;
    }
    
    // General innovation questions
    if (lowerMessage.includes('innovation') || lowerMessage.includes('solution') || lowerMessage.includes('problem') || lowerMessage.includes('idea')) {
      return `That's a great innovation question! For "${cleanMessage}", here are some key insights:

🧠 **Problem Definition**: Clearly understanding the root cause and scope of the challenge
💡 **Creative Thinking**: Exploring multiple approaches and thinking outside the box
🔬 **Research & Validation**: Testing assumptions and gathering user feedback
🛠️ **Prototyping**: Building and iterating on solutions quickly
📈 **Scaling Strategy**: Planning for growth and widespread adoption
🎯 **Impact Focus**: Ensuring the solution creates meaningful positive change

Would you like me to help you develop this idea further or explore specific implementation strategies?`;
    }
    
    // Default response for other questions
    return `That's an interesting question about "${cleanMessage}"! 

I'd be happy to help you explore this topic further. Could you provide a bit more context about:

🎯 **Specific Focus**: What particular aspect would you like to dive into?
📊 **Current Situation**: What's your current understanding or experience with this topic?
🎯 **Goals**: What are you hoping to achieve or learn?

This will help me give you a more targeted and useful response!`;
  }
}
