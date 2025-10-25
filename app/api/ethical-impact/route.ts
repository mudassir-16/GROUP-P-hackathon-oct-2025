import { generateEthicalImpactSummary } from '@/lib/gemini-api'

export async function POST(request: Request) {
  try {
    const { blueprint, solution, problemStatement } = await request.json()

    if (!blueprint) {
      return Response.json(
        {
          success: false,
          error: "Blueprint is required for ethical impact analysis",
        },
        { status: 400 }
      )
    }

    // Generate comprehensive ethical impact summary using Gemini API
    const result = await generateEthicalImpactSummary(blueprint, solution, problemStatement)

    if (!result.success) {
      throw new Error(result.error || "Failed to generate ethical impact summary")
    }

    const ethicalSummaryText = result.text!

    // Parse the generated ethical summary
    const ethicalSummary = JSON.parse(ethicalSummaryText)

    // Validate the response structure
    if (!ethicalSummary.bias_detection || !Array.isArray(ethicalSummary.bias_detection)) {
      throw new Error("Invalid ethical summary structure")
    }

    return Response.json({
      success: true,
      ethicalSummary,
    })
  } catch (error) {
    console.error("Ethical impact analysis error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to analyze ethical impact",
      },
      { status: 500 }
    )
  }
}
