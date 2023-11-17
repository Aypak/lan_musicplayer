const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const mp3FilePath = path.join(__dirname, 'song.mp3');

// Serve the frontend
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Send the initial state to the client
  socket.emit('initialState', { isPlaying: false, currentTime: 0 });

  // Listen for play event
  socket.on('play', () => {
    // Emit play event to all clients
    io.emit('play');
    console.log('Play event received from a client');
  });

  // Listen for pause event
  socket.on('pause', () => {
    // Emit pause event to all clients
    io.emit('pause');
    console.log('Pause event received from a client');
  });

  // Listen for seek event
  socket.on('seek', (time) => {
    // Emit seek event to all clients
    io.emit('seek', time);
    console.log(`Seek event received from a client. New time: ${time}`);
  });
});

// Serve the mp3 file as a stream
app.get('/', (req, res) => {
  const stat = fs.statSync(mp3FilePath);
  const range = req.headers.range;

  const readStream = fs.createReadStream(mp3FilePath);

  // Set the content headers
  res.writeHead(200, {
    'Content-Type': 'audio/mpeg',
    'Content-Length': stat.size,
  });

  // Pipe the stream
  readStream.pipe(res);

  console.log('Audio stream requested by a client');
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Initialize ffmpeg for duration retrieval
ffmpeg.setFfmpegPath(require('@ffmpeg-installer/ffmpeg').path);
const command = ffmpeg();
command.input(mp3FilePath);
command.ffprobe((err, metadata) => {
  if (err) {
    console.error('Error retrieving audio duration:', err);
  } else {
    // Broadcast duration to all clients
    io.emit('duration', metadata.format.duration);
    console.log(`Audio duration: ${metadata.format.duration} seconds`);
  }
});
