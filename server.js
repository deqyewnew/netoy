// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // разрешаем подключение из любого источника
        methods: ['GET', 'POST'],
    }
});

app.use(cors());
app.use(express.json());

// Соединение с базой данных MongoDB
mongoose.connect('mongodb://localhost/netoy-discord', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

// WebSocket-соединение для реального времени
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
    });

    socket.on('message', (data) => {
        io.to(data.room).emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.get('/', (req, res) => {
    res.send('Netoy Discord Clone Backend');
});

server.listen(5000, () => {
    console.log('Server running on port 5000');
});
