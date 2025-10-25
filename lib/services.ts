import { db } from './database'
import { Blueprint, User, CollaborationRoom, Comment, VisualPrototype, PitchDeck, ImpactScore } from './database-schema'
import { calculateSDGAlignment } from './sdg-api'
import { createGitHubGist } from './github-api'
import { exportBlueprintToNotion } from './notion-api'

export class BlueprintService {
  async createBlueprint(blueprintData: any, userId: string): Promise<Blueprint> {
    try {
      // Calculate SDG alignment
      const sdgAlignment = await calculateSDGAlignment(blueprintData)
      
      const blueprint = await db.createBlueprint({
        title: blueprintData.title || 'Generated Blueprint',
        description: blueprintData.description || '',
        problem_analysis: blueprintData.problemAnalysis || '',
        solutions: blueprintData.solutions || [],
        roadmap: blueprintData.roadmap || [],
        sdg_alignment: sdgAlignment,
        estimated_budget: blueprintData.estimated_budget,
        team_composition: blueprintData.team_composition,
        success_metrics: blueprintData.success_metrics,
        risks: blueprintData.risks,
        created_by: userId,
        status: 'draft',
        visibility: 'public',
        tags: this.extractTags(blueprintData)
      })

      // Create initial impact score
      await this.calculateImpactScore(blueprint.id, blueprintData)

      return blueprint
    } catch (error) {
      console.error('Error creating blueprint:', error)
      throw error
    }
  }

  async getBlueprint(id: string): Promise<Blueprint | null> {
    try {
      const blueprint = await db.getBlueprint(id)
      if (blueprint) {
        // Increment view count
        await db.updateBlueprint(id, { 
          views: blueprint.views + 1 
        })
      }
      return blueprint
    } catch (error) {
      console.error('Error getting blueprint:', error)
      return null
    }
  }

  async updateBlueprint(id: string, updates: Partial<Blueprint>): Promise<Blueprint | null> {
    try {
      const updatedBlueprint = await db.updateBlueprint(id, {
        ...updates,
        updated_at: new Date()
      })

      if (updatedBlueprint) {
        // Recalculate impact score if blueprint content changed
        if (updates.solutions || updates.roadmap || updates.sdg_alignment) {
          await this.calculateImpactScore(id, updatedBlueprint)
        }
      }

      return updatedBlueprint
    } catch (error) {
      console.error('Error updating blueprint:', error)
      return null
    }
  }

  async publishBlueprint(id: string): Promise<boolean> {
    try {
      const blueprint = await db.getBlueprint(id)
      if (!blueprint) return false

      // Create GitHub gist for public blueprints
      const githubUrl = await createGitHubGist(blueprint)
      
      // Update blueprint with GitHub URL and publish status
      await db.updateBlueprint(id, {
        status: 'published',
        github_url: githubUrl
      })

      return true
    } catch (error) {
      console.error('Error publishing blueprint:', error)
      return false
    }
  }

  async exportBlueprint(id: string, format: 'notion' | 'github'): Promise<string> {
    try {
      const blueprint = await db.getBlueprint(id)
      if (!blueprint) throw new Error('Blueprint not found')

      switch (format) {
        case 'notion':
          const notionPage = await exportBlueprintToNotion(blueprint)
          await db.updateBlueprint(id, { notion_url: notionPage.url })
          return notionPage.url
        
        case 'github':
          const githubUrl = await createGitHubGist(blueprint)
          await db.updateBlueprint(id, { github_url: githubUrl })
          return githubUrl
        
        default:
          throw new Error('Unsupported export format')
      }
    } catch (error) {
      console.error('Error exporting blueprint:', error)
      throw error
    }
  }

