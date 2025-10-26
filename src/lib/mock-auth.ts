// Mock authentication system for development
export interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export class MockAuth {
  private static instance: MockAuth;
  private currentUser: MockUser | null = null;
  private listeners: Array<(user: MockUser | null) => void> = [];

  public static getInstance(): MockAuth {
    if (!MockAuth.instance) {
      MockAuth.instance = new MockAuth();
    }
    return MockAuth.instance;
  }

  // Mock sign in with Google
  async signInWithGoogle(): Promise<MockUser> {
    const user: MockUser = {
      uid: 'mock-user-123',
      email: 'user@example.com',
      displayName: 'Demo User',
      photoURL: null
    };
    
    this.currentUser = user;
    this.notifyListeners();
    return user;
  }

  // Mock sign in with email/password
  async signInWithEmailAndPassword(email: string, password: string): Promise<MockUser> {
    const user: MockUser = {
      uid: 'mock-user-456',
      email: email,
      displayName: email.split('@')[0],
      photoURL: null
    };
    
    this.currentUser = user;
    this.notifyListeners();
    return user;
  }

  // Mock sign up with email/password
  async createUserWithEmailAndPassword(email: string, password: string): Promise<MockUser> {
    const user: MockUser = {
      uid: 'mock-user-789',
      email: email,
      displayName: email.split('@')[0],
      photoURL: null
    };
    
    this.currentUser = user;
    this.notifyListeners();
    return user;
  }

  // Mock sign out
  async signOut(): Promise<void> {
    this.currentUser = null;
    this.notifyListeners();
  }

  // Get current user
  getCurrentUser(): MockUser | null {
    return this.currentUser;
  }

  // Add auth state listener
  onAuthStateChanged(callback: (user: MockUser | null) => void): () => void {
    this.listeners.push(callback);
    // Call immediately with current user
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentUser));
  }
}

export const mockAuth = MockAuth.getInstance();
