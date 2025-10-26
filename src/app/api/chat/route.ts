import { NextRequest, NextResponse } from 'next/server';
import { HybridAI } from '@/lib/hybrid-ai';

export async function POST(request: NextRequest) {
  try {
    const { message, persona } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const ai = HybridAI.getInstance();
    
    // Generate AI response
    const aiResponse = await ai.generateChatResponse(message, persona);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Error generating AI response:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}
