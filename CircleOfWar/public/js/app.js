const socket = io();
const arena = document.getElementById('arena');
const joinAgain = document.getElementById('joinAgain');
const joinContainer = document.getElementById('joinContainer');
joinContainer.style.display = 'block';
const ctx = arena.getContext('2d');
var vignette = document.getElementById("vignette");
vignette.style.display = 'none';
let arenaWidth = 1200;
let arenaHeight = 600;

// Create a text element
// Add text to the top left corner
const instructions = document.createElement('div');
instructions.style.position = 'absolute';
instructions.style.top = '10px';
instructions.style.left = '10px';
instructions.textContent = 'Use WASD to move, click to shoot!';
arena.appendChild(instructions);

socket.disconnect();
let spawning = document.getElementById('spawning');

let circle = null; // Declare circle outside the event listener

joinAgain.addEventListener('click', function(e) {
  let username = document.getElementById('username').value;
  let color = document.getElementById('color').value;
  
  
  if (username === '' || color === '') {
    alert('Username is empty! or Select Color!');
  } else {
    spawning.style.display = 'block';
    joinContainer.style.display = 'none';
    var countdown = 3;
    var countdownInterval = setInterval(() => {
      if (countdown > 0) {
        spawning.innerHTML = countdown;
        countdown--;
      } else {
        clearInterval(countdownInterval); // Stop the countdown interval
        spawning.style.display = 'none';
        socket.connect();
        joinContainer.style.display = 'none';
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        setTimeout(() => {
          window.addEventListener('click', shootBullet);
        }, 250);
        console.log(username);
        
        circle = { // Assign the circle object inside the event listener
          username: username,
          x: Math.random() * arenaWidth,
          y: Math.random() * arenaHeight,
          radius: 6,
          speed: 10,
          vx: 0,
          vy: 0,
          color: color,
          health: 10,
          maxHealth: 10,
        };
      }
    }, 1000);
  }
});


let players = {};
let bullets = [];
let enemyBullets = [];
const particles = [];

window.removeEventListener('keydown', handleKeyDown);
window.removeEventListener('keyup', handleKeyUp);
window.removeEventListener('click', shootBullet);

function update() {
    if (circle) { // Check if circle is defined before updating
        // Calculate the target velocity based on keyStates
        const targetVx = (keyStates.KeyD ? circle.speed : 0) - (keyStates.KeyA ? circle.speed : 0);
        const targetVy = (keyStates.KeyS ? circle.speed : 0) - (keyStates.KeyW ? circle.speed : 0);
        // Apply easing to the velocity
        circle.vx += (targetVx - circle.vx) * 0.1;
        circle.vy += (targetVy - circle.vy) * 0.1;
        circle.x += circle.vx;
        circle.y += circle.vy;
        updateBullets();
        handleCollision(circle, arenaWidth, arenaHeight); // Check collision after updating position
        draw();
        checkCollisions();
        renderParticles();
        // Send player movement to the server
        socket.emit('move', socket.id, circle.username, circle.color, circle.x, circle.y, circle.health, circle.maxHealth);
        requestAnimationFrame(update);
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            if (particle.radius <= 0) {
                particles.splice(i, 1);
                i--;
                continue;
            }
            particle.update();
        }
    } else {
        requestAnimationFrame(update);
    }
}

socket.on('connect', () => {
    console.log('Connected to server', socket.id);
});

socket.on('enemies', (playerPositions) => {
    players = playerPositions;
    for (let enemyId in players) {
        if (enemyId !== socket.id) {
            const enemy = players[enemyId];
        }
    }
});

socket.on('newBullet', (bullet) => {
    if (bullet.id !== socket.id) {
        enemyBullets.push(bullet);
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Start the update loop
update();
