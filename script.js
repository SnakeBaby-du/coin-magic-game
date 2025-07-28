// ====== 安全初始化 ======
console.log("[SECURE] 初始化开始");

// 1. 检测 Telegram 环境
const isTelegram = /Telegram/.test(navigator.userAgent) || 
                   window.Telegram?.WebApp?.initData;

// 2. 创建安全沙箱环境
const tg = (() => {
  try {
    return isTelegram ? window.Telegram.WebApp : {
      initDataUnsafe: { user: { username: "玩家" } },
      expand: () => console.log("[SECURE] 非Telegram环境模拟")
    };
  } catch (e) {
    console.error("[SECURE] 初始化失败:", e);
    return { initDataUnsafe: {} };
  }
})();

// 3. 安全执行初始化
if (tg.expand) {
  setTimeout(() => { // 确保DOM加载后执行
    try {
      tg.expand();
      console.log("[SECURE] Telegram SDK 已激活");
    } catch (e) {
      console.warn("[SECURE] 窗口扩展失败:", e);
    }
  }, 300);
}

// ====== 翻泡泡逻辑 ======
document.addEventListener('DOMContentLoaded', () => {
  const flipBtn = document.getElementById('flipBtn');
  if (!flipBtn) return;

  flipBtn.addEventListener('click', () => {
    const resultEl = document.getElementById('result');
    if (!resultEl) return;

    try {
      // 完全避免动态代码执行
      const BUBBLES = [
        { emoji: '🔥', name: '火焰泡泡', value: 1 },
        { emoji: '💧', name: '水泡泡', value: 1 },
        { emoji: '🌪️', name: '风泡泡', value: 1 },
        { emoji: '☁️', name: '空泡泡', value: 0 }
      ];
      const index = crypto.getRandomValues(new Uint32Array(1))[0] % 4;
      const { emoji, name, value } = BUBBLES[index];

      // 更新计数（安全类型转换）
      const magic = Math.max(0, parseInt(localStorage.getItem('magic') || 0) + value;
      localStorage.setItem('magic', magic.toString());

      // 显示结果（纯文本输出）
      resultEl.textContent = `${emoji} 获得 ${name}！当前魔法: ${magic}`;
    } catch (e) {
      resultEl.textContent = "魔法波动异常！";
      console.error("[SECURE] 操作失败:", e);
    }
  });
});