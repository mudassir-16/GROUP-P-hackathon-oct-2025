import { NextRequest, NextResponse } from 'next/server';

const HF_MODELS = [
  'https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4',
  'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
  'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
  'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2'
];

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

async function tryGenerateImage(prompt: string, modelUrl: string): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 20,
          guidance_scale: 7.5,
          width: 512,
          height: 512,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = imageBlob.type || 'image/png';

    return { 
      success: true, 
      imageUrl: `data:${mimeType};base64,${base64}` 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ideaTitle, ideaSummary } = await request.json();

    if (!ideaTitle) {
      return NextResponse.json(
        { error: 'Idea title is required' },
        { status: 400 }
      );
    }

    // Create a descriptive prompt for the image generation
    const prompt = `Create a concept illustration for "${ideaTitle}". ${ideaSummary ? `The concept is about: ${ideaSummary}` : ''} Professional, clean, modern design with vibrant colors. Abstract representation of innovation and problem-solving.`;

    console.log('Generating image with prompt:', prompt);

    // For now, return a placeholder image URL
    // In production, this would use a working image generation service
    const placeholderImageUrl = `data:image/svg+xml;base64,${Buffer.from(`
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" fill="url(#grad1)"/>
        <circle cx="256" cy="200" r="60" fill="white" opacity="0.3"/>
        <rect x="196" y="280" width="120" height="80" rx="10" fill="white" opacity="0.2"/>
        <text x="256" y="320" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${ideaTitle}</text>
        <text x="256" y="340" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" opacity="0.8">Concept Illustration</text>
        <text x="256" y="480" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10" opacity="0.6">AI Generated Placeholder</text>
      </svg>
    `).toString('base64')}`;

    console.log('✅ Placeholder image generated successfully!');
    return NextResponse.json({
      success: true,
      imageUrl: placeholderImageUrl,
      prompt: prompt,
      note: 'This is a placeholder image. Set up a working image generation service for real AI-generated images.'
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
