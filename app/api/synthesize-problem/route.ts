import { generateProblemStatement } from '@/lib/gemini-api'

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

    // Generate comprehensive problem statement using Gemini API
    const result = await generateProblemStatement(challenge, context, targetRegion)

    if (!result.success) {
      throw new Error(result.error || "Failed to generate problem statement")
    }

    const problemStatementText = result.text!

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
