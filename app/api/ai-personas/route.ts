import { generateText } from "ai"

interface PersonaRequest {
  blueprint: any
  userMessage: string
  conversationHistory: Array<{ role: string; content: string }>
}

const personas = {
  sustainability: {
    name: "🌱 Sustainability Expert",
    role: "Sustainability Expert",
    color: "from-green-500 to-emerald-600",
    description: "Ensures eco-friendly and ethical alignment",
    systemPrompt: `You are a sustainability and ethics expert. Your role is to ensure all solutions are environmentally sound, ethically aligned, and promote long-term sustainability. Focus on carbon footprint, resource efficiency, and ethical implications. Provide insights on environmental impact and sustainable practices.`,
  },
  technologist: {
    name: "💻 Tech Architect",
    role: "Tech Architect",
    color: "from-blue-500 to-cyan-600",
    description: "Suggests technical feasibility & architecture",
    systemPrompt: `You are a technology architect and implementation expert. Your role is to assess technical feasibility, recommend technology stacks, identify technical challenges, and suggest scalable implementation approaches. Be practical and specific about technical requirements, APIs, and infrastructure needs.`,
  },
  designer: {
    name: "💡 Design Thinker",
    role: "Design Thinker",
    color: "from-purple-500 to-pink-600",
    description: "Focuses on human-centered design",
    systemPrompt: `You are a human-centered design expert. Your role is to ensure solutions are user-friendly, accessible, and meet real human needs. Focus on user experience, accessibility, usability, and design thinking principles. Consider diverse user groups and inclusive design.`,
  },
  impact: {
    name: "📈 Impact Analyst",
    role: "Impact Analyst",
    color: "from-orange-500 to-red-600",
    description: "Estimates potential social/economic impact",
    systemPrompt: `You are an impact measurement and social innovation specialist. Your role is to evaluate social and economic impact, suggest measurable metrics, identify key stakeholders, and ensure alignment with SDGs. Focus on quantifiable outcomes and long-term social benefits.`,
  },
  community: {
    name: "🤝 Community Builder",
    role: "Community Builder",
    color: "from-indigo-500 to-purple-600",
    description: "Suggests open collaboration or funding sources",
    systemPrompt: `You are a community engagement and collaboration expert. Your role is to identify potential partners, funding sources, community stakeholders, and open collaboration opportunities. Focus on building sustainable partnerships and community-driven solutions.`,
  },
}

async function getPersonaResponse(
  personaKey: keyof typeof personas,
  blueprint: any,
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
) {
  const persona = personas[personaKey]

  const conversationContext = conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n")

  const { text } = await generateText({
    model: "openai/gpt-4-turbo",
    system: persona.systemPrompt,
    prompt: `Blueprint Context:
${JSON.stringify(blueprint, null, 2)}

Previous Conversation:
${conversationContext}

User Message: ${userMessage}

Provide a focused response from your perspective as the ${persona.role}.`,
  })

  return text
}

export async function POST(request: Request) {
  try {
    const { blueprint, userMessage, conversationHistory, selectedPersonas } = (await request.json()) as {
      blueprint: any
      userMessage: string
      conversationHistory: Array<{ role: string; content: string }>
      selectedPersonas: Array<keyof typeof personas>
    }

    const responses = await Promise.all(
      selectedPersonas.map((personaKey) =>
        getPersonaResponse(personaKey, blueprint, userMessage, conversationHistory).then((text) => ({
          persona: personaKey,
          name: personas[personaKey].name,
          response: text,
        })),
      ),
    )

    return Response.json({
      success: true,
      responses,
    })
  } catch (error) {
    console.error("AI Personas error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get persona responses",
      },
      { status: 500 },
    )
  }
}
