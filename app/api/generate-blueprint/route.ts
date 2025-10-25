import { generateBlueprint } from '@/lib/gemini-api'

export async function POST(request: Request) {
  try {
    const { problemStatement, context, targetAudience, constraints } = await request.json()

    // Generate comprehensive blueprint using Gemini API
    const result = await generateBlueprint(problemStatement, context, targetAudience, constraints)

    if (!result.success) {
      throw new Error(result.error || "Failed to generate blueprint")
    }

    const blueprintText = result.text!

    // Parse the generated blueprint
    const blueprint = JSON.parse(blueprintText)

    return Response.json({
      success: true,
      blueprint,
    })
  } catch (error) {
    console.error("Blueprint generation error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate blueprint",
      },
      { status: 500 },
    )
  }
}
