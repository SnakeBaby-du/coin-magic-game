// 调试标记：确保脚本加载
console.log("[DEBUG] script.js 已加载");

// Telegram WebApp 初始化
const tg = window.Telegram.WebApp;
try {
  tg.expand();
  console.log("[DEBUG] Telegram WebApp 初始化成功");
} catch (e) {
  console.error("[ERROR] Telegram WebApp 初始化失败:", e);
}

// 页面路由逻辑
const path = window.location.pathname;

if (path.includes("index.html") || path === "/") {
  console.log("[DEBUG] 进入首页逻辑");
  
  const flipBtn = document.getElementById('flipBtn');
  const result = document.getElementById('result');
  
  // 安全获取用户信息
  if (tg?.initDataUnsafe?.user) {
    const usernameEl = document.getElementById("username");
    if (usernameEl) {
      usernameEl.innerText = `欢迎，@${tg.initDataUnsafe.user.username}`;
    }
  }

  // 翻泡泡逻辑（带错误处理）
  if (flipBtn && result) {
    flipBtn.addEventListener('click', () => {
      console.log("[DEBUG] 翻泡泡按钮被点击");
      
      try {
        const types = ['🔥 火焰泡泡', '💧 水泡泡', '🌪️ 风泡泡', '☁️ 空泡泡'];
        const gain = types[Math.floor(Math.random() * types.length)];
        let magic = parseInt(localStorage.getItem('magic') || '0');
        
        if (gain !== '☁️ 空泡泡') {
          magic++;
          localStorage.setItem('magic', magic);
        }
        
        result.innerText = `你翻到了：${gain}（当前拥有 ${magic} 个魔法泡泡）`;
      } catch (e) {
        console.error("[ERROR] 翻泡泡逻辑出错:", e);
        result.innerText = "操作失败，请刷新页面";
      }
    });
  } else {
    console.error("[ERROR] 未找到按钮或结果显示元素");
  }
}

if (path.includes("shop.html")) {
  console.log("[DEBUG] 进入商店逻辑");
  
  // 商店逻辑（带加载状态）
  const shopList = document.getElementById('shopList');
  if (shopList) {
    shopList.innerHTML = "<p>加载技能中...</p>";
    
    fetch('skills.json')
      .then(res => {
        if (!res.ok) throw new Error("技能加载失败");
        return res.json();
      })
      .then(skills => {
        shopList.innerHTML = "";
        const magic = parseInt(localStorage.getItem('magic') || '0');
        
        skills.forEach(skill => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span>${skill.name}（需要魔法泡泡 ${skill.cost} 个）</span>
            <button ${magic < skill.cost ? 'disabled' : ''}>
              购买
            </button>
          `;
          
          li.querySelector('button').addEventListener('click', () => {
            alert(`已购买 ${skill.name}，将派发给前线魔术师`);
          });
          
          shopList.appendChild(li);
        });
      })
      .catch(e => {
        console.error("[ERROR] 加载技能失败:", e);
        shopList.innerHTML = "<p style='color:red'>技能加载失败，请刷新页面</p>";
      });
  }
}