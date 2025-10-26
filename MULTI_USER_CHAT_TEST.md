# 🧪 Multi-User Chat Test Guide

## 🚀 Quick Start for Multi-User Testing

### Step 1: Start Both Servers

**Terminal 1 - Next.js App:**
```bash
npm run dev
```
App will run on: http://localhost:3000

**Terminal 2 - Socket.io Server:**
```bash
node server.js
```
Socket.io will run on: http://localhost:3001

### Step 2: Open Collaboration Room

1. **In Browser Tab 1:**
   - Open http://localhost:3000
   - Sign in with Google
   - Generate an idea or browse gallery
   - Click "Create Collaboration Room"

2. **Copy the Room Link:**
   - Click the "Copy Link" button in the room header
   - Or copy the URL from the address bar

### Step 3: Open Second User (Different Browser/Tab)

**Option A: Same Browser, Different Tab**
- Open new incognito/private window
- Paste the room link
- Sign in with different Google account (or use guest mode)

**Option B: Different Browser**
- Open Chrome, Edge, Firefox, etc.
- Paste the room link
- Sign in

**Option C: Mobile Device**
- Open browser on phone/tablet
- Navigate to your computer's IP: http://192.168.0.68:3000
- Paste the room link

### Step 4: Test Multi-User Features

#### ✅ **Test 1: Connection Status**
- Both users should see "Connected (2 online)"
- Green pulsing indicator shows live connection

#### ✅ **Test 2: Participant Display**
- Both users should see each other's avatars in the participants list
- Real names and photos should appear
- Green online indicators visible

#### ✅ **Test 3: Real-time Chat**
- User 1 types a message → User 2 sees it instantly
- User 2 types a message → User 1 sees it instantly
- Messages show sender avatar and name
- Timestamps update in real-time

#### ✅ **Test 4: AI Chat**
- Either user can ask AI questions
- AI responses appear for both users
- AI provides helpful suggestions

#### ✅ **Test 5: Live Blueprint Editing**
- User 1 edits problem statement → User 2 sees changes live
- User 2 edits solutions → User 1 sees updates
- Real-time synchronization

#### ✅ **Test 6: User Join/Leave**
- Close one browser tab
- Other user should see "1 online" update
- Reopen the closed tab
- User rejoins, count updates to "2 online"

## 🎯 Expected Behavior

### ✅ Successful Multi-User Chat
```
User 1: "Hello, what do you think about this solution?"
AI: "This solution looks promising. Here are some considerations..."
User 2: "I agree, but we should add risk mitigation"
User 1: "Great idea! Let's add that to the roadmap"
```

### ✅ Real-time Updates
- Messages appear in < 1 second
- Blueprint edits sync immediately
- Participant count updates live
- Connection status shows "Connected"

## 🐛 Troubleshooting

### If Users Can't See Each Other

1. **Check Server is Running:**
   ```bash
   # Terminal should show:
   Socket.io server running on port 3001
   ```

2. **Check Console for Errors:**
   - Open browser console (F12)
   - Look for Socket.io connection errors
   - Verify "Connected to collaboration room" message

3. **Check Network:**
   - Ensure both users on same network (for local testing)
   - Try refreshing both browser tabs

### If Messages Not Syncing

1. **Restart Socket.io Server:**
   ```bash
   # Stop: Ctrl+C
   # Restart: node server.js
   ```

2. **Check Room ID:**
   - Both users must use same room URL
   - Copy-paste the exact link

3. **Clear Browser Cache:**
   - Hard refresh: Ctrl+Shift+R
   - Or clear cache in browser settings

## 📱 Test Scenarios

### Scenario 1: Basic Chat
1. User 1: "Test message 1"
2. User 2: "I received it!"
3. User 1: "Perfect!"

### Scenario 2: AI Interaction
1. User 1: "How can we improve this?"
2. AI responds with suggestions
3. User 2: "What about scalability?"
4. AI provides scalability tips

### Scenario 3: Simultaneous Editing
1. User 1 edits solution description
2. User 2 edits problem statement (at same time)
3. Both see each other's changes live

### Scenario 4: Network Resilience
1. User 1 refreshes page
2. User 2 should still be connected
3. User 1 reconnects automatically
4. Both users back in sync

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Both users see "Connected (2 online)"
- ✅ Messages appear instantly in both browsers
- ✅ AI responds to both users
- ✅ Blueprint edits sync in real-time
- ✅ Avatars and names show correctly
- ✅ No console errors

## 🚀 Quick Test Script

Run this in browser console to test:
```javascript
// Test Socket.io connection
socket = io('http://localhost:3001');
socket.on('connect', () => console.log('✅ Connected'));
socket.emit('message', {content: 'Test'});
```

---

**Multi-user chat is ready! Just start both servers and open two browser windows.** 🚀
