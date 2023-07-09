function drawEnemy() {
    for (let enemyId in players) {
        if (enemyId !== socket.id) {
            const enemy = players[enemyId];
            const healthPercentage = enemy.health / enemy.maxHealth; // Calculate health percentage
            const healthBarWidth = 30; // Width of the health bar
            const healthBarHeight = 5; // Height of the health bar
            const healthBarX = enemy.x - healthBarWidth / 2; // X-coordinate of the health bar
            const healthBarY = enemy.y + enemy.radius - 20; // Y-coordinate of the health bar

            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemy.radius, 0, 2 * Math.PI);
            // Add shadow effect
            ctx.shadowColor = enemy.color;
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillStyle = enemy.color;
            ctx.fill();
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.fillText(enemy.username, enemy.x, enemy.y + enemy.radius + 15);

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
}
