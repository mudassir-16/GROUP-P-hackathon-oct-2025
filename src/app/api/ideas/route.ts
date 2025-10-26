import { NextRequest, NextResponse } from 'next/server';
import { Idea, SolutionConcept, PartnerSuggestion } from '@/types';
import { saveBlueprint } from '@/lib/firebase';

// Hugging Face API integration for idea generation
async function generateIdeaWithHF(problemText: string): Promise<Idea> {
  const HF_API_URL = 'https://router.huggingface.co/hf-inference/models/microsoft/DialoGPT-medium';
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

  if (!HF_API_KEY) {
    throw new Error('Hugging Face API key not configured');
  }

  const prompt = `You are OpenIdeaX, an AI co-creator for social innovation.
Input: ${problemText}

Output a JSON with the following structure:
{
  "title": "short catchy title",
  "summary": "one-paragraph problem summary",
  "solutions": [
    {
      "id": 1,
      "title": "Solution A",
      "description": "detailed description",
      "stakeholders": ["NGO A", "Local Government"],
      "tech_stack": ["React", "Node.js"],
      "effort_level": "low",
      "impact_estimate": "high"
    }
  ],
  "roadmap": [
    {
      "phase": "0-3 months",
      "tasks": ["Initial research", "Stakeholder mapping", "Prototype development"]
    }
  ],
  "partners": [
    {
      "name": "NGO A",
      "type": "NGO",
      "reason": "Local expertise in the area",
      "contact_link": "https://example.com"
    }
  ],
  "tags": ["education", "India"]
}

Return valid JSON only.`;

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 1000,
          temperature: 0.7,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse the generated text as JSON
    let ideaData;
    try {
      // Extract JSON from the response
      const jsonMatch = data[0]?.generated_text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        ideaData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing HF response:', parseError);
      // Fallback to mock data
      return generateMockIdea(problemText);
    }

    // Transform to our Idea interface
    const idea: Idea = {
      id: `idea_${Date.now()}`,
      title: ideaData.title || 'Generated Solution',
      problem_text: problemText,
      summary: ideaData.summary || 'AI-generated solution summary',
      solutions: ideaData.solutions || [],
      roadmap: ideaData.roadmap || [],
      partners: ideaData.partners || [],
      tags: ideaData.tags || [],
      creator: {
        userId: 'system',
        name: 'OpenIdeaX AI'
      },
      createdAt: new Date(),
      public: true,
      upvotes: 0,
      remixes: 0
    };

    return idea;
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    // Fallback to mock data
    return generateMockIdea(problemText);
  }
}

