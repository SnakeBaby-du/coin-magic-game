// Initialize game state
document.addEventListener('DOMContentLoaded', () => {
  // Initialize user data
  const tg = window.Telegram?.WebApp || {};
  const user = tg.initDataUnsafe?.user || {};
  const username = user.username || 'Player';
  
  document.getElementById('username').textContent = `Welcome, ${username}!`;
  updateCounters();
  
  // Initialize flip button
  const flipBtn = document.getElementById('flipBtn');
  flipBtn.addEventListener('click', flipBubble);
  
  // Initialize hire button
  const hireBtn = document.getElementById('hireBtn');
  hireBtn.addEventListener('click', hireAssistant);
  
  // Start assistant automation if hired
  startAssistantAutomation();
});

// Flip bubble logic
function flipBubble() {
  const BUBBLE_TYPES = [
    { type: 'copper', emoji: '🟤', value: 1, probability: 0.5 },
    { type: 'silver', emoji: '⚪', value: 3, probability: 0.3 },
    { type: 'gold', emoji: '🟡', value: 10, probability: 0.15 },
    { type: 'empty', emoji: '⚫', value: 0, probability: 0.05 }
  ];
  
  const resultEl = document.getElementById('result');
  const random = Math.random();
  let cumulativeProb = 0;
  
  // Select bubble based on probability
  for (const bubble of BUBBLE_TYPES) {
    cumulativeProb += bubble.probability;
    if (random <= cumulativeProb) {
      // Add to magic count
      if (bubble.value > 0) {
        const currentMagic = parseInt(localStorage.getItem('magic') || '0');
        localStorage.setItem('magic', currentMagic + bubble.value);
        updateCounters();
      }
      
      // Display result
      resultEl.textContent = `Flipped a ${bubble.type} bubble! ${bubble.emoji} +${bubble.value} magic`;
      resultEl.className = bubble.type;
      return;
    }
  }
}

// Hire assistant logic
function hireAssistant() {
  const coins = parseInt(localStorage.getItem('coins') || '0');
  if (coins >= 10) {
    localStorage.setItem('coins', coins - 10);
    localStorage.setItem('assistants', (parseInt(localStorage.getItem('assistants') || '0') + 1));
    updateCounters();
    startAssistantAutomation();
    alert('Hired a new assistant! They will automatically flip bubbles for you.');
  } else {
    alert('Not enough coins to hire an assistant!');
  }
}

// Automate bubble flipping with assistants
function startAssistantAutomation() {
  const assistants = parseInt(localStorage.getItem('assistants') || '0');
  if (assistants > 0) {
    // Clear any existing interval
    if (window.assistantInterval) {
      clearInterval(window.assistantInterval);
    }
    
    // Set new interval based on number of assistants
    window.assistantInterval = setInterval(() => {
      flipBubble();
    }, 10000 / assistants); // More assistants = faster flipping
  }
}

// Update UI counters
function updateCounters() {
  const magic = parseInt(localStorage.getItem('magic') || '0');
  const coins = parseInt(localStorage.getItem('coins') || '0');
  const assistants = parseInt(localStorage.getItem('assistants') || '0');
  
  document.getElementById('magic-count').textContent = magic;
  document.getElementById('coin-count').textContent = coins;
  
  if (assistants > 0) {
    document.getElementById('hireBtn').textContent = 
      `Hire Assistant (${10 * (assistants + 1)} coins)`;
  }
}