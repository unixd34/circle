let canShoot = true; // Flag to track whether the player can shoot
function shootBullet(event) {
  if (!canShoot) {
    return; // Exit the function if the player cannot shoot yet
  }

  const rect = arena.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const angle = Math.atan2(mouseY - circle.y, mouseX - circle.x);

  const bulletCount = 1; // Number of bullets
  const bulletSpeed = 40; // Speed of the bullets
  const maxDeviation = Math.PI / 48; // Maximum angle deviation from the original angle

  for (let i = 0; i < bulletCount; i++) {
    const deviation = (Math.random() * 2 - 1) * maxDeviation; // Random angle deviation
    const bulletAngle = angle + deviation;

    const bullet = {
      id: socket.id,
      x: circle.x,
      y: circle.y,
      vx: Math.cos(bulletAngle) * bulletSpeed,
      vy: Math.sin(bulletAngle) * bulletSpeed,
      radius: 6,
    };

    var audio = new Audio('../sound/shoot2.mp3'); // Replace 'path_to_sound_file.mp3' with the actual file path
    audio.play();

    bullets.push(bullet);
    socket.emit('shoot', bullet);
  }

  canShoot = false; // Disable shooting temporarily

  setTimeout(() => {
    canShoot = true; // Enable shooting after a delay
  }, 100); // Adjust the delay duration as needed
}








// Define an array to store the trail particles
const bulletTrails = [];

function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        // Create a trail particle
        const trailParticle = {
            x: bullet.x,
            y: bullet.y,
            alpha: 1, // Initial opacity
        };
        bulletTrails.push(trailParticle);
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        if (bullet.x < 0 || bullet.x > arenaWidth || bullet.y < 0 || bullet.y > arenaHeight) {
            bullets.splice(i, 1);
            i--;
        }
    }
    removeParticles()
    for (let i = 0; i < enemyBullets.length; i++) {
        const enemyBullet = enemyBullets[i];
        // Create a trail particle
        const trailParticle = {
            x: enemyBullet.x,
            y: enemyBullet.y,
            alpha: 1, // Initial opacity
        };
        bulletTrails.push(trailParticle);
        enemyBullet.x += enemyBullet.vx;
        enemyBullet.y += enemyBullet.vy;
        if (enemyBullet.x < 0 || enemyBullet.x > arenaWidth || enemyBullet.y < 0 || enemyBullet.y > arenaHeight) {
            enemyBullets.splice(i, 1);
            i--;
        }
    }
    removeParticles()
}

function removeParticles() {
    // Update and remove trail particles
    for (let i = bulletTrails.length - 1; i >= 0; i--) {
        const trailParticle = bulletTrails[i];
        trailParticle.alpha -= 0.05; // Adjust the rate of fading
        if (trailParticle.alpha <= 0) {
            bulletTrails.splice(i, 1);
        }
    }
}





function renderParticles() {
    for (let i = 0; i < bulletTrails.length; i++) {
        const trailParticle = bulletTrails[i];
        const xPos = trailParticle.x;
        const yPos = trailParticle.y;
        const alpha = trailParticle.alpha;
        for (let enemyId in players) {
            if (enemyId !== socket.id) {
                const enemy = players[enemyId];
                // Set the desired styling for the trail particle
                ctx.beginPath();
                ctx.arc(xPos, yPos, 2, 2, 2 * Math.PI);
                ctx.fillStyle = 'red'; // Adjust the color and transparency of the trail particles
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.fill();
                ctx.closePath();
            } 
                // Set the desired styling for the trail particle
                ctx.beginPath();
                ctx.arc(xPos, yPos, 2, 2, 2 * Math.PI);
                ctx.fillStyle = circle.color; // Adjust the color and transparency of the trail particles
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.fill();
                ctx.closePath();
            
        }
    }
}