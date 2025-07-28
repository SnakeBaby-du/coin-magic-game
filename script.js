// ====== 初始化部分 ======
console.log("[SYSTEM] 游戏初始化开始");

// 1. 环境检测
const isTelegram = navigator.userAgent.includes('Telegram');
let tg = { initDataUnsafe: { user: { username: "冒险者" } } };

// 2. Telegram SDK初始化
if (isTelegram && window.Telegram?.WebApp) {
  try {
    tg = window.Telegram.WebApp;
    tg.expand();
    console.log("[SYSTEM] Telegram SDK 加载成功");
    
    // 更新用户名显示
    const usernameEl = document.getElementById('username');
    if (usernameEl) {
      usernameEl.textContent = `欢迎，${tg.initDataUnsafe.user?.username || '旅行者'}`;
    }
  } catch (e) {
    console.error("[ERROR] Telegram初始化失败:", e);
  }
}

// ====== 翻泡泡逻辑 ======
const flipBtn = document.getElementById('flipBtn');
if (flipBtn) {
  flipBtn.addEventListener('click', () => {
    const resultEl = document.getElementById('result');
    if (!resultEl) return;

    try {
      // 安全随机算法
      const results = [
        { type: '🔥 火焰泡泡', value: 1 },
        { type: '💧 水泡泡', value: 1 },
        { type: '🌪️ 风泡泡', value: 1 },
        { type: '☁️ 空泡泡', value: 0 }
      ];
      const index = Math.floor(Math.random() * 4);
      const { type, value } = results[index];

      // 更新魔法值
      let magic = parseInt(localStorage.getItem('magic')) || 0;
      magic += value;
      localStorage.setItem('magic', magic);

      // 显示结果
      resultEl.textContent = `获得：${type}（总计 ${magic} 个魔法泡泡）`;
    } catch (e) {
      console.error("[ERROR] 翻泡泡出错:", e);
      resultEl.textContent = "魔法失效了，请重试！";
    }
  });
}

// ====== 商店逻辑 ======
if (window.location.pathname.includes('shop.html')) {
  const shopList = document.getElementById('shopList');
  if (shopList) {
    shopList.innerHTML = '<li class="loading">加载魔法技能中...</li>';
    
    fetch('skills.json')
      .then(res => res.ok ? res.json() : Promise.reject('加载失败'))
      .then(skills => {
        shopList.innerHTML = '';
        const magic = parseInt(localStorage.getItem('magic')) || 0;
        
        skills.forEach(skill => {
          const li = document.createElement('li');
          li.className = 'skill-item';
          li.innerHTML = `
            <span class="skill-name">${skill.name}</span>
            <span class="skill-cost">${skill.cost} 魔法泡泡</span>
            <button class="buy-btn" ${magic < skill.cost ? 'disabled' : ''}>
              购买
            </button>
          `;
          
          li.querySelector('.buy-btn').addEventListener('click', () => {
            alert(`${skill.name} 购买成功！已发送给前线魔术师。`);
          });
          
          shopList.appendChild(li);
        });
      })
      .catch(e => {
        console.error("[ERROR] 加载技能失败:", e);
        shopList.innerHTML = '<li class="error">魔法书被封印了，请稍后再试</li>';
      });
  }
}