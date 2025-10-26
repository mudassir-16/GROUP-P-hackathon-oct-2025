# OpenIdeaX - AI-Powered Innovation Platform

OpenIdeaX is a comprehensive AI-powered platform that transforms ideas into actionable innovation blueprints through collaborative ideation, real-time collaboration, and intelligent AI assistance.

## 🚀 Features

### Core Features
- **AI Idea Generation**: Generate comprehensive solution blueprints using advanced AI models
- **Real-time Collaboration**: Multi-user collaboration rooms with live editing and chat
- **AI Visual Summaries**: Auto-generated concept illustrations for ideas
- **Idea Gallery**: Browse, search, and manage saved innovation blueprints
- **Export Capabilities**: Export ideas as PDFs or create GitHub repositories
- **Responsive Design**: Works seamlessly across all devices

### AI Capabilities
- **Hybrid AI System**: Multiple AI models (Gemini, DeepSeek, Mock AI) with intelligent fallbacks
- **Contextual Chat**: AI assistant that responds to specific queries with relevant, detailed answers
- **Smart Blueprint Generation**: Creates structured solution concepts, roadmaps, and partner suggestions
- **Visual Concept Generation**: AI-generated concept images for ideas

### Collaboration Features
- **Real-time Editing**: Live collaboration on idea blueprints
- **Multi-user Chat**: Real-time messaging with AI assistance
- **Room Management**: Create and join collaboration rooms
- **Participant Tracking**: See who's online and collaborating
- **Blueprint Synchronization**: Changes sync across all users instantly

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Socket.io
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI Services**: Hugging Face, Gemini, DeepSeek
- **Real-time**: Socket.io
- **Export**: jsPDF, GitHub API

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- API keys for AI services (optional - Mock AI works without keys)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/openideax.git
cd openideax
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# AI Services (Optional - Mock AI works without these)
GEMINI_API_KEY=your_gemini_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
OPENAI_API_KEY=your_openai_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key

# AI Mode (set to true for Mock AI, false for real AI services)
USE_MOCK_AI=true
```

### 4. Start the Development Servers

**Terminal 1 - Socket.io Server:**
```bash
node server.js
```

**Terminal 2 - Next.js Development Server:**
```bash
npm run dev
```

### 5. Open the Application
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Google sign-in)
3. Create a Firestore database
4. Add your domain to authorized domains in Firebase Auth settings

### AI Services Setup (Optional)
- **Gemini**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **DeepSeek**: Get API key from [DeepSeek Platform](https://platform.deepseek.com)
- **Hugging Face**: Get API key from [Hugging Face](https://huggingface.co/settings/tokens)

## 📱 Usage

### Generating Ideas
1. Go to the "Generate Ideas" tab
2. Enter a problem statement
3. Optionally enable AI concept image generation
4. Click "Generate Innovation Blueprint"
5. Review the AI-generated solution

### Collaborating
1. Click "Join Room" to enter a room ID
2. Or create a new collaboration room
3. Share the room ID with others
4. Collaborate in real-time on idea blueprints
5. Use chat with AI assistance (type "hey ai" for AI help)

### Managing Ideas
1. View saved ideas in the "Idea Gallery"
2. Search and filter ideas
3. Export ideas as PDFs
4. Create GitHub repositories from ideas

## 🏗️ Project Structure

```
openideax/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main page
│   ├── components/         # React components
│   │   ├── CollaborationRoom.tsx
│   │   ├── IdeaGenerator.tsx
│   │   ├── IdeaGallery.tsx
│   │   └── ...
│   ├── contexts/           # React contexts
│   ├── lib/               # Utility libraries
│   └── types/             # TypeScript types
├── server.js              # Socket.io server
├── package.json           # Dependencies
└── README.md             # This file
```

## 🔒 Security

- All API keys are stored in environment variables
- `.env.local` is gitignored to prevent accidental commits
- Firebase security rules protect user data
- CORS is properly configured for Socket.io

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- Ensure both Next.js and Socket.io servers are running
- Configure environment variables
- Set up Firebase project for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for backend services
- Hugging Face for AI models
- All open-source contributors

## 📞 Support

For support, email support@openideax.com or create an issue on GitHub.

---

**OpenIdeaX** - Transforming Ideas into Innovation 🚀