  private async calculateImpactScore(blueprintId: string, blueprintData: any): Promise<void> {
    try {
      // Calculate impact metrics based on blueprint content
      const socialImpact = this.calculateSocialImpact(blueprintData)
      const environmentalImpact = this.calculateEnvironmentalImpact(blueprintData)
      const economicImpact = this.calculateEconomicImpact(blueprintData)
      const innovationScore = this.calculateInnovationScore(blueprintData)

      const overallScore = Math.round(
        (socialImpact * 0.3) + 
        (environmentalImpact * 0.25) + 
        (economicImpact * 0.25) + 
        (innovationScore * 0.2)
      )

      await db.createImpactScore({
        blueprint_id: blueprintId,
        overall_score: overallScore,
        social_impact: socialImpact,
        environmental_impact: environmentalImpact,
        economic_impact: economicImpact,
        innovation_score: innovationScore,
        metrics: [
          { name: 'People Reached', value: socialImpact, target: 100, unit: '%', trend: 'up' },
          { name: 'Carbon Reduction', value: environmentalImpact, target: 100, unit: '%', trend: 'up' },
          { name: 'Economic Growth', value: economicImpact, target: 100, unit: '%', trend: 'up' },
          { name: 'Innovation Index', value: innovationScore, target: 100, unit: '%', trend: 'up' }
        ]
      })
    } catch (error) {
      console.error('Error calculating impact score:', error)
    }
  }

  private calculateSocialImpact(blueprint: any): number {
    // Simple calculation based on blueprint content
    let score = 50 // Base score
    
    if (blueprint.solutions) {
      score += blueprint.solutions.length * 10
    }
    
    if (blueprint.sdg_alignment) {
      const socialSDGs = blueprint.sdg_alignment.filter((sdg: any) => 
        sdg.sdg.includes('1') || sdg.sdg.includes('2') || sdg.sdg.includes('3') || 
        sdg.sdg.includes('4') || sdg.sdg.includes('5') || sdg.sdg.includes('10')
      )
      score += socialSDGs.length * 5
    }
    
    return Math.min(100, score)
  }

  private calculateEnvironmentalImpact(blueprint: any): number {
    let score = 40 // Base score
    
    if (blueprint.sdg_alignment) {
      const envSDGs = blueprint.sdg_alignment.filter((sdg: any) => 
        sdg.sdg.includes('6') || sdg.sdg.includes('7') || sdg.sdg.includes('13') || 
        sdg.sdg.includes('14') || sdg.sdg.includes('15')
      )
      score += envSDGs.length * 8
    }
    
    return Math.min(100, score)
  }

  private calculateEconomicImpact(blueprint: any): number {
    let score = 45 // Base score
    
    if (blueprint.estimated_budget) {
      score += 20 // Has budget planning
    }
    
    if (blueprint.team_composition) {
      score += blueprint.team_composition.length * 5
    }
    
    return Math.min(100, score)
  }

  private calculateInnovationScore(blueprint: any): number {
    let score = 60 // Base score
    
    if (blueprint.solutions && blueprint.solutions.length > 0) {
      score += blueprint.solutions.length * 8
    }
    
    if (blueprint.roadmap && blueprint.roadmap.length > 0) {
      score += blueprint.roadmap.length * 5
    }
    
    return Math.min(100, score)
  }

  private extractTags(blueprint: any): string[] {
    const tags: string[] = []
    
    if (blueprint.sdg_alignment) {
      blueprint.sdg_alignment.forEach((sdg: any) => {
        if (sdg.sdg.includes('Climate')) tags.push('climate')
        if (sdg.sdg.includes('Education')) tags.push('education')
        if (sdg.sdg.includes('Health')) tags.push('health')
        if (sdg.sdg.includes('Water')) tags.push('water')
        if (sdg.sdg.includes('Energy')) tags.push('energy')
      })
    }
    
    return [...new Set(tags)] // Remove duplicates
  }
}

export class CollaborationService {
  async createRoom(roomData: Omit<CollaborationRoom, 'id' | 'created_at' | 'members'>): Promise<CollaborationRoom> {
    try {
      const room = await db.createCollaborationRoom({
        ...roomData,
        members: []
      })

      // Add creator as owner
      await db.addRoomMember(room.id, {
        user_id: roomData.created_by,
        role: 'owner'
      })

      return room
    } catch (error) {
      console.error('Error creating collaboration room:', error)
      throw error
    }
  }

  async addComment(commentData: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'likes'>): Promise<Comment> {
    try {
      return await db.createComment(commentData)
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }
}

// Export service instances
export const blueprintService = new BlueprintService()
export const collaborationService = new CollaborationService()
