import { NextRequest, NextResponse } from 'next/server';
import { HybridAI } from '@/lib/hybrid-ai';
import { CoCreateRoom, ChatMessage, AIPersona } from '@/types';

// In-memory storage for demo (in production, use Redis or database)
const rooms = new Map<string, CoCreateRoom>();
const messages = new Map<string, ChatMessage[]>();

export async function POST(request: NextRequest) {
  try {
    const { action, roomId, problemId, message, personaId } = await request.json();
    
    const ai = HybridAI.getInstance();
    
    switch (action) {
      case 'create_room':
        const aiPersonas = await ai.getAIPersonas();
        const newRoom: CoCreateRoom = {
          id: `room_${Date.now()}`,
          problemId,
          participants: [],
          aiPersonas,
          messages: [],
          activeIdeas: [],
          createdAt: new Date(),
        };
        rooms.set(newRoom.id, newRoom);
        messages.set(newRoom.id, []);
        
        return NextResponse.json({
          success: true,
          room: newRoom,
        });

      case 'send_message':
        if (!roomId || !message) {
          return NextResponse.json({ error: 'Room ID and message are required' }, { status: 400 });
        }

        const room = rooms.get(roomId);
        if (!room) {
          return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }

        // Add user message
        const userMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          roomId,
          sender: 'user',
          content: message,
          timestamp: new Date(),
          type: 'text',
        };

        const currentMessages = messages.get(roomId) || [];
        currentMessages.push(userMessage);
        messages.set(roomId, currentMessages);

        // Generate AI response
        const aiResponse = await generateAIResponse(message, room, personaId);
        const aiMessage: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          roomId,
          sender: 'ai',
          personaId,
          content: aiResponse,
          timestamp: new Date(),
          type: 'text',
        };

        currentMessages.push(aiMessage);
        messages.set(roomId, currentMessages);

        return NextResponse.json({
          success: true,
          messages: [userMessage, aiMessage],
        });

      case 'get_messages':
        if (!roomId) {
          return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
        }

        const storedMessages = messages.get(roomId) || [];
        return NextResponse.json({
          success: true,
          messages: storedMessages,
        });

      case 'synthesize_ideas':
        if (!roomId) {
          return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
        }

        const synthesisMessages = messages.get(roomId) || [];
        const synthesis = await synthesizeIdeas(synthesisMessages);
        
        const synthesisMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          roomId,
          sender: 'ai',
          content: synthesis,
          timestamp: new Date(),
          type: 'synthesis',
        };

        synthesisMessages.push(synthesisMessage);
        messages.set(roomId, synthesisMessages);

        return NextResponse.json({
          success: true,
          synthesis,
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in co-create room:', error);
    return NextResponse.json(
      { error: 'Failed to process co-create request' },
      { status: 500 }
    );
  }
}

async function generateAIResponse(message: string, room: CoCreateRoom, personaId?: string): Promise<string> {
  const ai = HybridAI.getInstance();
  
  if (personaId) {
    const persona = room.aiPersonas.find(p => p.id === personaId);
    if (persona) {
      const prompt = `
      You are ${persona.name}, a ${persona.role}.
      Expertise: ${persona.expertise.join(', ')}
      Perspective: ${persona.perspective}
      
      Respond to this message from your perspective: "${message}"
      
      Provide insights, suggestions, or questions that align with your expertise.
      `;

      return await ai.generateChatResponse(message, persona);
    }
  }

  // Default AI response
  const prompt = `
  You are an AI innovation facilitator helping with collaborative ideation.
  Respond to this message: "${message}"
  
  Provide helpful insights, ask clarifying questions, or suggest next steps for the innovation process.
  `;

  return await ai.generateChatResponse(message);
}

async function synthesizeIdeas(messages: ChatMessage[]): Promise<string> {
  const ai = HybridAI.getInstance();
  
  const conversation = messages
    .filter(m => m.type === 'text')
    .map(m => `${m.sender}: ${m.content}`)
    .join('\n');

  const prompt = `
  Synthesize the key ideas and insights from this collaborative ideation session:
  
  ${conversation}
  
  Provide:
  1. Key themes and patterns
  2. Most promising ideas
  3. Areas needing more exploration
  4. Next steps for development
  5. Potential challenges and solutions
  
  Format as a structured synthesis report.
  `;

  return await ai.synthesizeIdeas(conversation.split('\n'));
}
