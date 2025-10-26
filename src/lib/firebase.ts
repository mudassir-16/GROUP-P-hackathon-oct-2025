import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return apiKey && apiKey !== 'your_firebase_api_key';
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDIMowFrz_9Vo45teHyT2xy6yCcxFwOxsQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "openideax-d222b.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "openideax-d222b",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "openideax-d222b.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "636319085979",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:636319085979:web:2d1455e146615639c89d3e",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Z0NTGZJ4SM"
};

// Only initialize Firebase if properly configured
let app: any = null;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigured()) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.log('Firebase not configured, using mock authentication');
}

export { auth, db };

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  if (!auth || !db) {
    throw new Error('Firebase not configured - using mock authentication');
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create or update user profile
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    }, { merge: true });
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  if (!auth) {
    console.log('Firebase auth not configured, using mock authentication');
    return;
  }
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    console.log('Firebase auth not configured, using mock authentication');
    // Return a mock unsubscribe function
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// User profile functions
export const createUserProfile = async (user: User, additionalData: any = {}) => {
  if (!user || !db) {
    console.log('Firebase not configured, skipping user profile creation');
    return null;
  }
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();
    
    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }
  
  return userRef;
};

// Blueprint functions
export const saveBlueprint = async (blueprint: any, userId: string) => {
  if (!db) {
    console.log('Firebase not configured, skipping blueprint save');
    return null;
  }
  try {
    const blueprintData = {
      ...blueprint,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const docRef = await addDoc(collection(db, 'blueprints'), blueprintData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving blueprint:', error);
    throw error;
  }
};

export const getUserBlueprints = async (userId: string) => {
  if (!db) {
    console.log('Firebase not configured');
    return [];
  }
  
  try {
    // Query without orderBy to avoid requiring an index
    const q = query(
      collection(db, 'blueprints'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const blueprints = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort in JavaScript to avoid index requirement
    return blueprints.sort((a, b) => {
      const aDate = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const bDate = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return bDate.getTime() - aDate.getTime();
    });
  } catch (error) {
    console.error('Error getting user blueprints:', error);
    return [];
  }
};

export const getPublicBlueprints = async (limitCount: number = 10) => {
  try {
    const q = query(
      collection(db, 'blueprints'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting public blueprints:', error);
    throw error;
  }
};

// Collaboration functions
export const joinProject = async (projectId: string, userId: string, userData: any) => {
  try {
    const collaborationData = {
      projectId,
      userId,
      userData,
      joinedAt: new Date(),
      status: 'active'
    };
    
    const docRef = await addDoc(collection(db, 'collaborations'), collaborationData);
    return docRef.id;
  } catch (error) {
    console.error('Error joining project:', error);
    throw error;
  }
};

export const getUserCollaborations = async (userId: string) => {
  if (!db) {
    console.log('Firebase not configured');
    return [];
  }
  
  try {
    // Query without orderBy to avoid requiring an index
    const q = query(
      collection(db, 'collaborations'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const collaborations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort in JavaScript to avoid index requirement
    return collaborations.sort((a, b) => {
      const aDate = a.joinedAt?.toDate?.() || new Date(a.joinedAt);
      const bDate = b.joinedAt?.toDate?.() || new Date(b.joinedAt);
      return bDate.getTime() - aDate.getTime();
    });
  } catch (error) {
    console.error('Error getting user collaborations:', error);
    return [];
  }
};
