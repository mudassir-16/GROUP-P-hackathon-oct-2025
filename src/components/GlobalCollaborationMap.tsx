'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Users, 
  MapPin, 
  TrendingUp, 
  Clock, 
  Star,
  Filter,
  Search,
  RefreshCw,
  Eye,
  MessageCircle,
  Heart
} from 'lucide-react';

interface ActiveProject {
  id: string;
  title: string;
  description: string;
  category: string;
  location: {
    country: string;
    city: string;
    coordinates: [number, number];
  };
  participants: number;
  impact: number;
  status: 'active' | 'planning' | 'completed';
  lastActivity: Date;
  tags: string[];
  sdgGoals: number[];
  collaborationOpportunities: string[];
}

interface CollaborationMetrics {
  totalProjects: number;
  activeParticipants: number;
  globalImpact: number;
  collaborationRate: number;
  averageProjectSize: number;
}

export function GlobalCollaborationMap() {
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ActiveProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<ActiveProject | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    sdgGoal: 'all',
    search: ''
  });
  const [metrics, setMetrics] = useState<CollaborationMetrics>({
    totalProjects: 0,
    activeParticipants: 0,
    globalImpact: 0,
    collaborationRate: 0,
    averageProjectSize: 0
  });

  useEffect(() => {
    // Generate mock data for demonstration
    const mockProjects: ActiveProject[] = [
      {
        id: '1',
        title: 'Clean Water Access in Rural India',
        description: 'AI-powered water purification system for rural communities',
        category: 'Environment',
        location: {
          country: 'India',
          city: 'Mumbai',
          coordinates: [19.0760, 72.8777]
        },
        participants: 45,
        impact: 8.5,
        status: 'active',
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['AI', 'Water', 'Rural'],
        sdgGoals: [6, 3, 11],
        collaborationOpportunities: ['Technical expertise', 'Local partnerships', 'Funding']
      },
      {
        id: '2',
        title: 'Educational Platform for Refugees',
        description: 'Mobile learning platform for displaced communities',
        category: 'Education',
        location: {
          country: 'Jordan',
          city: 'Amman',
          coordinates: [31.9454, 35.9284]
        },
        participants: 32,
        impact: 9.2,
        status: 'active',
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        tags: ['Education', 'Mobile', 'Refugees'],
        sdgGoals: [4, 10, 16],
        collaborationOpportunities: ['Content creation', 'Translation', 'Technical support']
      },
      {
        id: '3',
        title: 'Sustainable Energy for Off-Grid Communities',
        description: 'Solar power solutions for remote areas',
        category: 'Energy',
        location: {
          country: 'Kenya',
          city: 'Nairobi',
          coordinates: [-1.2862, 36.8172]
        },
        participants: 28,
        impact: 7.8,
        status: 'planning',
        lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        tags: ['Solar', 'Energy', 'Rural'],
        sdgGoals: [7, 13, 1],
        collaborationOpportunities: ['Engineering', 'Local installation', 'Maintenance']
      },
      {
        id: '4',
        title: 'Mental Health Support Network',
        description: 'AI-powered mental health support for remote workers',
        category: 'Health',
        location: {
          country: 'United States',
          city: 'San Francisco',
          coordinates: [37.7749, -122.4194]
        },
        participants: 67,
        impact: 8.9,
        status: 'active',
        lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000),
        tags: ['Mental Health', 'AI', 'Remote Work'],
        sdgGoals: [3, 8, 10],
        collaborationOpportunities: ['Psychology expertise', 'AI development', 'User research']
      },
      {
        id: '5',
        title: 'Food Waste Reduction System',
        description: 'Smart food distribution network to reduce waste',
        category: 'Environment',
        location: {
          country: 'Germany',
          city: 'Berlin',
          coordinates: [52.5200, 13.4050]
        },
        participants: 41,
        impact: 8.1,
        status: 'active',
        lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000),
        tags: ['Food', 'Waste', 'Distribution'],
        sdgGoals: [2, 12, 13],
        collaborationOpportunities: ['Logistics', 'Local partnerships', 'Technology']
      }
    ];

    setProjects(mockProjects);
    setFilteredProjects(mockProjects);
    
    // Calculate metrics
    const totalParticipants = mockProjects.reduce((sum, project) => sum + project.participants, 0);
    const averageImpact = mockProjects.reduce((sum, project) => sum + project.impact, 0) / mockProjects.length;
    
    setMetrics({
      totalProjects: mockProjects.length,
      activeParticipants: totalParticipants,
      globalImpact: averageImpact,
      collaborationRate: 0.75,
      averageProjectSize: totalParticipants / mockProjects.length
    });
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (filters.category !== 'all') {
      filtered = filtered.filter(project => project.category === filters.category);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(project => project.status === filters.status);
    }

    if (filters.sdgGoal !== 'all') {
      filtered = filtered.filter(project => 
        project.sdgGoals.includes(parseInt(filters.sdgGoal))
      );
    }

    if (filters.search) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    setFilteredProjects(filtered);
  }, [filters, projects]);

  const categories = ['all', 'Environment', 'Education', 'Health', 'Energy', 'Technology'];
  const statuses = ['all', 'active', 'planning', 'completed'];
  const sdgGoals = ['all', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Global Collaboration Map</h2>
              <p className="text-gray-600">Discover and connect with innovation projects worldwide</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.totalProjects}</div>
            <div className="text-sm text-gray-600">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{metrics.activeParticipants}</div>
            <div className="text-sm text-gray-600">Participants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{metrics.globalImpact.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avg Impact</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{(metrics.collaborationRate * 100).toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Collaboration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{metrics.averageProjectSize.toFixed(0)}</div>
            <div className="text-sm text-gray-600">Avg Team Size</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Search projects..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SDG Goal</label>
              <select
                value={filters.sdgGoal}
                onChange={(e) => setFilters(prev => ({ ...prev, sdgGoal: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sdgGoals.map(goal => (
                  <option key={goal} value={goal}>
                    {goal === 'all' ? 'All SDG Goals' : `Goal ${goal}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Project List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location.city}, {project.location.country}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{project.participants} participants</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Impact: {project.impact}/10</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'planning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{project.impact}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    {project.lastActivity.toLocaleDateString()}
                  </span>
                </div>
              </div>

              {project.collaborationOpportunities.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Collaboration Opportunities</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.collaborationOpportunities.slice(0, 3).map((opportunity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {opportunity}
                      </span>
                    ))}
                    {project.collaborationOpportunities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{project.collaborationOpportunities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No projects found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedProject.title}</h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">{selectedProject.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Location:</span>
                  <p className="text-gray-600">{selectedProject.location.city}, {selectedProject.location.country}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Participants:</span>
                  <p className="text-gray-600">{selectedProject.participants}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Impact Score:</span>
                  <p className="text-gray-600">{selectedProject.impact}/10</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <p className="text-gray-600 capitalize">{selectedProject.status}</p>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">SDG Goals:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedProject.sdgGoals.map(goal => (
                    <span
                      key={goal}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      Goal {goal}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Collaboration Opportunities:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedProject.collaborationOpportunities.map((opportunity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {opportunity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Join Project</span>
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Follow</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
