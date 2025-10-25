import { API_CONFIG } from './config'

export interface GeminiResponse {
  success: boolean
  text?: string
  error?: string
}

export async function callGeminiAPI(prompt: string, maxTokens: number = 2048): Promise<GeminiResponse> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_CONFIG.GEMINI.API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: API_CONFIG.GEMINI.TEMPERATURE,
          topK: API_CONFIG.GEMINI.TOP_K,
          topP: API_CONFIG.GEMINI.TOP_P,
          maxOutputTokens: maxTokens,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.candidates[0].content.parts[0].text

    return {
      success: true,
      text: text
    }
  } catch (error) {
    console.error('Gemini API call failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export async function generateProblemStatement(challenge: string, context: string, targetRegion: string): Promise<GeminiResponse> {
  const prompt = `You are an expert problem analyst and innovation consultant. Analyze the following challenge and synthesize it into a concrete, actionable problem statement.

Challenge: ${challenge}
Context: ${context || "No additional context provided"}
Target Region: ${targetRegion || "Global"}

Provide a detailed JSON response with the following structure:
{
  "id": "unique-id",
  "title": "Clear, concise problem title",
  "description": "Detailed problem description with specific details",
  "scope": "Geographic and demographic scope of the problem",
  "stakeholders": ["List of key stakeholders affected by this problem"],
  "impact_metrics": ["Specific metrics to measure problem impact"],
  "urgency_level": "low|medium|high|critical",
  "complexity_score": 85,
  "feasibility_score": 75,
  "sdg_alignment": ["Relevant SDG goals this problem addresses"],
  "root_causes": ["Primary root causes of the problem"],
  "success_criteria": ["Clear criteria for successful problem resolution"],
  "constraints": ["Key constraints and limitations"],
  "opportunities": ["Potential opportunities for innovation"]
}

Guidelines:
- Make the problem statement specific and measurable
- Include quantifiable impact metrics where possible
- Identify clear stakeholders and their roles
- Assess urgency based on current impact and trends
- Calculate complexity score (0-100) based on technical, social, and economic factors
- Calculate feasibility score (0-100) based on available resources and solutions
- Align with relevant UN Sustainable Development Goals
- Identify root causes, not just symptoms
- Define clear success criteria
- Consider both constraints and opportunities

Return ONLY valid JSON, no markdown or extra text.`

  return await callGeminiAPI(prompt, 2048)
}

export async function generateBlueprint(problemStatement: string, context: string, targetAudience: string, constraints: string): Promise<GeminiResponse> {
  const prompt = `You are an expert innovation consultant. Generate a comprehensive innovation blueprint for the following challenge:

Problem Statement: ${problemStatement}
Context: ${context}
Target Audience: ${targetAudience}
Constraints: ${constraints}

Provide a detailed JSON response with the following structure:
{
  "problemAnalysis": "Deep analysis of the problem",
  "solutions": [
    {
      "title": "Solution title",
      "description": "Detailed description",
      "impact": 85,
      "timeline": "6 months",
      "resources": ["Resource 1", "Resource 2"],
      "implementation_steps": ["Step 1", "Step 2"]
    }
  ],
  "roadmap": [
    {
      "phase": "Phase name",
      "duration": "Duration",
      "tasks": 5,
      "description": "Phase description"
    }
  ],
  "sdg_alignment": [
    {
      "sdg": "SDG number and name",
      "alignment_score": 85,
      "description": "How this blueprint aligns with this SDG"
    }
  ],
  "risks": ["Risk 1", "Risk 2"],
  "success_metrics": ["Metric 1", "Metric 2"],
  "estimated_budget": "Budget range",
  "team_composition": ["Role 1", "Role 2"]
}

Return ONLY valid JSON, no markdown or extra text.`

  return await callGeminiAPI(prompt, 2048)
}

export async function generateVisualPrototype(blueprint: any, type: string): Promise<GeminiResponse> {
  let prompt = ''

  switch (type) {
    case 'architecture':
      prompt = `Generate a Mermaid diagram for the system architecture of this solution:

${JSON.stringify(blueprint, null, 2)}

Create a system architecture diagram showing:
- Main components and services
- Data flow between components
- External integrations
- User interfaces

Return ONLY the Mermaid diagram code, no explanations.`
      break

    case 'user-flow':
      prompt = `Generate a Mermaid flowchart for the user journey of this solution:

${JSON.stringify(blueprint, null, 2)}

Create a user flow diagram showing:
- User entry points
- Key interactions and decisions
- User touchpoints with the system
- Success and error paths

Return ONLY the Mermaid flowchart code, no explanations.`
      break

    case 'wireframe':
      prompt = `Generate a detailed wireframe description for the UI of this solution:

${JSON.stringify(blueprint, null, 2)}

Describe the key screens and interface elements:
- Main dashboard/landing page
- Key user interaction screens
- Navigation structure
- Important UI components

Return a structured description of the wireframes.`
      break

    case 'concept-art':
      prompt = `Generate a detailed concept visualization description for this solution:

${JSON.stringify(blueprint, null, 2)}

Describe the visual concept including:
- Brand identity and visual style
- Color scheme and typography
- Key visual elements and imagery
- User interface aesthetics

Return a detailed description of the concept visualization.`
      break

    default:
      throw new Error(`Unknown visual type: ${type}`)
  }

  return await callGeminiAPI(prompt, 1024)
}

export async function generatePitchDeck(blueprint: any): Promise<GeminiResponse> {
  const prompt = `Generate a professional 5-slide pitch deck for this innovation blueprint:

${JSON.stringify(blueprint, null, 2)}

Create slides with the following structure:
1. Title Slide - Problem statement and solution overview
2. Problem Slide - Deep dive into the challenge and its impact
3. Solution Slide - Your proposed solution and key features
4. Impact Slide - Expected outcomes, metrics, and SDG alignment
5. Roadmap Slide - Implementation timeline and next steps

For each slide, provide:
- slideNumber: number
- title: string
- content: string (detailed content for the slide)
- type: "title" | "problem" | "solution" | "impact" | "roadmap"

Return ONLY a valid JSON array of slides, no markdown or extra text.`

  return await callGeminiAPI(prompt, 2048)
}

export async function generateSolutions(
  problemStatement: any, 
  solutionCount: number, 
  innovationFocus: string, 
  techPreference: string, 
  budgetRange: string
): Promise<GeminiResponse> {
  const prompt = `You are an expert innovation consultant and solution architect. Generate ${solutionCount} creative solution concepts for the following problem statement:

Problem Statement: ${JSON.stringify(problemStatement, null, 2)}

Generation Parameters:
- Innovation Focus: ${innovationFocus}
- Tech Preference: ${techPreference}
- Budget Range: ${budgetRange}

For each solution, provide a detailed JSON response with the following structure:
{
  "id": "unique-solution-id",
  "title": "Creative solution title",
  "description": "Detailed solution description",
  "innovation_level": "incremental|moderate|breakthrough",
  "feasibility_score": 85,
  "impact_potential": 90,
  "uniqueness_score": 75,
  "tech_stack": [
    {
      "category": "Frontend",
      "technologies": ["React", "TypeScript", "TailwindCSS"],
      "rationale": "Modern, scalable frontend stack"
    },
    {
      "category": "Backend",
      "technologies": ["Node.js", "Express", "PostgreSQL"],
      "rationale": "Robust backend infrastructure"
    }
  ],
  "implementation_approach": "Step-by-step implementation strategy",
  "key_features": ["Feature 1", "Feature 2", "Feature 3"],
  "target_users": ["Primary user group", "Secondary user group"],
  "competitive_advantages": ["Unique advantage 1", "Unique advantage 2"],
  "risks": ["Risk 1", "Risk 2"],
  "success_metrics": ["Metric 1", "Metric 2", "Metric 3"],
  "estimated_timeline": "6-12 months",
  "resource_requirements": ["Resource 1", "Resource 2", "Resource 3"],
  "monetization_strategy": "Revenue generation approach",
  "scalability_potential": 85
}

Guidelines:
- Generate ${solutionCount} distinct solution concepts
- Vary innovation levels based on the focus parameter
- Select appropriate tech stacks based on preference and budget
- Ensure solutions are feasible and impactful
- Include modern, relevant technologies
- Consider scalability and sustainability
- Address the core problem effectively
- Provide realistic timelines and resource requirements

Return ONLY a valid JSON array of solutions, no markdown or extra text.`

  return await callGeminiAPI(prompt, 2048)
}

export async function generateRoadmap(
  solution: any,
  problemStatement: any,
  timeline_preference: string,
  budget_range: string,
  team_size: string,
  complexity_level: string,
  stakeholder_engagement: string
): Promise<GeminiResponse> {
  const prompt = `You are an expert project manager and implementation consultant. Generate a comprehensive implementation roadmap for the following solution:

Solution: ${JSON.stringify(solution, null, 2)}
Problem Statement: ${JSON.stringify(problemStatement, null, 2)}

Roadmap Parameters:
- Timeline Preference: ${timeline_preference}
- Budget Range: ${budget_range}
- Team Size: ${team_size}
- Complexity Level: ${complexity_level}
- Stakeholder Engagement: ${stakeholder_engagement}

Generate a detailed JSON roadmap with the following structure:
{
  "id": "roadmap-id",
  "title": "Implementation Roadmap Title",
  "description": "Comprehensive roadmap description",
  "total_duration_months": 12,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "phases": [
    {
      "id": "phase-id",
      "name": "Phase Name",
      "description": "Phase description",
      "start_date": "2024-01-01",
      "end_date": "2024-03-31",
      "duration_weeks": 12,
      "status": "planning|active|completed|on_hold",
      "milestones": [
        {
          "id": "milestone-id",
          "title": "Milestone Title",
          "description": "Milestone description",
          "due_date": "2024-02-15",
          "status": "not_started|in_progress|completed|blocked",
          "priority": "low|medium|high|critical",
          "dependencies": ["milestone-id-1"],
          "deliverables": ["Deliverable 1", "Deliverable 2"],
          "success_criteria": ["Criteria 1", "Criteria 2"]
        }
      ],
      "budget_allocation": 50000,
      "resource_requirements": ["Resource 1", "Resource 2"],
      "risks": ["Risk 1", "Risk 2"],
      "success_criteria": ["Criteria 1", "Criteria 2"]
    }
  ],
  "stakeholders": [
    {
      "id": "stakeholder-id",
      "name": "Stakeholder Name",
      "role": "Role/Title",
      "organization": "Organization",
      "contact_info": "contact@example.com",
      "influence_level": "low|medium|high|critical",
      "engagement_level": "passive|supportive|active|champion",
      "responsibilities": ["Responsibility 1", "Responsibility 2"],
      "communication_preferences": ["Email", "Weekly meetings"]
    }
  ],
  "kpis": [
    {
      "id": "kpi-id",
      "name": "KPI Name",
      "description": "KPI description",
      "metric_type": "quantitative|qualitative",
      "target_value": "100",
      "current_value": "0",
      "unit": "users|%|$",
      "frequency": "daily|weekly|monthly|quarterly|annually",
      "owner": "Owner Name",
      "measurement_method": "How to measure",
      "baseline_value": "0",
      "target_date": "2024-06-30"
    }
  ],
  "budget_breakdown": {
    "total_budget": 200000,
    "phases": {
      "phase-1": 50000,
      "phase-2": 75000,
      "phase-3": 75000
    },
    "categories": {
      "development": 100000,
      "infrastructure": 50000,
      "marketing": 30000,
      "operations": 20000
    }
  },
  "risk_assessment": {
    "high_risks": ["High risk 1", "High risk 2"],
    "medium_risks": ["Medium risk 1", "Medium risk 2"],
    "low_risks": ["Low risk 1", "Low risk 2"],
    "mitigation_strategies": ["Strategy 1", "Strategy 2"]
  },
  "success_metrics": ["Metric 1", "Metric 2", "Metric 3"]
}

Guidelines:
- Create 3-5 implementation phases based on complexity
- Include realistic timelines based on team size and complexity
- Generate appropriate budget allocations based on budget range
- Identify key stakeholders based on engagement level
- Create measurable KPIs for each phase
- Include comprehensive risk assessment
- Ensure milestones have clear dependencies
- Consider resource constraints and team capabilities
- Align with solution requirements and problem context

Return ONLY valid JSON, no markdown or extra text.`

  return await callGeminiAPI(prompt, 2048)
}
