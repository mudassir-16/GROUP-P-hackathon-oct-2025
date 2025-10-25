import { generateKnowledgeGraph } from '@/lib/gemini-api'
import { fetchSDGData, calculateSDGAlignment } from '@/lib/sdg-api'

export async function POST(request: Request) {
  try {
    const { searchQuery, category, sdgFilter } = await request.json()

    // Generate comprehensive knowledge graph using Gemini API
    const result = await generateKnowledgeGraph(searchQuery, category, sdgFilter)

    if (!result.success) {
      throw new Error(result.error || "Failed to generate knowledge graph")
    }

    const knowledgeGraphText = result.text!

    // Parse the generated knowledge graph
    const knowledgeGraph = JSON.parse(knowledgeGraphText)

    // Fetch SDG data and enhance the graph
    try {
      const sdgData = await fetchSDGData()
      knowledgeGraph.sdgs = sdgData.map(sdg => ({
        id: sdg.goal,
        title: sdg.title,
        description: sdg.description,
        targets: sdg.indicators.map(indicator => indicator.target),
        indicators: sdg.indicators.map(indicator => indicator.title),
        related_problems: [],
        related_solutions: [],
        progress_status: "on_track" as const,
        priority_areas: [],
        funding_requirements: 0,
        timeline: "2030"
      }))
    } catch (error) {
      console.error("Error fetching SDG data:", error)
      // Continue without SDG data enhancement
    }

    // Validate the response structure
    if (!knowledgeGraph.problems || !Array.isArray(knowledgeGraph.problems)) {
      throw new Error("Invalid knowledge graph structure")
    }

    return Response.json({
      success: true,
      knowledgeGraph,
    })
  } catch (error) {
    console.error("Knowledge graph generation error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate knowledge graph",
      },
      { status: 500 }
    )
  }
}