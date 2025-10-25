import { generateSolutions } from '@/lib/gemini-api'

export async function POST(request: Request) {
  try {
    const { 
      problemStatement, 
      solutionCount, 
      innovationFocus, 
      techPreference, 
      budgetRange 
    } = await request.json()

    if (!problemStatement) {
      return Response.json(
        {
          success: false,
          error: "Problem statement is required",
        },
        { status: 400 }
      )
    }

    // Generate creative solution concepts using Gemini API
    const result = await generateSolutions(
      problemStatement, 
      solutionCount, 
      innovationFocus, 
      techPreference, 
      budgetRange
    )

    if (!result.success) {
      throw new Error(result.error || "Failed to generate solutions")
    }

    const solutionsText = result.text!

    // Parse the generated solutions
    const solutions = JSON.parse(solutionsText)

    // Validate the response structure
    if (!Array.isArray(solutions) || solutions.length === 0) {
      throw new Error("Invalid solutions structure")
    }

    return Response.json({
      success: true,
      solutions,
    })
  } catch (error) {
    console.error("Solution generation error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate solution concepts",
      },
      { status: 500 }
    )
  }
}
