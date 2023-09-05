import express from "express";
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});

app.use(cors());

app.get('/', (req, res) => {
  res.send("Hello world");
});

io.on('connection', (socket) => {
  console.log('client connected');
  const id = socket.id.slice(0, 7);

  socket.on('chat message', (message) => {
    socket.broadcast.emit('chat message', {
      id,
      message
    });
  })
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log('server running on PORT' + PORT);
})

