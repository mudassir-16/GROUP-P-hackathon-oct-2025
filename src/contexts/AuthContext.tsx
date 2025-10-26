'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { signInWithGoogle, signOutUser, onAuthStateChange, createUserProfile } from '@/lib/firebase';
import { mockAuth, MockUser } from '@/lib/mock-auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [useMockAuth, setUseMockAuth] = useState(false);

  useEffect(() => {
    // Check if Firebase is properly configured
    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const isFirebaseConfigured = firebaseApiKey && firebaseApiKey !== 'your_firebase_api_key';
    
    if (!isFirebaseConfigured) {
      console.log('Firebase not configured, using mock authentication');
      setUseMockAuth(true);
      
      // Set up mock auth listener
      const unsubscribe = mockAuth.onAuthStateChanged((mockUser) => {
        setUser(mockUser as User | null);
        setLoading(false);
      });
      
      return () => unsubscribe();
    } else {
      // Use real Firebase authentication
      const unsubscribe = onAuthStateChange(async (user) => {
        if (user) {
          // Create or update user profile in Firestore
          await createUserProfile(user);
        }
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      setLoading(true);
      if (useMockAuth) {
        await mockAuth.signInWithGoogle();
      } else {
        await signInWithGoogle();
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOutUser = async () => {
    try {
      setLoading(true);
      if (useMockAuth) {
        await mockAuth.signOut();
      } else {
        await signOutUser();
      }
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle: handleSignInWithGoogle,
    signOutUser: handleSignOutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}