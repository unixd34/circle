const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const publicFolderPath = path.join(__dirname, 'public');
  const filePath = req.url === '/' ? '/index.html' : req.url;
  const fullPath = path.join(publicFolderPath, filePath);

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('404 Not Found');
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
});

const io = socketIO(server);

let players = {};
let bullets = [];

// Socket.IO connection handling
io.on('connection', (socket) => {
  players[socket.id] = {}; // Create an empty object for the connected player

  socket.on('move', (playerId, username, color, playerX, playerY, health, maxHealth) => {
    players[socket.id] = {
      id: playerId,
      username: username,
      color: color,
      x: playerX,
      y: playerY,
      radius: 6,
      speed: 10,
      vx: 0,
      vy: 0,
      health: health,
      maxHealth: maxHealth,
    };
    io.emit('enemies', players); // Emit updated player positions to all clients
  });

  socket.on('shoot', (bullet) => {
    bullet.id = socket.id;
    bullets.push(bullet);
    io.emit('newBullet', bullet); // Emit the new bullet to all clients
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
  });
});

const port = 3000; // You can change the port number as per your requirement

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
