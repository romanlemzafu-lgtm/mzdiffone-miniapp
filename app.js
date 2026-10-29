const tg = window.Telegram?.WebApp ?? {
  ready(){}, expand(){}, openLink:url=>window.open(url,"_blank"),
  openTelegramLink:url=>window.open(url,"_blank"),
  showAlert:msg=>alert(msg), initDataUnsafe:{}
};

const BOT_USERNAME = "MzdiffoneTVBot";
const PREORDER_FORM_URL = ""; 
// ↑ Когда сделаем Google/Яндекс Форму, вставь сюда HTTPS-ссылку.

tg.ready();
tg.expand();

const user = tg.initDataUnsafe?.user;
const name = user?.first_name || "друг";
const username = user?.username ? `@${user.username}` : "Telegram Mini App";

document.getElementById("hello").textContent = `Привет, ${name} 👋`;
document.getElementById("profileName").textContent = name;
document.getElementById("profileUsername").textContent = username;

const initial = (name || "M").trim().charAt(0).toUpperCase();
document.getElementById("avatar").textContent = initial;
document.getElementById("profileAvatar").textContent = initial;

function openLink(url){
  if (tg.openLink) tg.openLink(url);
  else window.open(url,"_blank");
}
function openBot(section=""){
  const suffix = section ? `?start=${encodeURIComponent(section)}` : "";
  const url = `https://t.me/${BOT_USERNAME}${suffix}`;
  if (tg.openTelegramLink) tg.openTelegramLink(url);
  else window.location.href = url;
}
function goPage(page){
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".bottom-nav button").forEach(x=>x.classList.remove("active"));
  document.querySelector(`[data-page="${page}"]`)?.classList.add("active");
  document.querySelector(`.bottom-nav button[data-target="${page}"]`)?.classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".bottom-nav button").forEach(btn=>{
  btn.addEventListener("click",()=>goPage(btn.dataset.target));
});

if (location.hash){
  const hash = location.hash.slice(1);
  if (["home","game","kotost","profile","more"].includes(hash)) goPage(hash);
}

function openPreorder(){
  if (PREORDER_FORM_URL){
    openLink(PREORDER_FORM_URL);
  } else {
    tg.showAlert("🐱 Предзаказ пока не открыт. Форма появится здесь совсем скоро!");
  }
}
function showBotStatus(){
  tg.showAlert("🟢 Mzdiff Mini App работает\nВерсия: Cozy v2.0\nKOTOST: готовится к DROP 01");
}
function hintSecret(){
  tg.showAlert("👀 Подсказка: иногда на логотип надо нажать не один раз...");
}

/* ---------------- KOTOST GAME ---------------- */
let coins = Number(localStorage.getItem("kotost_coins") || 0);
let power = Number(localStorage.getItem("kotost_power") || 1);
let taps = Number(localStorage.getItem("kotost_taps") || 0);

const coinsEl = document.getElementById("coins");
const powerEl = document.getElementById("power");
const profileCoins = document.getElementById("profileCoins");
const catTap = document.getElementById("catTap");
const tapPop = document.getElementById("tapPop");
const phraseEl = document.getElementById("gamePhrase");
const upgradeBtn = document.getElementById("upgradeButton");

const phrases = [
  "Котость одобряет.",
  "Ещё один тык был абсолютно необходим.",
  "Котость стала на 0.0001% могущественнее.",
  "Где-то заплакал один сервер.",
  "Мира это не согласовывала.",
  "Ты зачем продолжаешь 😭",
  "Котокоинов много не бывает.",
  "Котость смотрит прямо в душу."
];

function renderGame(){
  coinsEl.textContent = coins;
  powerEl.textContent = `+${power}`;
  profileCoins.textContent = `${coins} 🪙`;
  upgradeBtn.textContent = power >= 2 ? "🐾 Лапка x2 уже куплена" : "🐾 Купить лапку x2 — 100 🪙";
  upgradeBtn.disabled = power >= 2;
}
catTap.addEventListener("click",()=>{
  coins += power;
  taps += 1;
  localStorage.setItem("kotost_coins",coins);
  localStorage.setItem("kotost_taps",taps);
  tapPop.textContent = `+${power}`;
  tapPop.classList.remove("pop");
  void tapPop.offsetWidth;
  tapPop.classList.add("pop");
  if (taps % 7 === 0) phraseEl.textContent = phrases[Math.floor(Math.random()*phrases.length)];
  renderGame();
});
upgradeBtn.addEventListener("click",()=>{
  if (power >= 2) return;
  if (coins < 100){
    tg.showAlert("Не хватает котокоинов 😭 Нужно 100 🪙");
    return;
  }
  coins -= 100;
  power = 2;
  localStorage.setItem("kotost_coins",coins);
  localStorage.setItem("kotost_power",power);
  phraseEl.textContent = "ЛАПКА x2 АКТИВИРОВАНА 🐾";
  renderGame();
});
document.getElementById("resetGame").addEventListener("click",()=>{
  coins = 0; power = 1; taps = 0;
  ["kotost_coins","kotost_power","kotost_taps"].forEach(k=>localStorage.removeItem(k));
  phraseEl.textContent = "Котость всё забыла.";
  renderGame();
});
renderGame();

/* ---------------- SECRET GIF ---------------- */
let secretClicks = 0;
let secretTimer;
const overlay = document.getElementById("secretOverlay");
document.getElementById("logoButton").addEventListener("click",()=>{
  secretClicks += 1;
  clearTimeout(secretTimer);
  secretTimer = setTimeout(()=>secretClicks=0, 2400);
  if (secretClicks >= 7){
    secretClicks = 0;
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden","false");
  }
});
document.getElementById("secretClose").addEventListener("click",()=>{
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden","true");
});
