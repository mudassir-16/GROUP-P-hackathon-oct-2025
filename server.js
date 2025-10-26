const {
    Server
} = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001"
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Store active rooms
const rooms = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join room
    socket.on('join-room', (data) => {
        const {
            roomId,
            ideaId,
            user,
            blueprint
        } = data;

        socket.join(roomId);

        // Initialize room if it doesn't exist
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                roomId,
                ideaId,
                participants: [],
                chat: [],
                blueprint: blueprint || null
            });
        }

        const room = rooms.get(roomId);

        // Update room blueprint if it doesn't exist and new user has one
        if (!room.blueprint && blueprint) {
            room.blueprint = blueprint;
            console.log(`Room ${roomId} blueprint updated from joining user`);
        }

        // Add participant (avoid duplicates)
        const existingParticipantIndex = room.participants.findIndex(p => p.userId === user.userId);
        const participant = {
            userId: user.userId,
            name: user.name,
            avatar: user.avatar,
            socketId: socket.id,
            joinedAt: new Date()
        };

        if (existingParticipantIndex !== -1) {
            // Update existing participant
            room.participants[existingParticipantIndex] = participant;
        } else {
            // Add new participant
            room.participants.push(participant);
        }

        // Notify all users in the room about the updated participants list
        io.to(roomId).emit('participants-updated', room.participants);

        // Notify others (not the joining user) about the new participant
        socket.to(roomId).emit('user-joined', participant);

        // Send existing blueprint to the new user if it exists
        if (room.blueprint) {
            socket.emit('blueprint-updated', room.blueprint);
            console.log(`Sent existing blueprint to new user ${user.name}`);
        }

        console.log(`User ${user.name} joined room ${roomId}`);
    });

    // Handle messages
    socket.on('message', (message) => {
        const roomId = message.roomId;
        const room = rooms.get(roomId);

        if (room) {
            room.chat.push(message);
            io.to(roomId).emit('message', message);
        }
    });

    // Handle blueprint updates
    socket.on('update-blueprint', (blueprint) => {
        const roomId = blueprint.roomId || Object.keys(socket.rooms)[1]; // Get room from socket
        const room = rooms.get(roomId);

        if (room) {
            room.blueprint = blueprint;
            // Send to ALL users in the room (including the sender)
            io.to(roomId).emit('blueprint-updated', blueprint);
            console.log(`Blueprint updated in room ${roomId}`);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        // Remove user from all rooms
        rooms.forEach((room, roomId) => {
            const participantIndex = room.participants.findIndex(p => p.socketId === socket.id);
            if (participantIndex !== -1) {
                const participant = room.participants[participantIndex];
                room.participants.splice(participantIndex, 1);
                socket.to(roomId).emit('user-left', participant.userId);
                socket.to(roomId).emit('participants-updated', room.participants);
            }
        });
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Socket.io server running on port ${PORT}`);
});