'use client';

import React, { useState, useEffect } from 'react';
import { ProblemInput } from '@/components/ProblemInput';
import { SolutionDisplay } from '@/components/SolutionDisplay';
import { CoCreateRoom } from '@/components/CoCreateRoom';
import { ExportPanel } from '@/components/ExportPanel';
import { AIConfig } from '@/components/AIConfig';
import { ImpactPrediction } from '@/components/ImpactPrediction';
import { SolutionEvolution } from '@/components/SolutionEvolution';
import { GlobalCollaborationMap } from '@/components/GlobalCollaborationMap';
import { SpecializedAIComponent } from '@/components/SpecializedAI';
import { AuthModal } from '@/components/AuthModal';
import { UserProfile } from '@/components/UserProfile';
import { IdeaGenerator } from '@/components/IdeaGenerator';
import { IdeaGallery } from '@/components/IdeaGallery';
import { CollaborationRoom } from '@/components/CollaborationRoom';
import { JoinRoomDialog } from '@/components/JoinRoomDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Blueprint, Idea } from '@/types';
import { Users } from 'lucide-react';

// Import all icons needed

export default function Home() {
  const { user, loading, signOutUser } = useAuth();
  
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'gallery' | 'collaborate' | 'export'>('generate');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [collaborationRoomOpen, setCollaborationRoomOpen] = useState(false);
  const [joinRoomDialogOpen, setJoinRoomDialogOpen] = useState(false);
  const [joinedRoomId, setJoinedRoomId] = useState<string | null>(null);

  // Check for room parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam && currentIdea) {
      setCollaborationRoomOpen(true);
    }
  }, [currentIdea]);

  const handleIdeaGenerated = (idea: Idea) => {
    setCurrentIdea(idea);
    setActiveTab('collaborate');
  };

  const handleIdeaSelect = (idea: Idea) => {
    setCurrentIdea(idea);
    setActiveTab('collaborate');
  };

  const handleCreateRoom = () => {
    if (currentIdea) {
      setCollaborationRoomOpen(true);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    // Store the room ID to join
    setJoinedRoomId(roomId);
    
    // Create a default idea for joining rooms without ideas
    if (!currentIdea) {
      const defaultIdea: Idea = {
        id: roomId,
        title: `Room ${roomId}`,
        problem_text: 'Joining collaboration room',
        summary: 'Collaborative workspace',
        solutions: [],
        roadmap: [],
        partners: [],
        tags: ['collaboration'],
        creator: {
          userId: user?.uid || 'guest',
          name: user?.displayName || 'Guest'
        },
        createdAt: new Date(),
        public: true,
        upvotes: 0,
        remixes: 0
      };
      setCurrentIdea(defaultIdea);
    }
    
    // Open the collaboration room
    setCollaborationRoomOpen(true);
  };

  const handleSignOutUser = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top row - Logo and Auth */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">OpenIdeaX</h1>
              <span className="text-xs sm:text-sm text-gray-500 hidden sm:block">AI-Powered Innovation Platform</span>
            </div>
            
            {/* Mobile: Stack auth buttons vertically, Desktop: horizontal */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              {/* Join Room Button */}
              <button
                onClick={() => setJoinRoomDialogOpen(true)}
                className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 text-sm font-medium"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Join Room</span>
                <span className="sm:hidden">Join</span>
              </button>
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setUserProfileOpen(true)}
                    className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium"
                  >
                    {user.displayName?.charAt(0) || 'U'}
                  </button>
                  <button
                    onClick={handleSignOutUser}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthModalOpen(true);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation */}
          <div className="pb-4">
            <nav className="flex space-x-1 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'generate'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="hidden sm:inline">Generate Ideas</span>
                <span className="sm:hidden">Generate</span>
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'gallery'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="hidden sm:inline">Browse Gallery</span>
                <span className="sm:hidden">Gallery</span>
              </button>
              <button
                onClick={() => setActiveTab('collaborate')}
                disabled={!currentIdea}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'collaborate'
                    ? 'bg-blue-100 text-blue-700'
                    : currentIdea
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="hidden sm:inline">Collaborate</span>
                <span className="sm:hidden">Collab</span>
              </button>
              <button
                onClick={() => setActiveTab('export')}
                disabled={!currentIdea}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'export'
                    ? 'bg-blue-100 text-blue-700'
                    : currentIdea
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="hidden sm:inline">Export & Share</span>
                <span className="sm:hidden">Export</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {activeTab === 'generate' && (
          <IdeaGenerator onIdeaGenerated={handleIdeaGenerated} userId={user?.uid} />
        )}
        
        {activeTab === 'gallery' && (
          <IdeaGallery onIdeaSelect={handleIdeaSelect} />
        )}
        
        {activeTab === 'collaborate' && currentIdea && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{currentIdea.title}</h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">{currentIdea.summary}</p>
                </div>
                <button
                  onClick={handleCreateRoom}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base"
                >
                  Create Collaboration Room
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'export' && currentIdea && (
          <ExportPanel idea={currentIdea} />
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />
      
      <UserProfile
        isOpen={userProfileOpen}
        onClose={() => setUserProfileOpen(false)}
      />

      {/* Join Room Dialog */}
      <JoinRoomDialog
        isOpen={joinRoomDialogOpen}
        onClose={() => setJoinRoomDialogOpen(false)}
        onJoin={handleJoinRoom}
      />

      {/* Collaboration Room Modal */}
      {collaborationRoomOpen && currentIdea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full h-full max-w-7xl">
            <CollaborationRoom
              idea={currentIdea}
              onClose={() => setCollaborationRoomOpen(false)}
              specificRoomId={joinedRoomId || undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}