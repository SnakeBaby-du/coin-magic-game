const tg = window.Telegram.WebApp;
tg.expand(); // 最大化 WebApp 窗口

const path = window.location.pathname;

if (path.includes("index.html") || path === "/") {
  const flipBtn = document.getElementById('flipBtn');
  const result = document.getElementById('result');
  const user = tg.initDataUnsafe.user;
  console.log("用户名：", tg.initDataUnsafe.user.username);
  console.log("用户ID：", tg.initDataUnsafe.user.id);
  console.log("Hello，" + user.first_name + "（ID：" + user.id + "）");
  const usernameEl = document.getElementById("username");
  if (usernameEl) {
    usernameEl.innerText = `欢迎，@${tg.initDataUnsafe.user.username}`;
  }

  flipBtn.addEventListener('click', () => {
    const types = ['🔥 火焰泡泡', '💧 水泡泡', '🌪️ 风泡泡', '☁️ 空泡泡'];
    const gain = types[Math.floor(Math.random() * types.length)];
    let magic = parseInt(localStorage.getItem('magic') || '0');
    if (gain !== '☁️ 空泡泡') {
      magic++;
      localStorage.setItem('magic', magic);
    }
    result.innerText = `你翻到了：${gain}（当前拥有 ${magic} 个魔法泡泡）`;
  });
}

if (path.includes("shop.html")) {
  const skills = [
    { name: '火球术', cost: 3 },
    { name: '寒冰术', cost: 4 },
    { name: '治愈术', cost: 2 }
  ];
  const shopList = document.getElementById('shopList');
  const magic = parseInt(localStorage.getItem('magic') || '0');

  skills.forEach(skill => {
    const li = document.createElement('li');
    li.innerText = `${skill.name}（需要魔法泡泡 ${skill.cost} 个）`;
    const btn = document.createElement('button');
    btn.innerText = '购买';
    btn.disabled = magic < skill.cost;
    btn.onclick = () => {
      alert(`已购买 ${skill.name}，将派发给前线魔术师`);
    };
    li.appendChild(btn);
    shopList.appendChild(li);
  });
}
