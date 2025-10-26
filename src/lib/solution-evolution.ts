import { Solution, Roadmap } from '@/types';

export interface SolutionVersion {
  id: string;
  version: string;
  title: string;
  description: string;
  changes: string[];
  improvements: string[];
  contributors: string[];
  timestamp: Date;
  impactScore: number;
  userFeedback: UserFeedback[];
}

export interface UserFeedback {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  suggestions: string[];
  timestamp: Date;
}

export interface EvolutionStep {
  id: string;
  type: 'improvement' | 'bug_fix' | 'feature_add' | 'optimization';
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  priority: number;
  suggestedBy: string;
  timestamp: Date;
}

export interface SolutionEvolution {
  solutionId: string;
  currentVersion: string;
  evolutionPath: EvolutionStep[];
  improvementSuggestions: string[];
  nextVersionPrediction: string;
  communityContributions: CommunityContribution[];
  evolutionMetrics: EvolutionMetrics;
}

export interface CommunityContribution {
  id: string;
  contributorId: string;
  contributorName: string;
  contributionType: 'code' | 'design' | 'documentation' | 'testing' | 'feedback';
  description: string;
  impact: number;
  timestamp: Date;
}

export interface EvolutionMetrics {
  totalVersions: number;
  averageImprovement: number;
  communityEngagement: number;
  evolutionSpeed: number;
  stabilityScore: number;
}

export class SolutionEvolutionTracker {
  private static instance: SolutionEvolutionTracker;
  private evolutions: Map<string, SolutionEvolution> = new Map();

  private constructor() {}

  public static getInstance(): SolutionEvolutionTracker {
    if (!SolutionEvolutionTracker.instance) {
      SolutionEvolutionTracker.instance = new SolutionEvolutionTracker();
    }
    return SolutionEvolutionTracker.instance;
  }

  initializeEvolution(solution: Solution): SolutionEvolution {
    const evolution: SolutionEvolution = {
      solutionId: solution.id,
      currentVersion: '1.0.0',
      evolutionPath: [],
      improvementSuggestions: [],
      nextVersionPrediction: '1.1.0',
      communityContributions: [],
      evolutionMetrics: {
        totalVersions: 1,
        averageImprovement: 0,
        communityEngagement: 0,
        evolutionSpeed: 0,
        stabilityScore: 10
      }
    };

    this.evolutions.set(solution.id, evolution);
    return evolution;
  }

  addEvolutionStep(solutionId: string, step: EvolutionStep): void {
    const evolution = this.evolutions.get(solutionId);
    if (evolution) {
      evolution.evolutionPath.push(step);
      this.updateEvolutionMetrics(solutionId);
    }
  }

  addCommunityContribution(solutionId: string, contribution: CommunityContribution): void {
    const evolution = this.evolutions.get(solutionId);
    if (evolution) {
      evolution.communityContributions.push(contribution);
      this.updateEvolutionMetrics(solutionId);
    }
  }

  addUserFeedback(solutionId: string, feedback: UserFeedback): void {
    const evolution = this.evolutions.get(solutionId);
    if (evolution) {
      // Find the current version and add feedback
      const currentVersion = this.getCurrentVersion(solutionId);
      if (currentVersion) {
        currentVersion.userFeedback.push(feedback);
      }
    }
  }

  getEvolution(solutionId: string): SolutionEvolution | undefined {
    return this.evolutions.get(solutionId);
  }

  getAllEvolutions(): SolutionEvolution[] {
    return Array.from(this.evolutions.values());
  }

  getEvolutionTimeline(solutionId: string): EvolutionStep[] {
    const evolution = this.evolutions.get(solutionId);
    return evolution ? evolution.evolutionPath : [];
  }

  getCommunityContributions(solutionId: string): CommunityContribution[] {
    const evolution = this.evolutions.get(solutionId);
    return evolution ? evolution.communityContributions : [];
  }

  predictNextVersion(solutionId: string): string {
    const evolution = this.evolutions.get(solutionId);
    if (!evolution) return '1.0.0';

    const currentVersion = evolution.currentVersion;
    const [major, minor, patch] = currentVersion.split('.').map(Number);

    // Simple version prediction logic
    if (evolution.evolutionPath.length > 5) {
      return `${major + 1}.0.0`; // Major version
    } else if (evolution.evolutionPath.length > 2) {
      return `${major}.${minor + 1}.0`; // Minor version
    } else {
      return `${major}.${minor}.${patch + 1}`; // Patch version
    }
  }

  generateImprovementSuggestions(solution: Solution): string[] {
    const suggestions = [
      'Add user authentication system',
      'Implement real-time notifications',
      'Create mobile app version',
      'Add analytics dashboard',
      'Implement multi-language support',
      'Add offline functionality',
      'Create API documentation',
      'Add automated testing',
      'Implement caching system',
      'Add accessibility features'
    ];

    // Filter suggestions based on solution characteristics
    const filteredSuggestions = suggestions.filter(suggestion => {
      const techStack = solution.techStack.join(' ').toLowerCase();
      if (suggestion.includes('mobile') && !techStack.includes('react native')) {
        return true;
      }
      if (suggestion.includes('API') && !techStack.includes('api')) {
        return true;
      }
      return true;
    });

    return filteredSuggestions.slice(0, 5);
  }