// Mock data generator for fallback
function generateMockIdea(problemText: string): Idea {
  return {
    id: `idea_${Date.now()}`,
    title: `Solution for: ${problemText.substring(0, 50)}...`,
    problem_text: problemText,
    summary: `This is an AI-generated solution addressing the challenge: ${problemText}. The solution focuses on sustainable, community-driven approaches with clear implementation pathways.`,
    solutions: [
      {
        id: 1,
        title: "Community-Based Approach",
        description: "Engage local communities in co-designing and implementing solutions that address their specific needs and cultural context.",
        stakeholders: ["Local NGOs", "Community Leaders", "Government Agencies"],
        tech_stack: ["Mobile Apps", "Community Platforms", "Data Analytics"],
        effort_level: "medium",
        impact_estimate: "high"
      },
      {
        id: 2,
        title: "Technology-Enabled Solution",
        description: "Leverage appropriate technology to scale impact while maintaining human-centered design principles.",
        stakeholders: ["Tech Partners", "Implementation Teams", "End Users"],
        tech_stack: ["Web Platform", "Mobile Interface", "Cloud Infrastructure"],
        effort_level: "high",
        impact_estimate: "high"
      },
      {
        id: 3,
        title: "Policy & Advocacy Initiative",
        description: "Work with policymakers to create enabling environments and sustainable funding mechanisms.",
        stakeholders: ["Policy Makers", "Advocacy Groups", "Research Institutions"],
        tech_stack: ["Research Tools", "Communication Platforms", "Data Visualization"],
        effort_level: "medium",
        impact_estimate: "medium"
      }
    ],
    roadmap: [
      {
        id: "phase_1",
        name: "Foundation Phase",
        description: "Initial setup and research",
        duration: "0-3 months",
        deliverables: ["Stakeholder mapping", "Initial research", "Prototype development"],
        dependencies: [],
        resources: ["Team", "Research tools"],
        phase: "0-3 months",
        tasks: ["Stakeholder mapping", "Initial research", "Prototype development", "Community engagement"]
      },
      {
        id: "phase_2", 
        name: "Implementation Phase",
        description: "Pilot and iteration",
        duration: "3-12 months",
        deliverables: ["Pilot implementation", "Feedback collection"],
        dependencies: ["phase_1"],
        resources: ["Implementation team", "Testing environment"],
        phase: "3-12 months",
        tasks: ["Pilot implementation", "Feedback collection", "Iteration", "Partnership building"]
      },
      {
        id: "phase_3",
        name: "Scale Phase", 
        description: "Full deployment and sustainability",
        duration: "12+ months",
        deliverables: ["Full deployment", "Monitoring system"],
        dependencies: ["phase_2"],
        resources: ["Full team", "Production infrastructure"],
        phase: "Scale",
        tasks: ["Full deployment", "Monitoring & evaluation", "Knowledge sharing", "Sustainability planning"]
      }
    ],
    partners: [
      {
        name: "Local Development NGO",
        type: "NGO",
        reason: "Deep local knowledge and community trust",
        contact_link: "https://example-ngo.org"
      },
      {
        name: "University Research Center",
        type: "Academic",
        reason: "Research expertise and evaluation capabilities",
        contact_link: "https://university.edu/research"
      },
      {
        name: "Government Agency",
        type: "Government",
        reason: "Policy support and funding opportunities",
        contact_link: "https://gov.agency.org"
      }
    ],
    tags: ["social-impact", "community-driven", "sustainable"],
    creator: {
      userId: 'system',
      name: 'OpenIdeaX AI'
    },
    createdAt: new Date(),
    public: true,
    upvotes: 0,
    remixes: 0
  };
}

