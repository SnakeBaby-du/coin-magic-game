document.addEventListener('DOMContentLoaded', async () => {
  // Update magic counter
  updateMagicCounter();
  
  try {
    // Load skills from JSON
    const response = await fetch('skills.json');
    if (!response.ok) throw new Error('Failed to load skills');
    
    const skills = await response.json();
    renderSkills(skills);
  } catch (error) {
    console.error('Skill loading error:', error);
    document.querySelector('.loading').textContent = 
      'Failed to load spells. Please try again later.';
  }
});

// Render skills in shop
function renderSkills(skills) {
  const shopList = document.getElementById('shopList');
  const loading = document.querySelector('.loading');
  
  // Clear loading state
  loading.remove();
  
  // Render each skill
  skills.forEach(skill => {
    const li = document.createElement('li');
    li.className = 'skill-item';
    
    li.innerHTML = `
      <div class="skill-info">
        <span class="skill-name">${skill.name}</span>
        <span class="skill-desc">${skill.description}</span>
      </div>
      <div class="skill-actions">
        <span class="skill-cost">Cost: ${skill.cost} magic</span>
        <button class="buy-btn" data-id="${skill.id}">Buy</button>
      </div>
    `;
    
    shopList.appendChild(li);
  });
  
  // Add buy event listeners
  document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', buySkill);
  });
}

// Buy skill logic
function buySkill(event) {
  const skillId = event.target.dataset.id;
  const magic = parseInt(localStorage.getItem('magic') || '0');
  
  // Find skill data
  fetch('skills.json')
    .then(res => res.json())
    .then(skills => {
      const skill = skills.find(s => s.id === skillId);
      if (!skill) throw new Error('Skill not found');
      
      if (magic >= skill.cost) {
        // Deduct cost
        localStorage.setItem('magic', magic - skill.cost);
        updateMagicCounter();
        
        // Add to purchased skills
        const purchased = JSON.parse(localStorage.getItem('purchasedSkills') || '[]');
        purchased.push(skillId);
        localStorage.setItem('purchasedSkills', JSON.stringify(purchased));
        
        alert(`Successfully purchased ${skill.name}! This spell is now active in battle.`);
      } else {
        alert(`Not enough magic to purchase ${skill.name}. You need ${skill.cost - magic} more.`);
      }
    })
    .catch(error => {
      console.error('Purchase error:', error);
      alert('Failed to complete purchase. Please try again.');
    });
}

// Update magic counter
function updateMagicCounter() {
  const magic = parseInt(localStorage.getItem('magic') || '0');
  document.getElementById('magic-count').textContent = magic;
}