  calculateEvolutionScore(solutionId: string): number {
    const evolution = this.evolutions.get(solutionId);
    if (!evolution) return 0;

    const metrics = evolution.evolutionMetrics;
    const score = (
      metrics.totalVersions * 0.2 +
      metrics.averageImprovement * 0.3 +
      metrics.communityEngagement * 0.2 +
      metrics.evolutionSpeed * 0.2 +
      metrics.stabilityScore * 0.1
    );

    return Math.min(10, Math.max(0, score));
  }

  getEvolutionInsights(solutionId: string): {
    mostActiveContributors: string[];
    popularImprovements: string[];
    evolutionTrend: 'accelerating' | 'stable' | 'declining';
    nextMilestone: string;
  } {
    const evolution = this.evolutions.get(solutionId);
    if (!evolution) {
      return {
        mostActiveContributors: [],
        popularImprovements: [],
        evolutionTrend: 'stable',
        nextMilestone: 'Version 1.1.0'
      };
    }

    // Calculate most active contributors
    const contributorCounts = new Map<string, number>();
    evolution.communityContributions.forEach(contrib => {
      const count = contributorCounts.get(contrib.contributorName) || 0;
      contributorCounts.set(contrib.contributorName, count + 1);
    });

    const mostActiveContributors = Array.from(contributorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    // Calculate popular improvements
    const improvementCounts = new Map<string, number>();
    evolution.evolutionPath.forEach(step => {
      const count = improvementCounts.get(step.description) || 0;
      improvementCounts.set(step.description, count + 1);
    });

    const popularImprovements = Array.from(improvementCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([improvement]) => improvement);

    // Determine evolution trend
    const recentSteps = evolution.evolutionPath.slice(-5);
    const olderSteps = evolution.evolutionPath.slice(-10, -5);
    const recentCount = recentSteps.length;
    const olderCount = olderSteps.length;
    
    let evolutionTrend: 'accelerating' | 'stable' | 'declining' = 'stable';
    if (recentCount > olderCount) {
      evolutionTrend = 'accelerating';
    } else if (recentCount < olderCount) {
      evolutionTrend = 'declining';
    }

    return {
      mostActiveContributors,
      popularImprovements,
      evolutionTrend,
      nextMilestone: this.predictNextVersion(solutionId)
    };
  }

  private updateEvolutionMetrics(solutionId: string): void {
    const evolution = this.evolutions.get(solutionId);
    if (!evolution) return;

    const metrics = evolution.evolutionMetrics;
    metrics.totalVersions = Math.max(1, Math.floor(evolution.evolutionPath.length / 3));
    metrics.averageImprovement = this.calculateAverageImprovement(evolution);
    metrics.communityEngagement = this.calculateCommunityEngagement(evolution);
    metrics.evolutionSpeed = this.calculateEvolutionSpeed(evolution);
    metrics.stabilityScore = this.calculateStabilityScore(evolution);
  }

  private calculateAverageImprovement(evolution: SolutionEvolution): number {
    if (evolution.evolutionPath.length === 0) return 0;
    
    const improvements = evolution.evolutionPath.filter(step => step.type === 'improvement');
    return improvements.length / evolution.evolutionPath.length;
  }

  private calculateCommunityEngagement(evolution: SolutionEvolution): number {
    const uniqueContributors = new Set(evolution.communityContributions.map(c => c.contributorId));
    return Math.min(10, uniqueContributors.size);
  }

  private calculateEvolutionSpeed(evolution: SolutionEvolution): number {
    if (evolution.evolutionPath.length === 0) return 0;
    
    const now = new Date();
    const firstStep = evolution.evolutionPath[0];
    const daysSinceFirst = (now.getTime() - firstStep.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    
    return Math.min(10, evolution.evolutionPath.length / Math.max(1, daysSinceFirst / 30));
  }

  private calculateStabilityScore(evolution: SolutionEvolution): number {
    const bugFixes = evolution.evolutionPath.filter(step => step.type === 'bug_fix').length;
    const totalSteps = evolution.evolutionPath.length;
    
    if (totalSteps === 0) return 10;
    
    const stabilityRatio = 1 - (bugFixes / totalSteps);
    return Math.max(0, Math.min(10, stabilityRatio * 10));
  }

  private getCurrentVersion(solutionId: string): SolutionVersion | null {
    // This would typically fetch from a database
    // For now, return a mock version
    return {
      id: `${solutionId}_v1.0.0`,
      version: '1.0.0',
      title: 'Initial Version',
      description: 'First version of the solution',
      changes: ['Initial implementation'],
      improvements: ['Basic functionality'],
      contributors: ['System'],
      timestamp: new Date(),
      impactScore: 7,
      userFeedback: []
    };
  }
}
