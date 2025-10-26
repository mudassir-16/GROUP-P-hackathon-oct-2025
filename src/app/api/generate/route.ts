import { NextRequest, NextResponse } from 'next/server';
import { HybridAI } from '@/lib/hybrid-ai';
import { saveBlueprint } from '@/lib/firebase';
import { Problem, Solution, Roadmap, ImpactScore } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { challenge, context, constraints } = await request.json();
    
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge is required' }, { status: 400 });
    }

    const ai = HybridAI.getInstance();
    
    // Step 1: Synthesize the problem
    const problem = await ai.synthesizeProblem(challenge, context);
    
    // Step 2: Compose the solution
    const solution = await ai.composeSolution(problem, constraints);
    
    // Step 3-5: Run operations in parallel for speed
    const [roadmap, impactScore, visualPrototype] = await Promise.all([
      ai.buildRoadmap(solution),
      ai.calculateImpactScore(problem, solution),
      ai.generateVisualPrototype(solution)
    ]);
    
    // Step 6: Generate pitch deck (needs roadmap)
    const pitchDeck = await ai.generatePitchDeck(problem, solution, roadmap);
    
    const blueprint = {
      id: `blueprint_${Date.now()}`,
      title: solution.title,
      description: solution.description,
      problem,
      solution,
      roadmap,
      impactScore,
      visualPrototype,
      pitchDeck,
      license: 'CC-BY-SA' as const,
      provenance: {
        dataSources: ['UN SDG Database', 'Open Innovation Archives'],
        aiModels: ['GPT-4'],
        reasoning: 'Multi-step AI analysis with human oversight',
        confidence: 0.85,
        biasNotes: ['Solution optimized for open-source approach', 'Bias towards sustainable technologies'],
        lastUpdated: new Date(),
      },
      version: '1.0.0',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Firebase if user is authenticated
    const userId = request.headers.get('x-user-id');
    if (userId) {
      try {
        const blueprintId = await saveBlueprint(blueprint, userId);
        if (blueprintId) {
          blueprint.id = blueprintId;
        }
      } catch (error) {
        console.error('Error saving blueprint to Firebase:', error);
        // Continue without saving to Firebase
      }
    }

    return NextResponse.json({
      success: true,
      blueprint,
    });

  } catch (error) {
    console.error('Error generating blueprint:', error);
    return NextResponse.json(
      { error: 'Failed to generate blueprint' },
      { status: 500 }
    );
  }
}
