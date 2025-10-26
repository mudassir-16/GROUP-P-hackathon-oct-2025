# Firebase Setup Guide

## Current Status
✅ **Mock Authentication Active** - The application is currently using mock authentication for development and testing.

## To Enable Real Firebase Authentication:

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `openideax`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication
1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Enable "Google" authentication (optional)

### 3. Get Firebase Configuration
1. Go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web app" icon (`</>`)
4. Register your app with a nickname: `openideax-web`
5. Copy the configuration values

### 4. Update Environment Variables
Replace the placeholder values in `.env.local` with your actual Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### 5. Restart the Application
After updating the environment variables:
```bash
npm run dev
```

## Current Mock Authentication Features:
- ✅ Sign in with Google (mock)
- ✅ Sign up with Email/Password (mock)
- ✅ Sign in with Email/Password (mock)
- ✅ User profile management (mock)
- ✅ Sign out functionality (mock)

## Benefits of Mock Authentication:
- 🚀 **No setup required** - Works immediately
- 🔒 **Safe for development** - No real user data
- 🧪 **Perfect for testing** - All features work
- 📱 **Full functionality** - All AI features accessible

## When to Use Real Firebase:
- 🏢 **Production deployment**
- 👥 **Real user management**
- 💾 **Data persistence**
- 🔐 **Security requirements**

The application works perfectly with mock authentication for development and testing purposes!
