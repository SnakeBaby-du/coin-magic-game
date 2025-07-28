// 1. 添加SDK加载检测
console.log("[CSP] 开始加载Telegram SDK");

// 2. 安全初始化
let tg;
try {
  tg = window.Telegram?.WebApp;
  if (!tg) throw new Error("SDK未加载");
  
  // 3. 添加版本兼容检测
  if (typeof tg.expand === 'function') {
    tg.expand();
    console.log("[CSP] Telegram SDK初始化成功");
  } else {
    console.warn("[CSP] 当前环境不支持WebApp");
  }
} catch (e) {
  console.error("[CSP] 初始化失败:", e);
  tg = { initDataUnsafe: { user: { username: "玩家" } }; // 模拟数据
}

// 4. 翻泡泡逻辑（完全避免eval）
document.getElementById('flipBtn')?.addEventListener('click', function() {
  const types = ['🔥 火焰泡泡', '💧 水泡泡', '🌪️ 风泡泡', '☁️ 空泡泡'];
  const result = document.getElementById('result');
  
  try {
    // 使用预定义数组+索引（绝对安全）
    const randomIndex = Math.floor(Math.random() * 4); // 0-3
    const gain = types[randomIndex];
    
    let magic = parseInt(localStorage.getItem('magic')) || 0;
    if (randomIndex !== 3) magic++; // 第4个是空泡泡
    
    localStorage.setItem('magic', magic);
    result.textContent = `翻到：${gain}（当前${magic}个）`;
  } catch (e) {
    result.textContent = "操作失败";
    console.error("[CSP] 翻泡泡错误:", e);
  }
});