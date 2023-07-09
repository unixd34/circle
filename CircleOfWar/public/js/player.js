function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, arenaWidth, arenaHeight);
    for (let enemyId in players) {
        if (enemyId !== socket.id) {
            drawEnemy();
        } else {
            const healthPercentage = circle.health / circle.maxHealth; // Calculate health percentage
            const healthBarWidth = 30; // Width of the health bar
            const healthBarHeight = 5; // Height of the health bar
            const healthBarX = circle.x - healthBarWidth / 2; // X-coordinate of the health bar
            const healthBarY = circle.y + circle.radius - 40; // Y-coordinate of the health bar
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
            // Add shadow effect
            ctx.shadowColor = circle.color;
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillStyle = circle.color;
            ctx.fill();
            // Render username
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.fillText('You', circle.x, circle.y + circle.radius - 20);
            ctx.fillText(circle.username, circle.x, circle.y + circle.radius + 15);

            // Draw health bar background
            ctx.fillStyle = 'red';
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

            // Draw health bar
            ctx.fillStyle = 'green';
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercentage, healthBarHeight);
        }
    }
    for (let enemyId in players) {
        if (enemyId !== socket.id) {
            const enemy = players[enemyId];
            for (let i = 0; i < enemyBullets.length; i++) {
                const bullet = enemyBullets[i];
                ctx.beginPath();
                ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'red';
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.fill();
                ctx.closePath();
            }
        } else {
            //player bullet
            for (let i = 0; i < bullets.length; i++) {
                const bullet = bullets[i];
                // Draw the bullet
                ctx.beginPath();
                ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
                ctx.fillStyle = circle.color;
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}