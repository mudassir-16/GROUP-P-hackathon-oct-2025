'use client';

import React, { useState, useEffect } from 'react';
import { User, Calendar, TrendingUp, Users, Award, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBlueprints, getUserCollaborations } from '@/lib/firebase';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserStats {
  blueprints: number;
  collaborations: number;
  contributions: number;
  impact: number;
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    blueprints: 0,
    collaborations: 0,
    contributions: 0,
    impact: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      fetchUserStats();
    }
  }, [user, isOpen]);

  const fetchUserStats = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch user's blueprints and collaborations
      const [blueprints, collaborations] = await Promise.all([
        getUserBlueprints(user.uid),
        getUserCollaborations(user.uid)
      ]);

      // Calculate impact score based on blueprints and collaborations
      const impactScore = Math.min(100, (blueprints.length * 10) + (collaborations.length * 5));

      setStats({
        blueprints: blueprints.length,
        collaborations: collaborations.length,
        contributions: blueprints.length + collaborations.length,
        impact: impactScore,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {user.displayName || 'User'}
              </h3>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">User ID: {user.uid}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Blueprints</span>
              </div>
              {loading ? (
                <div className="animate-pulse bg-blue-200 h-8 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-blue-900">{stats.blueprints}</p>
              )}
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Collaborations</span>
              </div>
              {loading ? (
                <div className="animate-pulse bg-green-200 h-8 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-green-900">{stats.collaborations}</p>
              )}
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Contributions</span>
              </div>
              {loading ? (
                <div className="animate-pulse bg-purple-200 h-8 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-purple-900">{stats.contributions}</p>
              )}
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">Impact Score</span>
              </div>
              {loading ? (
                <div className="animate-pulse bg-orange-200 h-8 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-orange-900">{stats.impact}</p>
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Keep innovating and making a positive impact! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}