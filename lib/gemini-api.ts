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
