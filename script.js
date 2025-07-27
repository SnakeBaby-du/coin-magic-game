const tg = window.Telegram.WebApp;
tg.expand(); // 让窗口最大化
const flipBtn = document.getElementById('flipBtn');
const result = document.getElementById('result');
const user = tg.initDataUnsafe.user;
console.log("Hello，" + user.first_name + "（ID：" + user.id + "）");

flipBtn.addEventListener('click', () => {
  const types = ['🔥 火焰泡泡', '💧 水泡泡', '🌪️ 风泡泡', '☁️ 空泡泡'];
  const gain = types[Math.floor(Math.random() * types.length)];
  
  // 记录魔法泡泡数量
  let magic = parseInt(localStorage.getItem('magic') || '0');
  if (gain !== '☁️ 空泡泡') {
    magic++;
    localStorage.setItem('magic', magic);
  }

  result.innerText = `你翻到了：${gain}（当前拥有 ${magic} 个魔法泡泡）`;
});