export async function POST(request: NextRequest) {
  try {
    const { problem_text, generateImage = false } = await request.json();
    
    if (!problem_text) {
      return NextResponse.json({ error: 'Problem text is required' }, { status: 400 });
    }

    // Generate idea using Hugging Face
    const idea = await generateIdeaWithHF(problem_text);

    // Optionally generate concept image
    let conceptImageUrl: string | undefined;
    if (generateImage && process.env.HUGGINGFACE_API_KEY) {
      try {
        console.log('Generating concept image...');
        const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ideaTitle: idea.title,
            ideaSummary: idea.summary,
          }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          conceptImageUrl = imageData.imageUrl;
          console.log('Concept image generated successfully');
        } else {
          console.log('Failed to generate concept image, continuing without it');
        }
      } catch (error) {
        console.error('Error generating concept image:', error);
        // Continue without image if generation fails
      }
    }

    // Add the concept image URL to the idea
    const ideaWithImage = {
      ...idea,
      conceptImageUrl,
    };

    // Save to Firebase if user is authenticated
    const userId = request.headers.get('x-user-id');
    if (userId) {
      try {
        // Convert Idea to Blueprint format for Firebase
        const blueprint = {
          id: ideaWithImage.id,
          title: ideaWithImage.title,
          description: ideaWithImage.summary,
          problem: {
            id: `problem_${Date.now()}`,
            title: ideaWithImage.title,
            description: ideaWithImage.problem_text,
            category: 'Social Impact',
            sdgGoals: [1, 2, 3],
            complexity: 'medium' as const,
            createdAt: new Date()
          },
          solution: {
            id: `solution_${Date.now()}`,
            problemId: `problem_${Date.now()}`,
            title: ideaWithImage.solutions[0]?.title || 'Generated Solution',
            description: ideaWithImage.solutions[0]?.description || ideaWithImage.summary,
            approach: ideaWithImage.solutions[0]?.description || '',
            techStack: ideaWithImage.solutions[0]?.tech_stack || [],
            implementation: ideaWithImage.solutions[0]?.description || '',
            timeline: '6-12 months',
            resources: ['Team', 'Funding', 'Technology'],
            stakeholders: ideaWithImage.solutions[0]?.stakeholders || [],
            kpis: ['User adoption', 'Impact metrics'],
            impactScore: 8,
            feasibilityScore: 7,
            sustainabilityScore: 8,
            sdgAlignment: [1, 2, 3],
            createdAt: new Date()
          },
          roadmap: {
            id: `roadmap_${Date.now()}`,
            solutionId: `solution_${Date.now()}`,
            phases: ideaWithImage.roadmap,
            totalDuration: '12 months',
            milestones: [],
            dependencies: [],
            risks: [],
            createdAt: new Date()
          },
          impactScore: {
            relevance: 8,
            feasibility: 7,
            impact: 8,
            sustainability: 8,
            innovation: 7,
            collaboration: 8
          },
          visualPrototype: conceptImageUrl || '',
          pitchDeck: '',
          license: 'CC-BY-SA' as const,
          provenance: {
            dataSources: ['OpenIdeaX AI'],
            aiModels: ['Hugging Face DialoGPT', ...(conceptImageUrl ? ['Stable Diffusion'] : [])],
            reasoning: 'AI-generated solution blueprint',
            confidence: 0.8,
            biasNotes: ['Generated by AI'],
            lastUpdated: new Date()
          },
          version: '1.0.0',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const blueprintId = await saveBlueprint(blueprint, userId);
        if (blueprintId) {
          ideaWithImage.id = blueprintId;
        }
      } catch (error) {
        console.error('Error saving idea to Firebase:', error);
        // Continue without saving to Firebase
      }
    }

    return NextResponse.json({
      success: true,
      idea: ideaWithImage
    });

  } catch (error) {
    console.error('Error generating idea:', error);
    return NextResponse.json(
      { error: 'Failed to generate idea' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const tags = searchParams.get('tags')?.split(',') || [];
    const search = searchParams.get('search') || '';

    // For now, return mock data - in production this would query Firebase
    const mockIdeas: Idea[] = [
      {
        id: 'idea_1',
        title: 'Digital Literacy for Rural Women',
        problem_text: 'Limited access to digital skills and technology in rural areas',
        summary: 'A comprehensive digital literacy program designed specifically for rural women, combining mobile learning with community support networks.',
        solutions: [
          {
            id: 1,
            title: 'Mobile Learning Platform',
            description: 'Offline-capable mobile app with localized content',
            stakeholders: ['Women Groups', 'Local NGOs', 'Telecom Partners'],
            tech_stack: ['React Native', 'Offline Storage', 'Localization'],
            effort_level: 'medium',
            impact_estimate: 'high'
          }
        ],
        roadmap: [
          {
            id: "phase_1",
            name: "Development Phase",
            description: "App development and content creation",
            duration: "0-3 months",
            deliverables: ["Content creation", "App development", "Pilot testing"],
            dependencies: [],
            resources: ["Development team", "Content creators"],
            phase: '0-3 months',
            tasks: ['Content creation', 'App development', 'Pilot testing']
          }
        ],
        partners: [
          {
            name: 'Women Empowerment NGO',
            type: 'NGO',
            reason: 'Community trust and local expertise',
            contact_link: 'https://example.org'
          }
        ],
        tags: ['education', 'women-empowerment', 'digital-literacy'],
        creator: {
          userId: 'user_1',
          name: 'Sarah Johnson'
        },
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        public: true,
        upvotes: 15,
        remixes: 3
      }
    ];

    return NextResponse.json({
      success: true,
      ideas: mockIdeas,
      total: mockIdeas.length
    });

  } catch (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}
