export async function POST(request: Request) {
  try {
    const { blueprint, types } = await request.json()

    const visuals = []

    for (const type of types) {
      let visual = null

      if (type === "architecture") {
        const prompt = `Generate a Mermaid diagram for the system architecture of this solution:

${JSON.stringify(blueprint, null, 2)}

Create a system architecture diagram showing:
- Main components and services
- Data flow between components
- External integrations
- User interfaces

Return ONLY the Mermaid diagram code, no explanations.`

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
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
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        })

        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.status}`)
        }

        const data = await response.json()
        const mermaidCode = data.candidates[0].content.parts[0].text

        visual = {
          type: "architecture",
          title: "System Architecture",
          description: "Technical infrastructure and component relationships",
          mermaidCode: mermaidCode,
        }
      } else if (type === "user-flow") {
        const prompt = `Generate a Mermaid flowchart for the user journey of this solution:

${JSON.stringify(blueprint, null, 2)}

Create a user flow diagram showing:
- User entry points
- Key interactions and decisions
- User touchpoints with the system
- Success and error paths

Return ONLY the Mermaid flowchart code, no explanations.`

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
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
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        })

        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.status}`)
        }

        const data = await response.json()
        const mermaidCode = data.candidates[0].content.parts[0].text

        visual = {
          type: "user-flow",
          title: "User Journey Map",
          description: "User interaction flow and experience touchpoints",
          mermaidCode: mermaidCode,
        }
      } else if (type === "wireframe") {
        const prompt = `Generate a detailed wireframe description for the UI of this solution:

${JSON.stringify(blueprint, null, 2)}

Describe the key screens and interface elements:
- Main dashboard/landing page
- Key user interaction screens
- Navigation structure
- Important UI components

Return a structured description of the wireframes.`

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
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
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        })

        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.status}`)
        }

        const data = await response.json()
        const wireframeDescription = data.candidates[0].content.parts[0].text

        visual = {
          type: "wireframe",
          title: "UI Wireframes",
          description: "Interface layout and user interface structure",
          wireframeDescription: wireframeDescription,
        }
      } else if (type === "concept-art") {
        const { text: conceptDescription } = await generateText({
          model: "openai/gpt-4-turbo",
          prompt: `Generate a concept art description for visualizing this solution:

${JSON.stringify(blueprint, null, 2)}

Describe the visual concept including:
- Brand identity and visual style
- Key visual elements and metaphors
- Color scheme and typography
- Iconography and imagery concepts

Return a detailed concept art description.`,
        })

        visual = {
          type: "concept-art",
          title: "Concept Visualization",
          description: "Visual concept and branding elements",
          conceptDescription: conceptDescription,
        }
      }

      if (visual) {
        visuals.push(visual)
      }
    }

    return Response.json({
      success: true,
      visuals,
    })
  } catch (error) {
    console.error("Visual generation error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate visuals",
      },
      { status: 500 },
    )
  }
}
