import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { challenge, context, targetRegion } = await request.json()

    if (!challenge) {
      return Response.json(
        {
          success: false,
          error: "Challenge description is required",
        },
        { status: 400 }
      )
    }

    // Generate comprehensive problem statement using AI
    const { text: problemStatementText } = await generateText({
      model: "openai/gpt-4-turbo",
      prompt: `You are an expert problem analyst and innovation consultant. Analyze the following challenge and synthesize it into a concrete, actionable problem statement.

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

Return ONLY valid JSON, no markdown or extra text.`,
    })

    // Parse the generated problem statement
    const problemStatement = JSON.parse(problemStatementText)

    // Validate the response structure
    if (!problemStatement.title || !problemStatement.description) {
      throw new Error("Invalid problem statement structure")
    }

    return Response.json({
      success: true,
      problemStatement,
    })
  } catch (error) {
    console.error("Problem synthesis error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to synthesize problem statement",
      },
      { status: 500 }
    )
  }
}
