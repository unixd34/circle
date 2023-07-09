function handleCollision(circle, arenaWidth, arenaHeight) {
    // Check if the circle exceeds the boundaries of the arena
    if (circle.x - circle.radius < 0) {
        circle.x = circle.radius;
    }
    if (circle.x + circle.radius > arenaWidth) {
        circle.x = arenaWidth - circle.radius;
    }
    if (circle.y - circle.radius < 0) {
        circle.y = circle.radius;
    }
    if (circle.y + circle.radius > arenaHeight) {
        circle.y = arenaHeight - circle.radius;
    }
}

function checkCollisions() {
    // Check if player got hit by an enemy bullet
    for (let i = 0; i < enemyBullets.length; i++) {
        const enemyBullet = enemyBullets[i];
        const dx = circle.x - enemyBullet.x;
        const dy = circle.y - enemyBullet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < circle.radius + enemyBullet.radius) {
            var vignette = document.getElementById("vignette");
            vignette.style.display = 'block';
            // Create an array of sound file paths
            var soundFiles = ['../sound/hit1.mp3', '../sound/hit2.mp3', '../sound/hit3.mp3'];
            // Generate a random index within the range of the soundFiles array
            var randomIndex = Math.floor(Math.random() * soundFiles.length);
            // Create an Audio object with the randomly selected sound file
            var audio = new Audio(soundFiles[randomIndex]);
            // Play the audio
            audio.play();
            setTimeout(function() {
                vignette.classList.remove("vignette-hidden");
                setTimeout(function() {
                    vignette.classList.add("vignette-hidden");
                }, 500);
            }, 0);
            enemyBullets.splice(i, 1);
            i--;
            circle.health -= 1;
            // Check if player's health reaches zero
            if (circle.health <= 0) {
                var audio = new Audio('../sound/explosion.mp3'); // Replace 'path_to_sound_file.mp3' with the actual file path
                audio.play();
                spawning.innerHTML = 'Spawning In';
                username.value = '';
                color.value = '';
                // Game over actions
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('keyup', handleKeyUp);
                window.removeEventListener('click', shootBullet);
                players = [];
                socket.disconnect();
                joinContainer.style.display = 'block';
                setTimeout(() => {
                    var audio = new Audio('../sound/gameover.mp3');
                    audio.play();
                }, 500);
                setTimeout(() => {
                    circle.x = Math.random() * arenaWidth;
                    circle.y = Math.random() * arenaHeight;
                }, 100);
            }
            // Create exploding particles
            const numParticles = 5;
            const explosionRadius = 20;
            for (let j = 0; j < numParticles; j++) {
                const angle = Math.random() * Math.PI * 2;
                const particleX = circle.x + Math.cos(angle) * explosionRadius;
                const particleY = circle.y + Math.sin(angle) * explosionRadius;
                // Use particleX and particleY to create particles as desired
                // You can add particle objects to an array or perform any other desired actions
                // For example:
                createParticles(particleX, particleY, numParticles);
            }
        }
    }
    for (let enemyId in players) {
        const enemy = players[enemyId];
        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            const dx = enemy.x - bullet.x;
            const dy = enemy.y - bullet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < enemy.radius + bullet.radius) {
                console.log("You shot enemy " + enemyId + "!");
                // Create an array of sound file paths
                var soundFiles = ['../sound/hit1.mp3', '../sound/hit2.mp3', '../sound/hit3.mp3'];
                // Generate a random index within the range of the soundFiles array
                var randomIndex = Math.floor(Math.random() * soundFiles.length);
                // Create an Audio object with the randomly selected sound file
                var audio = new Audio(soundFiles[randomIndex]);
                // Play the audio
                audio.play();
                // Remove the enemy from players
                delete players[enemyId];
                // Remove the bullet
                bullets.splice(i, 1);
                i--;
                if (enemy.health <= 0) {
                    var audio = new Audio('../sound/explosion.mp3'); // Replace 'path_to_sound_file.mp3' with the actual file path
                    audio.play();
                }
                // Create exploding particles
                const numParticles = 5;
                const explosionRadius = 20;
                for (let j = 0; j < numParticles; j++) {
                    const angle = Math.random() * Math.PI * 2;
                    const particleX = enemy.x + Math.cos(angle) * explosionRadius;
                    const particleY = enemy.y + Math.sin(angle) * explosionRadius;
                    // Use particleX and particleY to create particles as desired
                    // You can add particle objects to an array or perform any other desired actions
                    // For example:
                    createParticles(particleX, particleY, numParticles);
                }
            }
        }
    }
}
class Particle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = {
            x: Math.random() * 4 - 2,
            y: Math.random() * 4 - 2
        };
        this.gravity = 0.05;
        this.friction = 1;
        this.alpha = 1; // Add alpha value for fading out the particle
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`; // Use rgba to set alpha value
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.draw();
        // Apply velocity
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        // Apply gravity
        this.velocity.y += this.gravity;
        // Apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        // Remove particle if it goes offscreen or fades out completely
        if (this.y + this.radius > arenaHeight || this.alpha <= 0) {
            // Fade out the particle by reducing the alpha value gradually
            this.alpha -= 0.01;
        }
    }
}

function createParticles(x, y, numParticles) {
    for (let i = 0; i < numParticles; i++) {
        const radius = Math.random() * 2 + 1;
        const color = `${Math.random() * 200}, ${Math.random() * 15}, ${Math.random() * 15}`; // Use RGB values without "rgb" prefix
        const particle = new Particle(x, y, radius, color);
        particles.push(particle);
    }
}