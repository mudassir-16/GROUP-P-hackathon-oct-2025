import { API_CONFIG, SDG_GOALS } from '@/lib/config'

export interface SDGIndicator {
  id: string
  title: string
  description: string
  target: string
  goal: number
}

export interface SDGData {
  goal: number
  title: string
  description: string
  indicators: SDGIndicator[]
  alignment_score: number
}

export async function fetchSDGData(): Promise<SDGData[]> {
  try {
    const response = await fetch(`${API_CONFIG.SDG.API_URL}/Goal/List`, {
      headers: {
        'Accept': 'application/json',
        ...(API_CONFIG.SDG.API_KEY && { 'Authorization': `Bearer ${API_CONFIG.SDG.API_KEY}` })
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch SDG data')
    }

    const data = await response.json()
    return data.map((goal: any) => ({
      goal: goal.code,
      title: goal.title,
      description: goal.description,
      indicators: [],
      alignment_score: 0
    }))
  } catch (error) {
    console.error('Error fetching SDG data:', error)
    // Return fallback data
    return SDG_GOALS.map(goal => ({
      goal: goal.id,
      title: goal.title,
      description: `Sustainable Development Goal ${goal.id}`,
      indicators: [],
      alignment_score: 0
    }))
  }
}

export async function calculateSDGAlignment(blueprint: any): Promise<SDGData[]> {
  try {
    // This would typically use AI to analyze the blueprint and calculate alignment
    // For now, we'll return mock data based on the blueprint content
    
    const sdgData = await fetchSDGData()
    
    // Simple keyword-based alignment calculation
    const blueprintText = JSON.stringify(blueprint).toLowerCase()
    
    return sdgData.map(sdg => {
      let alignment_score = 0
      
      // Basic keyword matching for alignment calculation
      const keywords = {
        1: ['poverty', 'poor', 'income', 'economic'],
        2: ['hunger', 'food', 'nutrition', 'agriculture'],
        3: ['health', 'medical', 'wellness', 'disease'],
        4: ['education', 'learning', 'school', 'knowledge'],
        5: ['gender', 'equality', 'women', 'diversity'],
        6: ['water', 'sanitation', 'clean', 'hygiene'],
        7: ['energy', 'renewable', 'solar', 'wind'],
        8: ['work', 'employment', 'economic', 'growth'],
        9: ['infrastructure', 'innovation', 'technology', 'industry'],
        10: ['inequality', 'inclusion', 'equity', 'access'],
        11: ['cities', 'urban', 'community', 'sustainable'],
        12: ['consumption', 'production', 'waste', 'recycling'],
        13: ['climate', 'carbon', 'emissions', 'environment'],
        14: ['ocean', 'marine', 'water', 'biodiversity'],
        15: ['land', 'forest', 'ecosystem', 'biodiversity'],
        16: ['peace', 'justice', 'institutions', 'governance'],
        17: ['partnership', 'collaboration', 'cooperation', 'global']
      }
      
      const goalKeywords = keywords[sdg.goal as keyof typeof keywords] || []
      const matches = goalKeywords.filter(keyword => blueprintText.includes(keyword))
      alignment_score = Math.min(100, (matches.length / goalKeywords.length) * 100)
      
      return {
        ...sdg,
        alignment_score: Math.round(alignment_score)
      }
    }).filter(sdg => sdg.alignment_score > 0)
    
  } catch (error) {
    console.error('Error calculating SDG alignment:', error)
    return []
  }
}
