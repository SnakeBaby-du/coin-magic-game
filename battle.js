// Battle game variables
const canvas = document.getElementById('battleCanvas');
const ctx = canvas.getContext('2d');
let gameRunning = true;
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  color: '#6a4c93',
  health: 100,
  speed: 5
};
let enemies = [];
let projectiles = [];
let coins = [];
let lastSpawn = 0;
let activeSkills = [];
let gameScore = 0;

// Initialize battle
document.addEventListener('DOMContentLoaded', () => {
  // Update UI
  updateHealth();
  updateCoinCounter();
  
  // Load active skills
  const purchasedSkills = JSON.parse(localStorage.getItem('purchasedSkills') || '[]');
  document.getElementById('active-spells').textContent = 
    purchasedSkills.length > 0 ? purchasedSkills.join(', ') : 'None';
  
  // Start game loop
  requestAnimationFrame(gameLoop);
  
  // Spawn enemies periodically
  setInterval(spawnEnemy, 2000);
});

// Main game loop
function gameLoop(timestamp) {
  if (!gameRunning) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Update and render player
  updatePlayer();
  renderPlayer();
  
  // Update and render enemies
  updateEnemies();
  renderEnemies();
  
  // Update and render projectiles
  updateProjectiles();
  renderProjectiles();
  
  // Update and render coins
  updateCoins();
  renderCoins();
  
  // Auto-attack logic
  if (timestamp - lastSpawn > 1000) {
    autoAttack();
    lastSpawn = timestamp;
  }
  
  // Apply active skills
  applyActiveSkills();
  
  // Continue game loop
  requestAnimationFrame(gameLoop);
}

// Player movement
function updatePlayer() {
  // Mouse following
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    player.x = e.clientX - rect.left;
    player.y = e.clientY - rect.top;
  });
}

// Render player
function renderPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();
}

// Enemy logic
function spawnEnemy() {
  const side = Math.floor(Math.random() * 4);
  let x, y;
  
  switch(side) {
    case 0: // top
      x = Math.random() * canvas.width;
      y = -20;
      break;
    case 1: // right
      x = canvas.width + 20;
      y = Math.random() * canvas.height;
      break;
    case 2: // bottom
      x = Math.random() * canvas.width;
      y = canvas.height + 20;
      break;
    case 3: // left
      x = -20;
      y = Math.random() * canvas.height;
      break;
  }
  
  enemies.push({
    x, y,
    radius: 15,
    color: '#e74c3c',
    speed: 1 + Math.random() * 2,
    health: 20
  });
}

// Update enemies
function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    
    // Move towards player
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    enemy.x += (dx / distance) * enemy.speed;
    enemy.y += (dy / distance) * enemy.speed;
    
    // Check collision with player
    if (distance < player.radius + enemy.radius) {
      player.health -= 5;
      updateHealth();
      enemies.splice(i, 1);
      
      if (player.health <= 0) {
        endGame();
      }
    }
  }
}

// Render enemies
function renderEnemies() {
  enemies.forEach(enemy => {
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.fillStyle = enemy.color;
    ctx.fill();
    ctx.closePath();
  });
}

// Projectile logic
function autoAttack() {
  const purchasedSkills = JSON.parse(localStorage.getItem('purchasedSkills') || '[]');
  
  enemies.forEach(enemy => {
    // Basic attack
    projectiles.push({
      x: player.x,
      y: player.y,
      targetX: enemy.x,
      targetY: enemy.y,
      radius: 5,
      color: '#3498db',
      speed: 5,
      damage: 10
    });
    
    // Special skills
    if (purchasedSkills.includes('fireball')) {
      // Fireball skill
      projectiles.push({
        x: player.x,
        y: player.y,
        targetX: enemy.x,
        targetY: enemy.y,
        radius: 8,
        color: '#e74c3c',
        speed: 7,
        damage: 20
      });
    }
  });
}

// Update projectiles
function updateProjectiles() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const proj = projectiles[i];
    
    // Move towards target
    const dx = proj.targetX - proj.x;
    const dy = proj.targetY - proj.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    proj.x += (dx / distance) * proj.speed;
    proj.y += (dy / distance) * proj.speed;
    
    // Check collision with enemies
    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      const enemyDist = Math.sqrt(
        Math.pow(proj.x - enemy.x, 2) + 
        Math.pow(proj.y - enemy.y, 2)
      );
      
      if (enemyDist < enemy.radius + proj.radius) {
        enemy.health -= proj.damage;
        
        if (enemy.health <= 0) {
          // Drop coin
          coins.push({
            x: enemy.x,
            y: enemy.y,
            radius: 8,
            color: '#f1c40f',
            value: 5
          });
          
          // Remove enemy
          enemies.splice(j, 1);
          gameScore += 10;
        }
        
        // Remove projectile
        projectiles.splice(i, 1);
        break;
      }
    }
  }
}

// Render projectiles
function renderProjectiles() {
  projectiles.forEach(proj => {
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
    ctx.fillStyle = proj.color;
    ctx.fill();
    ctx.closePath();
  });
}

// Coin logic
function updateCoins() {
  for (let i = coins.length - 1; i >= 0; i--) {
    const coin = coins[i];
    
    // Move towards player
    const dx = player.x - coin.x;
    const dy = player.y - coin.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    coin.x += (dx / distance) * 2;
    coin.y += (dy / distance) * 2;
    
    // Collect coin
    if (distance < player.radius + coin.radius) {
      const currentCoins = parseInt(localStorage.getItem('coins') || '0');
      localStorage.setItem('coins', currentCoins + coin.value);
      updateCoinCounter();
      coins.splice(i, 1);
    }
  }
}

// Render coins
function renderCoins() {
  coins.forEach(coin => {
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
    ctx.fillStyle = coin.color;
    ctx.fill();
    ctx.closePath();
    
    // Draw "$" symbol
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', coin.x, coin.y);
  });
}

// Apply active skills
function applyActiveSkills() {
  const purchasedSkills = JSON.parse(localStorage.getItem('purchasedSkills') || '[]');
  
  // Healing skill
  if (purchasedSkills.includes('healing') && player.health < 100) {
    player.health = Math.min(player.health + 0.1, 100);
    updateHealth();
  }
  
  // Shield skill (visual effect)
  if (purchasedSkills.includes('shield')) {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius + 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(52, 152, 219, 0.5)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
  }
}

// Update health display
function updateHealth() {
  document.getElementById('health').textContent = Math.floor(player.health);
}

// Update coin display
function updateCoinCounter() {
  const coins = parseInt(localStorage.getItem('coins') || '0');
  document.getElementById('coin-count').textContent = coins;
}

// End game
function endGame() {
  gameRunning = false;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#fff';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width/2, canvas.height/2 - 30);
  
  ctx.font = '20px Arial';
  ctx.fillText(`Final Score: ${gameScore}`, canvas.width/2, canvas.height/2 + 20);
  
  ctx.fillText('Click to restart', canvas.width/2, canvas.height/2 + 60);
  
  canvas.addEventListener('click', restartGame);
}

// Restart game
function restartGame() {
  player.health = 100;
  enemies = [];
  projectiles = [];
  coins = [];
  gameScore = 0;
  gameRunning = true;
  updateHealth();
  canvas.removeEventListener('click', restartGame);
  requestAnimationFrame(gameLoop);
}