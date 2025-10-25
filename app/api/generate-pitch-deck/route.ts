export async function POST(request: Request) {
  try {
    const { blueprint } = await request.json()

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
          maxOutputTokens: 2048,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const pitchDeckText = data.candidates[0].content.parts[0].text

    // Parse the generated pitch deck
    const slides = JSON.parse(pitchDeckText)

    return Response.json({
      success: true,
      slides,
    })
  } catch (error) {
    console.error("Pitch deck generation error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate pitch deck",
      },
      { status: 500 },
    )
  }
}
