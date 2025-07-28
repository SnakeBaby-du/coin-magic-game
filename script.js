
console.log("[SECURE] 初始化开始");

const isTelegram = /Telegram/.test(navigator.userAgent) || 
                   window.Telegram?.WebApp?.initData;

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

if (tg.expand) {
  setTimeout(() => {
    try {
      tg.expand();
      console.log("[SECURE] Telegram SDK 已激活");
    } catch (e) {
      console.warn("[SECURE] 窗口扩展失败:", e);
    }
  }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
  const flipBtn = document.getElementById('flipBtn');
  if (!flipBtn) return;

  flipBtn.addEventListener('click', () => {
    const resultEl = document.getElementById('result');
    if (!resultEl) return;

    try {
      const BUBBLES = [
        { emoji: '🔥', name: '火焰泡泡', value: 1 },
        { emoji: '💧', name: '水泡泡', value: 1 },
        { emoji: '🌪️', name: '风泡泡', value: 1 },
        { emoji: '☁️', name: '空泡泡', value: 0 }
      ];
      const index = crypto.getRandomValues(new Uint32Array(1))[0] % 4;
      const { emoji, name, value } = BUBBLES[index];
      const magic = Math.max(0, parseInt(localStorage.getItem('magic') || 0) + value);
      localStorage.setItem('magic', magic.toString());
      resultEl.textContent = `${emoji} 获得 ${name}！当前魔法: ${magic}`;
    } catch (e) {
      resultEl.textContent = "魔法波动异常！";
      console.error("[SECURE] 操作失败:", e);
    }
  });
});
