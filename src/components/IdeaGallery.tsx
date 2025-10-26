'use client';

import React, { useState, useEffect } from 'react';
import { Idea } from '@/types';
import { 
  Search, 
  Filter, 
  Heart, 
  Share2, 
  ExternalLink,
  Clock,
  Users,
  Tag,
  TrendingUp,
  Star,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

interface IdeaGalleryProps {
  onIdeaSelect?: (idea: Idea) => void;
}

export function IdeaGallery({ onIdeaSelect }: IdeaGalleryProps) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();
  }, []);

  useEffect(() => {
    filterAndSortIdeas();
  }, [ideas, searchQuery, selectedTags, sortBy]);

  const fetchIdeas = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/ideas');
      if (response.ok) {
        const data = await response.json();
        setIdeas(data.ideas || []);
      }
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortIdeas = () => {
    let filtered = [...ideas];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(idea => 
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.problem_text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(idea =>
        selectedTags.some(tag => idea.tags.includes(tag))
      );
    }

    // Sort ideas
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return b.upvotes - a.upvotes;
        case 'trending':
          return (b.upvotes + b.remixes) - (a.upvotes + a.remixes);
        default:
          return 0;
      }
    });

    setFilteredIdeas(filtered);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleUpvote = async (ideaId: string) => {
    // In a real app, this would make an API call
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId 
        ? { ...idea, upvotes: idea.upvotes + 1 }
        : idea
    ));
  };

  const handleRemix = (idea: Idea) => {
    // Create a remix of the idea
    const remixedIdea: Idea = {
      ...idea,
      id: `idea_${Date.now()}`,
      title: `${idea.title} (Remix)`,
      creator: {
        userId: 'current_user',
        name: 'You'
      },
      createdAt: new Date(),
      upvotes: 0,
      remixes: 0
    };
    
    onIdeaSelect?.(remixedIdea);
  };

  const allTags = Array.from(new Set(ideas.flatMap(idea => idea.tags)));

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Innovation Gallery</h2>
        <p className="text-base sm:text-lg text-gray-600">
          Discover, collaborate, and remix open-source solutions to global challenges
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 sm:mt-6">
          <div className="flex items-center space-x-2 mb-2 sm:mb-3">
            <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Filter by tags:</span>
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredIdeas.map(idea => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onSelect={onIdeaSelect}
            onUpvote={handleUpvote}
            onRemix={handleRemix}
          />
        ))}
      </div>

      {filteredIdeas.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No ideas found</h3>
          <p className="text-sm sm:text-base text-gray-600">
            Try adjusting your search or filters to find more ideas.
          </p>
        </div>
      )}
    </div>
  );
}

interface IdeaCardProps {
  idea: Idea;
  onSelect?: (idea: Idea) => void;
  onUpvote: (ideaId: string) => void;
  onRemix: (idea: Idea) => void;
}

function IdeaCard({ idea, onSelect, onUpvote, onRemix }: IdeaCardProps) {
  const [isUpvoted, setIsUpvoted] = useState(false);

  const handleUpvote = () => {
    if (!isUpvoted) {
      onUpvote(idea.id);
      setIsUpvoted(true);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
      {/* Concept Image */}
      {idea.conceptImageUrl ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={idea.conceptImageUrl}
            alt={`Concept illustration for ${idea.title}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <div className="flex items-center space-x-1 px-2 py-1 bg-white bg-opacity-90 rounded-full">
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span className="text-xs text-purple-600 font-medium">AI Generated</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="w-12 h-12 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-purple-600 font-medium">Concept Image</p>
            <p className="text-xs text-purple-500">Generate with AI</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 flex-1 min-w-0">{idea.title}</h3>
          <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
            <button
              onClick={handleUpvote}
              className={`p-1 rounded-full transition-colors ${
                isUpvoted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isUpvoted ? 'fill-current' : ''}`} />
            </button>
            <span className="text-xs sm:text-sm text-gray-600">{idea.upvotes}</span>
          </div>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">{idea.summary}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
          {idea.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {idea.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{idea.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {new Date(idea.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {idea.remixes} remixes
            </div>
          </div>
          <div className="flex items-center">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            {idea.solutions.length} solutions
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={() => onSelect?.(idea)}
            className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
          >
            View Details
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => onRemix(idea)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm font-medium"
            >
              Remix
            </button>
            <button className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 sm:px-6 py-2 sm:py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {idea.creator.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs sm:text-sm text-gray-600">{idea.creator.name}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Trending</span>
          </div>
        </div>
      </div>
    </div>
  );
}
