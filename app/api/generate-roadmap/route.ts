import { generateRoadmap } from '@/lib/gemini-api'

export async function POST(request: Request) {
  try {
    const { 
      solution, 
      problemStatement, 
      timeline_preference, 
      budget_range, 
      team_size, 
      complexity_level, 
      stakeholder_engagement 
    } = await request.json()

    if (!solution || !problemStatement) {
      return Response.json(
        {
          success: false,
          error: "Solution and problem statement are required",
        },
        { status: 400 }
      )
    }

    // Generate comprehensive roadmap using Gemini API
    const result = await generateRoadmap(
      solution,
      problemStatement,
      timeline_preference,
      budget_range,
      team_size,
      complexity_level,
      stakeholder_engagement
    )

    if (!result.success) {
      throw new Error(result.error || "Failed to generate roadmap")
    }

    const roadmapText = result.text!

    // Parse the generated roadmap
    const roadmap = JSON.parse(roadmapText)

    // Validate the response structure
    if (!roadmap.phases || !Array.isArray(roadmap.phases)) {
      throw new Error("Invalid roadmap structure")
    }

    return Response.json({
      success: true,
      roadmap,
    })
  } catch (error) {
    console.error("Roadmap generation error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate implementation roadmap",
      },
      { status: 500 }
    )
  }
}
