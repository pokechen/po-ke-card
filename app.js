let DB = null;
let setup = {
  mode: "ai",
  players: [
    { name: "玩家一", faction: "Northern Realms", leaderId: "", deckIds: [] },
    { name: "系统", faction: "Monsters", leaderId: "", deckIds: [], difficulty: "normal" }
  ]
};
let game = null;
let browserState = { expansion: "all", view: "grouped", open: false };
let pendingPlacement = null;
let mulligan = null;
let aiTurnPending = false;
let aiStuckTimer = null;
let lazyImageObserver = null;
let toastTimer = null;
const AI_STUCK_TIMEOUT = 5000; // 5秒安全超时
const AI_TURN_DELAY = 480; // 系统行动节奏：保留可读反馈，同时减少等待感
const MULLIGAN_MAX = 2;
const ROWS = ["melee", "ranged", "siege"];
const ROW_LABELS = { melee: "近战", ranged: "远程", siege: "攻城" };
const FACTIONS = ["Northern Realms", "Nilfgaardian Empire", "Scoia'tael", "Monsters", "Skellige"];
const DIFFICULTY_CN = { easy: "简单", normal: "普通", hard: "困难" };
const FACTION_CN = {
  "Northern Realms": "北方领域",
  "Nilfgaardian Empire": "尼弗迦德帝国",
  "Scoia'tael": "松鼠党",
  "Monsters": "怪物",
  "Skellige": "史凯利杰",
  "Neutral": "中立"
};
const EXPANSION_CN = { "Base game": "本体", "Hearts of Stone": "石之心", "Blood and Wine": "血与酒" };
const CATEGORY_CN = { unit: "单位", hero: "英雄", leader: "领袖", weather: "天气", special: "特殊" };
const ABILITY_CN = {
  "Hero": "英雄", "Spy": "间谍", "Medic": "医生", "Tight Bond": "同袍情深", "Morale Boost": "士气鼓舞",
  "Muster": "集结", "Agile": "敏捷", "Scorch": "灼烧", "Commander's Horn": "指挥号角",
  "Summon Shield Maidens": "召唤盾女", "Summon Avenger": "召唤复仇者", "Summon Bovine Defense Force": "召唤牛魔防卫军",
  "Berserker": "狂战士", "Mardroeme": "蘑菇酒"
};
const CARD_CN = {
  "Ballista": "弩炮", "Blue Stripes Commando": "蓝衣铁卫突击队", "Catapult": "投石机", "Crinfrid Reavers Dragon Hunter": "克林菲德掠夺者猎龙人", "Dethmold": "戴斯摩", "Dun Banner Medic": "褐旗营医生", "Esterad Thyssen": "艾斯特拉德·泰森", "Foltest: King of Temeria": "弗尔泰斯特：泰莫利亚国王", "Foltest: Lord Commander of the North": "弗尔泰斯特：北方统帅", "Foltest: Son of Medell": "弗尔泰斯特：梅德尔之子", "Foltest: The Siegemaster": "弗尔泰斯特：攻城大师", "Foltest: The Steel-Forged": "弗尔泰斯特：钢铁铸就", "John Natalis": "约翰·纳塔利斯", "Kaedweni Siege Expert": "科德温攻城专家", "Keira Metz": "凯拉·梅兹", "Philippa Eilhart": "菲丽芭·艾哈特", "Poor Fucking Infantry": "可怜步兵", "Prince Stennis": "史坦尼斯王子", "Redanian Foot Soldier": "瑞达尼亚步兵", "Sabrina Glevissig": "萨宾娜·葛丽维希格", "Sheldon Skaggs": "谢尔顿·斯卡格斯", "Siege Tower": "攻城塔", "Siegfried of Denesle": "丹德里恩的齐格弗里德", "Sigismund Dijkstra": "西吉斯蒙德·迪科斯彻", "Síle de Tansarville": "席儿·德·坦沙维耶", "Thaler": "塔勒", "Trebuchet": "抛石机", "Vernon Roche": "弗农·罗契", "Ves": "薇丝", "Yarpen Zigrin": "亚尔潘·齐格林",
  "Albrich": "阿尔布里希", "Assire var Anahid": "亚席蕾·瓦·阿纳希德", "Black Infantry Archer": "黑步兵弓箭手", "Cahir Mawr Dyffryn aep Ceallach": "卡希尔·毛尔·迪夫林·艾普·齐拉赫", "Cynthia": "辛西娅", "Emhyr var Emreis: Emperor of Nilfgaard": "恩希尔·恩瑞斯：尼弗迦德皇帝", "Emhyr var Emreis: His Imperial Majesty": "恩希尔·恩瑞斯：皇帝陛下", "Emhyr var Emreis: Invader of the North": "恩希尔·恩瑞斯：北方入侵者", "Emhyr var Emreis: The Relentless": "恩希尔·恩瑞斯：无情者", "Emhyr var Emreis: The White Flame": "恩希尔·恩瑞斯：白焰", "Etolian Auxiliary Archers": "艾托利亚辅助弓箭手", "Fringilla Vigo": "芙琳吉拉·薇歌", "Heavy Zerrikanian Fire Scorpion": "重型泽瑞坎火蝎", "Impera Brigade Guard": "帝国旅卫兵", "Letho of Gulet": "古雷特的雷索", "Menno Coehoorn": "门诺·寇霍恩", "Morteisen": "莫泰森", "Morvran Voorhis": "莫尔凡·沃希斯", "Nausicaa Cavalry Rider": "娜乌西卡骑兵", "Puttkammer": "普特卡默", "Rainfarn": "雷恩法恩", "Renuald aep Matsen": "雷努阿德·艾普·马森", "Rotten Mangonel": "腐朽投石车", "Shilard Fitz-Oesterlen": "希拉德·菲茨-奥斯特伦", "Siege Engineer": "攻城工程师", "Siege Technician": "攻城技师", "Stefan Skellen": "史提芬·史凯伦", "Sweers": "史威尔斯", "Tibor Eggebracht": "提伯·艾格布拉赫特", "Vanhemar": "凡赫玛", "Vattier de Rideaux": "瓦提尔·德·李道克斯", "Vreemde": "弗里姆德", "Young Emissary": "年轻特使", "Zerrikanian Fire Scorpion": "泽瑞坎火蝎",
  "Barclay Els": "巴克莱·艾尔斯", "Ciaran aep Easnillien": "希亚兰·艾普·伊斯尼连", "Dennis Cranmer": "丹尼斯·克兰默", "Dol Blathanna Archer": "多尔·布雷坦纳弓箭手", "Dol Blathanna Scout": "多尔·布雷坦纳斥候", "Dwarven Skirmisher": "矮人散兵", "Eithné": "艾思娜", "Elven Skirmisher": "精灵散兵", "Filavandrel aen Fidhail": "菲拉凡德芮·艾恩·菲戴尔", "Francesca Findabair: Daisy of the Valley": "法兰茜丝卡·芬达贝：山谷雏菊", "Francesca Findabair: Hope of the Aen Seidhe": "法兰茜丝卡·芬达贝：艾恩·希迪之望", "Francesca Findabair: Pureblood Elf": "法兰茜丝卡·芬达贝：纯血精灵", "Francesca Findabair: Queen of Dol Blathanna": "法兰茜丝卡·芬达贝：多尔·布雷坦纳女王", "Francesca Findabair: The Beautiful": "法兰茜丝卡·芬达贝：绝世佳人", "Havekar Healer": "哈维卡治疗师", "Havekar Smuggler": "哈维卡走私者", "Ida Emean aep Sivney": "伊达·艾敏·艾普·希芙妮", "Iorveth": "伊欧菲斯", "Isengrim Faoiltiarna": "伊森格林·法欧提亚纳", "Mahakaman Defender": "玛哈坎防卫者", "Milva": "米尔瓦", "Riordain": "瑞欧戴恩", "Saesenthessis": "萨琪亚", "Schirrú": "席鲁", "Toruviel": "托露薇尔", "Vrihedd Brigade Recruit": "维里赫德旅新兵", "Vrihedd Brigade Veteran": "维里赫德旅老兵", "Yaevinn": "亚伊文",
  "Arachas": "蟹蜘蛛", "Arachas Behemoth": "蟹蜘蛛巨兽", "Botchling": "尸婴", "Celaeno Harpy": "赛拉诺鹰身女妖", "Cockatrice": "石化鸡蛇", "Crone: Brewess": "老巫妪：煮婆", "Crone: Weavess": "老巫妪：织婆", "Crone: Whispess": "老巫妪：呢喃婆", "Draug": "卓格", "Earth Elemental": "土元素", "Endrega": "孽鬼虫", "Eredin Bréacc Glas: The Treacherous": "艾瑞汀：背叛者", "Eredin: Bringer of Death": "艾瑞汀：死亡使者", "Eredin: Commander of the Red Riders": "艾瑞汀：红骑士统帅", "Eredin: Destroyer of Worlds": "艾瑞汀：世界毁灭者", "Eredin: King of the Wild Hunt": "艾瑞汀：狂猎之王", "Fiend": "鹿首精怪", "Fire Elemental": "火元素", "Foglet": "小雾妖", "Forktail": "叉尾龙", "Frightener": "惊惧兽", "Gargoyle": "石像鬼", "Ghoul": "食尸鬼", "Grave Hag": "墓穴女巫", "Griffin": "狮鹫", "Harpy": "鹰身女妖", "Ice Giant": "冰巨人", "Imlerith": "伊勒瑞斯", "Kayran": "巨章鱼怪", "Leshen": "鹿首精", "Nekker": "孽鬼", "Plague Maiden": "瘟疫少女", "Toad": "蟾蜍王子", "Vampire: Bruxa": "吸血鬼：女夜魔", "Vampire: Ekimmara": "吸血鬼：艾奇玛拉", "Vampire: Fleder": "吸血鬼：蝠翼魔", "Vampire: Garkain": "吸血鬼：葛凯恩", "Vampire: Katakan": "吸血鬼：卡塔卡恩", "Werewolf": "狼人", "Wyvern": "翼手龙",
  "Berserker": "狂战士", "Birna Bran": "碧儿娜·布兰", "Blueboy Lugos": "蓝小子卢戈斯", "Cerys": "凯瑞丝", "Clan Brokvar Archer": "布洛克瓦家族弓箭手", "Clan Dimun Pirate": "迪门家族海盗", "Clan Drummond Shield Maiden": "德拉蒙家族盾女", "Clan Heymaey Skald": "海梅家族吟游诗人", "Clan Tordarroch Armorsmith": "托达洛克家族护甲匠", "Clan an Craite Warrior": "奎特家族战士", "Crach an Craite": "克拉奇·奎特", "Donar an Hindar": "多纳·安·辛达", "Draig Bon-Dhu": "德莱格·邦杜", "Ermion": "尔米亚", "Hjalmar": "哈尔玛", "Holger Blackhand": "霍格·黑手", "Kambi": "坎比", "King Bran": "布兰王", "Light Longship": "轻型长船", "Madman Lugos": "疯子卢戈斯", "Mardroeme": "蘑菇酒", "Olaf": "奥拉夫", "Svanrige": "斯凡瑞吉", "Transformed Bear": "狂战士熊", "Udalryk": "乌达瑞克", "War Longship": "战争长船", "Young Berserker": "年轻狂战士",
  "Biting Frost": "刺骨冰霜", "Bovine Defense Force": "牛魔防卫军", "Cirilla Fiona Elen Riannon": "希里·菲欧娜·艾伦·丽安伦", "Clear Weather": "晴天", "Commander's Horn": "指挥号角", "Cow": "奶牛", "Dandelion": "丹德里恩", "Decoy": "诱饵", "Emiel Regis Rohellec Terzieff": "艾米尔·雷吉斯", "Gaunter O'Dimm": "镜子大师", "Gaunter O'Dimm: Darkness": "镜子大师：黑暗", "Geralt of Rivia": "利维亚的杰洛特", "Hemdall": "海姆达尔", "Impenetrable Fog": "蔽日浓雾", "Mysterious Elf": "神秘精灵", "Olgierd von Everec": "欧吉尔德·伊佛瑞克", "Scorch": "灼烧", "Skellige Storm": "史凯利杰风暴", "Torrential Rain": "倾盆大雨", "Triss Merigold": "特莉丝·梅莉葛德", "Vesemir": "维瑟米尔", "Villentretenmerth": "维兰特雷坦梅斯", "Yennefer of Vengerberg": "温格堡的叶奈法", "Zoltan Chivay": "卓尔坦·齐瓦"
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
// 将 parent 的子节点协调为 desired 顺序，且只在确有差异时才操作 DOM。
// 若顺序与内容完全一致则零 DOM 改动，避免重新 append 已有节点导致的重绘闪烁。
function reconcileChildren(parent, desired) {
  const current = parent.childNodes;
  // 已经完全一致：不做任何操作
  let same = current.length === desired.length;
  if (same) {
    for (let i = 0; i < desired.length; i++) {
      if (current[i] !== desired[i]) { same = false; break; }
    }
  }
  if (same) return;
  // 关键修复：先移除所有不在 desired 中的现有子节点（如已打出的手牌、思考态遮罩）。
  // 旧算法直接从头逐位 insertBefore，遇到“从中间删掉一张牌”会级联移动其后所有节点
  // （删第 3 张 → 后面 6 张全部 insertBefore），触发整排手牌大重排，视觉上就是“闪一下”。
  // 先删无关节点后，剩余节点顺序与 desired 天然一致，下面的对齐几乎零移动。
  const desiredSet = new Set(desired);
  const snapshot = Array.prototype.slice.call(current);
  for (const node of snapshot) {
    if (!desiredSet.has(node)) parent.removeChild(node);
  }
  // 逐位对齐：仅在真正错位处插入（新增节点 / 顺序变化），匹配处保持不动
  for (let i = 0; i < desired.length; i++) {
    const node = desired[i];
    const atPos = parent.childNodes[i];
    if (atPos !== node) parent.insertBefore(node, atPos || null);
  }
  // 兜底：移除可能残余的多余尾部节点
  while (parent.childNodes.length > desired.length) {
    parent.removeChild(parent.lastChild);
  }
}
const clone = obj => JSON.parse(JSON.stringify(obj));
const shuffle = arr => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
const SAVED_DECKS_KEY = "gwent.savedDecks.v1";
const LAST_SELECTION_KEY = "gwent.lastSelectionByFaction.v1";
const MATCH_HISTORY_KEY = "gwent.matchHistory.v1";
const MAX_SAVED_DECKS_PER_FACTION = 5;
const MAX_MATCH_HISTORY = 50;
const BROWSER_CARD_LIMIT = 96;
const RANDOM_STRONG_DECK_VALUE = "__random_strong_deck__";

fetch("gwent_cards.json")
  .then(r => r.json())
  .then(data => {
    DB = data;
    $("#loader").classList.add("hidden");
    $("#setup").classList.remove("hidden");
    initSetup();
  })
  .catch(err => {
    $("#loader").textContent = "卡牌数据加载失败：" + err.message + "。请通过本目录启动本地服务器后再打开 index.html。";
  });

function initSetup() {
  renderRulesMini();
  ensureQuickStartDecks();
  setupLazyImageObserver();
  bindTopControls();
  renderPlayerSetups();
  renderBrowser();
  renderMatchHistory();
  observeLazyImages();
}

function renderRulesMini() {
  const el = $("#rulesMini");
  el.innerHTML = `
    <strong>核心规则</strong>
    <ul>
      <li>三回合两胜，轮流打牌或放弃。</li>
      <li>近战 / 远程 / 攻城三行分别计分。</li>
      <li>天气、号角、间谍、医生、集结、灼烧等能力已实现核心效果。</li>
      <li>复杂领袖与少数特殊牌采用自动化简化处理。</li>
    </ul>`;
}

function setupLazyImageObserver() {
  if (lazyImageObserver || typeof IntersectionObserver === "undefined") return;
  lazyImageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      loadLazyImage(entry.target);
      lazyImageObserver.unobserve(entry.target);
    });
  }, { rootMargin: "240px 0px" });
}

function observeLazyImages(root = document) {
  const imgs = $$('img[data-src]', root);
  if (!imgs.length) return;
  if (!lazyImageObserver) {
    imgs.forEach(loadLazyImage);
    return;
  }
  imgs.forEach(img => lazyImageObserver.observe(img));
}

// 兜底巡检：本地卡图可能在 <img onload> 绑定前就 complete（命中缓存/bfcache），
// 导致 loading-art 未被移除（img 半透明发灰，像“闪一下没加载出来”）。
// 每帧渲染末尾按图片真实状态校正一次即可；仍在加载中的图交给内联 onload/onerror。
function reconcileArtFrames(root = document) {
  for (const frame of $$('.art-frame', root)) {
    const img = frame.querySelector('img');
    if (!img || img.dataset.src) continue; // 懒加载占位交给懒加载流程
    if (!img.complete) continue;           // 未完成：内联 onload/onerror 会处理
    if (img.naturalWidth > 0) frame.classList.remove('loading-art', 'no-art');
    else { frame.classList.remove('loading-art'); frame.classList.add('no-art'); }
  }
}

function loadLazyImage(img) {
  const src = img.dataset.src;
  if (!src) return;
  const frame = img.parentElement;
  img.onload = () => frame?.classList.remove("loading-art", "no-art");
  img.onerror = () => {
    frame?.classList.remove("loading-art");
    frame?.classList.add("no-art");
    img.remove();
  };
  img.src = src;
  img.removeAttribute("data-src");
}

function ensureQuickStartDecks() {
  setup.players.forEach((player, index) => {
    const isAISystem = setup.mode === "ai" && index === 1;
    if (isAISystem) return;
    const leaders = leadersFor(player.faction);
    if (!player.leaderId || !leaders.some(l => l.id === player.leaderId)) player.leaderId = leaders[0]?.id || "";
    if (!player.deckIds.length) {
      autoDeck(index);
      player.builderExpanded = false;
    }
  });
}

function bindTopControls() {
  $$('input[name="mode"]').forEach(r => r.addEventListener("change", () => {
    setup.mode = $('input[name="mode"]:checked').value;
    setup.players[1].name = setup.mode === "ai" ? "系统" : "玩家二";
    ensureQuickStartDecks();
    renderPlayerSetups();
  }));
  $("#startGame").addEventListener("click", startGame);
  $("#autoPlayBtn").addEventListener("click", autoPlayForHuman);
  $("#randomizeAll").addEventListener("click", () => {
    setup.players.forEach((p, i) => {
      p.faction = FACTIONS[Math.floor(Math.random() * FACTIONS.length)];
      const leaders = leadersFor(p.faction);
      p.leaderId = leaders[0]?.id || "";
      if (setup.mode === "ai" && i === 1) p.deckIds = [];
      else {
        autoDeck(i);
        markManualDeckChanged(p);
      }
    });
    renderPlayerSetups();
  });
  $("#browserFaction").addEventListener("change", () => { browserState.open = true; renderBrowser(); });
  $("#browserSearch").addEventListener("input", () => { browserState.open = true; renderBrowser(); });
  document.addEventListener("click", event => {
    const statBtn = event.target.closest(".stat-filter");
    if (statBtn) {
      event.preventDefault();
      browserState.open = true;
      if (statBtn.dataset.expansion) browserState.expansion = statBtn.dataset.expansion;
      if (statBtn.dataset.view) browserState.view = statBtn.dataset.view;
      renderBrowser();
      return;
    }
    const detailBtn = event.target.closest(".card-detail-btn");
    if (detailBtn) {
      event.preventDefault();
      event.stopPropagation();
      const card = cardById(detailBtn.dataset.cardId);
      if (card) showCardDetails(card);
      return;
    }
    if (event.target.closest("[data-close-card-modal]")) closeCardDetails();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (pendingPlacement?.kind === "revive") cancelRevive();
      else if (pendingPlacement?.kind === "decoy") cancelDecoy();
      else if (pendingPlacement) cancelPlacement();
      closeCardDetails();
      return;
    }
    handleGameHotkeys(event);
  });
  $("#passBtn").addEventListener("click", passRound);
  $("#leaderBtn").addEventListener("click", useLeader);
  $("#quickRestartBtn").addEventListener("click", () => startGame());
  $("#restartBtn").addEventListener("click", () => {
    if (game && !game.over) surrender();
    else returnToSetup();
  });
  $("#clearLog").addEventListener("click", () => $("#log").innerHTML = "");
  $("#clearHistoryBtn").addEventListener("click", () => {
    writeStorageJSON(MATCH_HISTORY_KEY, []);
    renderMatchHistory();
  });
  updateStartButton();
}

function handleGameHotkeys(event) {
  if (!game) return;
  const target = event.target;
  const tag = target?.tagName?.toLowerCase();
  if (tag === "input" || tag === "select" || tag === "textarea" || target?.isContentEditable) return;
  if (event.key === " " || event.code === "Space") {
    event.preventDefault();
    if (mulligan) {
      $("#mulliganDone")?.click();
    } else if (game.over) {
      $("#quickRestartBtn")?.click();
    } else if (!isAITurn() && !pendingPlacement) {
      autoPlayForHuman();
    }
  } else if (event.key.toLowerCase() === "p") {
    if (!game.over && !mulligan && !pendingPlacement && !isAITurn()) passRound();
  } else if (event.key.toLowerCase() === "l") {
    if (!game.over && !mulligan && !pendingPlacement && !isAITurn()) useLeader();
  } else if (event.key === "Enter" && game.over) {
    $("#quickRestartBtn")?.click();
  }
}

function readStorageJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function writeStorageJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_) {
    return false;
  }
}

function getSavedDeckStore() {
  return readStorageJSON(SAVED_DECKS_KEY, {});
}

function setSavedDeckStore(store) {
  writeStorageJSON(SAVED_DECKS_KEY, store);
}

function savedDecksForFaction(faction) {
  return (getSavedDeckStore()[faction] || []).filter(deck => Array.isArray(deck.deckIds));
}

function getLastSelectionStore() {
  return readStorageJSON(LAST_SELECTION_KEY, {});
}

function setLastSelectionStore(store) {
  writeStorageJSON(LAST_SELECTION_KEY, store);
}

function getMatchHistory() {
  return readStorageJSON(MATCH_HISTORY_KEY, []);
}

function saveMatchHistoryEntry(entry) {
  const history = getMatchHistory();
  history.unshift(entry);
  writeStorageJSON(MATCH_HISTORY_KEY, history.slice(0, MAX_MATCH_HISTORY));
}

function formatMatchTime(iso) {
  try {
    return new Date(iso).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch (_) {
    return "未知时间";
  }
}

function renderMatchHistory() {
  const statsEl = $("#historyStats");
  const listEl = $("#historyList");
  if (!statsEl || !listEl) return;
  const history = getMatchHistory();
  const wins = history.filter(item => item.result === "win").length;
  const losses = history.filter(item => item.result === "loss").length;
  const draws = history.filter(item => item.result === "draw").length;
  const total = history.length;
  const winRate = total ? Math.round((wins / total) * 100) : 0;
  statsEl.innerHTML = [
    `总场次 ${total}`,
    `胜 ${wins}`,
    `负 ${losses}`,
    `平 ${draws}`,
    `胜率 ${winRate}%`
  ].map(text => `<span class="history-stat">${text}</span>`).join("");
  if (!history.length) {
    listEl.innerHTML = `<div class="empty-history">还没有战绩。完成一局后会自动记录在这里。</div>`;
    return;
  }
  listEl.innerHTML = history.slice(0, 12).map(item => {
    const roundsHTML = item.roundResults && item.roundResults.length
      ? item.roundResults.map(r => {
          const result = r.winner == null ? "平" : (r.winner === 0 ? "胜" : "负");
          return `<span class="round-chip ${result === "胜" ? "win" : result === "负" ? "loss" : "draw"}">第${r.round}局 ${r.scores[0]}:${r.scores[1]}(${result})</span>`;
        }).join(" ")
      : "";
    const isSurrender = item.endReason === "surrender";
    const surrenderBadge = isSurrender
      ? `<span class="surrender-badge">${item.surrenderBy === 0 ? "主动认输" : "对手认输"}</span>`
      : "";
    const surrenderNote = isSurrender
      ? `<div class="history-surrender-note">${item.surrenderBy === 0 ? "本局中途认输，未打满三局" : "对手中途认输，提前获胜"}</div>`
      : "";
    return `
    <div class="history-item ${item.result}">
      <div>
        <strong>${item.resultText}</strong>
        ${surrenderBadge}
        <span>${formatMatchTime(item.finishedAt)}｜${item.mode === "ai" ? "人机对战" : "本地双人"}</span>
      </div>
      <div>${escapeHtml(item.playerFaction)} 对 ${escapeHtml(item.opponentFaction)}</div>
      <div>小局比分 ${item.roundScore}</div>
      ${roundsHTML ? `<div class="history-rounds">${roundsHTML}</div>` : ""}
      ${surrenderNote}
    </div>`;
  }).join("");
}

function recordCurrentMatchHistory(finalWinner, finalScores) {
  if (!game || game.historyRecorded) return;
  const result = finalWinner == null ? "draw" : (finalWinner === 0 ? "win" : "loss");
  const bySurrender = game.endReason === "surrender";
  const playerSurrendered = bySurrender && game.surrenderBy === 0;
  const oppSurrendered = bySurrender && game.surrenderBy === 1;
  let resultText = result === "draw" ? "平局" : (result === "win" ? "胜利" : "失败");
  if (playerSurrendered) resultText = "失败（认输）";
  else if (oppSurrendered) resultText = "胜利（对手认输）";
  saveMatchHistoryEntry({
    id: `match-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    finishedAt: new Date().toISOString(),
    mode: game.mode,
    result,
    resultText,
    endReason: bySurrender ? "surrender" : "normal",
    surrenderBy: bySurrender ? game.surrenderBy : null,
    winner: finalWinner,
    playerFaction: factionName(game.players[0].faction),
    opponentFaction: factionName(game.players[1].faction),
    roundScore: `${game.players[0].roundsWon} : ${game.players[1].roundsWon}`,
    finalScores: finalScores || [0, 0],
    roundResults: (game.roundResults || []).map(r => ({ round: r.round, scores: r.scores, winner: r.winner }))
  });
  game.historyRecorded = true;
}

function rememberPlayerSelection(player, savedDeckId = player.activeSavedDeckId || "") {
  if (!player || !player.faction) return;
  const store = getLastSelectionStore();
  store[player.faction] = {
    faction: player.faction,
    leaderId: player.leaderId || "",
    deckIds: [...(player.deckIds || [])],
    savedDeckId,
    updatedAt: new Date().toISOString()
  };
  setLastSelectionStore(store);
}

function applyLastSelectionForFaction(player) {
  const saved = getLastSelectionStore()[player.faction];
  if (!saved) return false;
  if (saved.leaderId && cardById(saved.leaderId)) player.leaderId = saved.leaderId;
  player.deckIds = (saved.deckIds || []).filter(id => cardById(id));
  player.activeSavedDeckId = saved.savedDeckId || "";
  return true;
}

function saveDeckForPlayer(player, rawName) {
  const name = (rawName || "").trim();
  if (!name) return { ok: false, message: "请先输入卡组名称。" };
  const status = getDeckStatus(player);
  if (!status.valid) return { ok: false, message: `卡组还不完整：${status.message}` };
  const store = getSavedDeckStore();
  const list = store[player.faction] || [];
  const existingIndex = list.findIndex(deck => deck.name === name);
  if (existingIndex < 0 && list.length >= MAX_SAVED_DECKS_PER_FACTION) {
    return { ok: false, message: `${factionName(player.faction)}最多保存 ${MAX_SAVED_DECKS_PER_FACTION} 个卡组，请先删除一个。` };
  }
  const deck = {
    id: existingIndex >= 0 ? list[existingIndex].id : `deck-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    faction: player.faction,
    leaderId: player.leaderId,
    deckIds: [...player.deckIds],
    updatedAt: new Date().toISOString()
  };
  if (existingIndex >= 0) list[existingIndex] = deck;
  else list.unshift(deck);
  store[player.faction] = list;
  setSavedDeckStore(store);
  player.activeSavedDeckId = deck.id;
  player.editingDeckId = deck.id;
  rememberPlayerSelection(player, deck.id);
  return { ok: true, message: `已保存卡组“${name}”。` };
}

function updateSavedDeck(player, deckId, rawName) {
  const store = getSavedDeckStore();
  const list = store[player.faction] || [];
  const index = list.findIndex(deck => deck.id === deckId);
  if (index < 0) return { ok: false, message: "找不到要编辑的卡组。" };
  const status = getDeckStatus(player);
  if (!status.valid) return { ok: false, message: `卡组还不完整：${status.message}` };
  const name = (rawName || list[index].name || "").trim();
  if (!name) return { ok: false, message: "请先输入卡组名称。" };
  const nameClash = list.some((deck, i) => i !== index && deck.name === name);
  if (nameClash) return { ok: false, message: `已存在同名卡组“${name}”，请换个名字。` };
  list[index] = {
    ...list[index],
    name,
    leaderId: player.leaderId,
    deckIds: [...player.deckIds],
    updatedAt: new Date().toISOString()
  };
  store[player.faction] = list;
  setSavedDeckStore(store);
  player.activeSavedDeckId = deckId;
  player.editingDeckId = deckId;
  rememberPlayerSelection(player, deckId);
  return { ok: true, message: `已更新卡组“${name}”。` };
}

function loadSavedDeck(player, deckId) {
  const deck = savedDecksForFaction(player.faction).find(item => item.id === deckId);
  if (!deck) return false;
  player.leaderId = deck.leaderId;
  player.deckIds = deck.deckIds.filter(id => cardById(id));
  player.activeSavedDeckId = deck.id;
  player.editingDeckId = deck.id;
  rememberPlayerSelection(player, deck.id);
  return true;
}

function deleteSavedDeck(player, deckId) {
  const store = getSavedDeckStore();
  store[player.faction] = (store[player.faction] || []).filter(deck => deck.id !== deckId);
  setSavedDeckStore(store);
  if (player.editingDeckId === deckId) player.editingDeckId = "";
  if (player.activeSavedDeckId === deckId) {
    player.activeSavedDeckId = "";
    rememberPlayerSelection(player, "");
  }
}

function markManualDeckChanged(player) {
  if (player.editingDeckId) {
    player.activeSavedDeckId = player.editingDeckId;
    rememberPlayerSelection(player, player.editingDeckId);
    return;
  }
  player.activeSavedDeckId = "";
  rememberPlayerSelection(player, "");
}

function randomizeFactionLeader(playerIndex) {
  const p = setup.players[playerIndex];
  const isAISystem = playerIndex === 1 && setup.mode === "ai";
  const faction = FACTIONS[Math.floor(Math.random() * FACTIONS.length)];
  p.faction = faction;
  const leaders = leadersFor(faction);
  p.leaderId = leaders.length ? leaders[Math.floor(Math.random() * leaders.length)].id : "";
  p.deckIds = [];
  p.activeSavedDeckId = "";
  p.editingDeckId = "";
  p.lastAppliedFaction = isAISystem ? faction : null;
  if (!isAISystem) {
    applyLastSelectionForFaction(p);
    if (!p.deckIds.length) autoDeck(playerIndex);
    p.builderExpanded = false;
    p.lastAppliedFaction = faction;
  }
}

function captureSetupScroll(playerIndex = 0) {
  const configs = $$("#playerSetups .player-config");
  const builder = configs[playerIndex] ? $(".deck-builder", configs[playerIndex]) : null;
  return {
    playerIndex,
    windowX: window.scrollX,
    windowY: window.scrollY,
    builderTop: builder ? builder.scrollTop : 0,
    activeElementName: document.activeElement?.className || ""
  };
}

function restoreSetupScroll(snapshot) {
  if (!snapshot) return;
  requestAnimationFrame(() => {
    const configs = $$("#playerSetups .player-config");
    const builder = configs[snapshot.playerIndex] ? $(".deck-builder", configs[snapshot.playerIndex]) : null;
    if (builder) builder.scrollTop = snapshot.builderTop;
    window.scrollTo(snapshot.windowX, snapshot.windowY);
  });
}

function renderPlayerSetupsKeepingScroll(playerIndex = 0) {
  const snapshot = captureSetupScroll(playerIndex);
  renderPlayerSetups();
  restoreSetupScroll(snapshot);
}

function renderPlayerSetups() {
  const wrap = $("#playerSetups");
  wrap.innerHTML = "";
  wrap.classList.toggle("ai-layout", setup.mode === "ai");
  setup.players.forEach((p, idx) => {
    const isAISystem = idx === 1 && setup.mode === "ai";
    if (isAISystem) p.name = "系统";
    const tpl = $("#playerSetupTpl").content.cloneNode(true);
    const root = $(".player-config", tpl);
    root.classList.toggle("ai-system-config", isAISystem);
    $(".player-title", root).textContent = idx === 0 ? "2. 玩家一配置" : (isAISystem ? "3. 系统配置" : "3. 玩家二配置");
    const factionSel = $(".faction-select", root);
    factionSel.innerHTML = FACTIONS.map(f => `<option value="${escapeAttr(f)}">${factionName(f)}</option>`).join("");
    factionSel.value = p.faction;
    factionSel.addEventListener("change", () => {
      p.faction = factionSel.value;
      const leaders = leadersFor(p.faction);
      p.leaderId = leaders[0]?.id || "";
      p.deckIds = [];
      p.activeSavedDeckId = "";
      p.editingDeckId = "";
      p.builderExpanded = false;
      p.lastAppliedFaction = null;
      if (!isAISystem) {
        applyLastSelectionForFaction(p);
        if (!p.deckIds.length) autoDeck(idx);
      }
      renderPlayerSetups();
    });
    const leaderSel = $(".leader-select", root);
    const leaders = leadersFor(p.faction);
    if (!p.leaderId || !leaders.some(l => l.id === p.leaderId)) p.leaderId = leaders[0]?.id || "";
    if (!isAISystem && p.lastAppliedFaction !== p.faction) {
      applyLastSelectionForFaction(p);
      p.lastAppliedFaction = p.faction;
      if (!p.leaderId || !leaders.some(l => l.id === p.leaderId)) p.leaderId = leaders[0]?.id || "";
    }
    leaderSel.innerHTML = leaders.map(l => `<option value="${l.id}">${cardName(l)}</option>`).join("");
    leaderSel.value = p.leaderId;
    leaderSel.addEventListener("change", () => {
      p.leaderId = leaderSel.value;
      if (!isAISystem) markManualDeckChanged(p);
      renderPlayerSetups();
    });
    const leader = cardById(p.leaderId);
    $(".leader-desc", root).textContent = leader ? `领袖能力：${cardAbilityText(leader)}` : "未找到领袖牌";
    renderLeaderPreview(root, leader);
    const autoBtn = $(".auto-deck", root);
    const clearBtn = $(".clear-deck", root);
    if (isAISystem) {
      autoBtn.remove();
      clearBtn.remove();
      p.deckIds = [];
      const difficultyLabel = document.createElement("label");
      difficultyLabel.textContent = "难度 ";
      const difficultySelect = document.createElement("select");
      difficultySelect.className = "difficulty-select";
      difficultySelect.innerHTML = Object.entries(DIFFICULTY_CN).map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
      difficultySelect.value = p.difficulty || "normal";
      difficultySelect.addEventListener("change", () => {
        p.difficulty = difficultySelect.value;
        renderPlayerSetups();
      });
      difficultyLabel.appendChild(difficultySelect);
      $(".config-row", root).appendChild(difficultyLabel);
      const randomBtn = document.createElement("button");
      randomBtn.type = "button";
      randomBtn.className = "random-faction-leader";
      randomBtn.textContent = "随机阵营/领袖";
      randomBtn.addEventListener("click", () => {
        randomizeFactionLeader(idx);
        renderPlayerSetups();
      });
      $(".config-row", root).appendChild(randomBtn);
      const deckBuilder = $(".deck-builder", root);
      deckBuilder.className = "ai-deck-note";
      const difficulty = p.difficulty || "normal";
      const difficultyConfig = systemDeckConfig(difficulty);
      deckBuilder.innerHTML = `<strong>系统卡组将自动生成</strong><p class="hint">${difficultyConfig.description}</p><div class="difficulty-detail"><span>单位目标 ${difficultyConfig.unitTarget}</span><span>特殊牌 ${difficultyConfig.specialTarget}</span><span>强卡池范围 ${Math.round(difficultyConfig.topRatio * 100)}%</span></div>`;
      $(".deck-summary", root).textContent = `系统开局自动组牌：${DIFFICULTY_CN[difficulty]}`;
    } else {
      renderSavedDeckTools(root, idx);
      autoBtn.addEventListener("click", () => { autoDeck(idx); p.builderExpanded = false; markManualDeckChanged(p); renderPlayerSetups(); });
      clearBtn.addEventListener("click", () => { p.deckIds = []; p.builderExpanded = true; markManualDeckChanged(p); renderPlayerSetups(); });
      const randomBtn = document.createElement("button");
      randomBtn.type = "button";
      randomBtn.className = "random-faction-leader";
      randomBtn.textContent = "随机阵营/领袖";
      randomBtn.addEventListener("click", () => {
        randomizeFactionLeader(idx);
        p.builderExpanded = false;
        renderPlayerSetups();
      });
      $(".config-row", root).appendChild(randomBtn);
      const status = getDeckStatus(p);
      if (!p.builderExpanded && status.valid) renderCollapsedDeckBuilder(root, idx, status);
      else renderDeckBuilder(root, idx);
    }
    wrap.appendChild(tpl);
  });
  updateStartButton();
  observeLazyImages(wrap);
}

function renderLeaderPreview(root, leader) {
  const preview = document.createElement("div");
  preview.className = "leader-preview";
  if (!leader) {
    preview.innerHTML = `<div class="hint">未找到领袖牌。</div>`;
  } else {
    preview.innerHTML = `
      ${cardImageHTML(leader, "leader-preview-art", true)}
      <div class="leader-preview-copy">
        <strong>${escapeHtml(cardName(leader))}</strong>
        <span>${factionName(leader.faction)}｜${categoryName(leader.category)}</span>
        <p>${cardAbilityText(leader)}</p>
      </div>`;
  }
  root.insertBefore(preview, $(".deck-builder", root));
}

function renderSavedDeckTools(root, playerIndex) {
  const p = setup.players[playerIndex];
  const decks = savedDecksForFaction(p.faction);
  if (p.editingDeckId && !decks.some(d => d.id === p.editingDeckId)) p.editingDeckId = "";
  const editingDeck = decks.find(d => d.id === p.editingDeckId);
  const panel = document.createElement("div");
  panel.className = "saved-deck-tools";
  panel.innerHTML = `
    <div class="saved-deck-row">
      <label>选择卡组${decks.length ? ` <span class="deck-count-badge">${decks.length}/${MAX_SAVED_DECKS_PER_FACTION}</span>` : ""}
        <select class="saved-deck-select">
          <option value="">手动选择当前卡牌</option>
          <option value="${RANDOM_STRONG_DECK_VALUE}">随机强力卡组</option>
          ${decks.map(deck => `<option value="${escapeAttr(deck.id)}">${escapeHtml(deck.name)}（${deck.deckIds.length}张）</option>`).join("")}
        </select>
      </label>
      <button class="edit-saved-deck" type="button" ${decks.length ? "" : "disabled"}>${editingDeck ? "退出编辑" : "编辑卡组"}</button>
      <button class="delete-saved-deck" type="button" ${decks.length ? "" : "disabled"}>删除</button>
    </div>
    ${editingDeck ? `
    <div class="saved-deck-editing">
      <span class="editing-badge">正在编辑：${escapeHtml(editingDeck.name)}</span>
      <label>保存名称 <input class="edit-name-input" maxlength="18" value="${escapeAttr(editingDeck.name)}" /></label>
      <button class="update-deck" type="button">保存修改</button>
      <button class="save-as-new-deck" type="button" ${decks.length >= MAX_SAVED_DECKS_PER_FACTION ? "disabled" : ""}>另存为新卡组</button>
      <button class="cancel-edit" type="button">退出编辑</button>
      <span class="saved-deck-hint">在下方调整领袖和卡牌后，点"保存修改"覆盖该卡组。</span>
    </div>` : `
    <div class="saved-deck-row">
      <label>保存名称 <input class="deck-name-input" maxlength="18" placeholder="这里只是卡组名，不用于检索" /></label>
      <button class="save-current-deck" type="button" ${decks.length >= MAX_SAVED_DECKS_PER_FACTION ? "disabled" : ""}>保存当前卡组</button>
      <span class="saved-deck-hint">最多保存 ${MAX_SAVED_DECKS_PER_FACTION} 组不同名称的卡组，已保存 ${decks.length} 组。点"编辑"可修改已有卡组，"另存为"保留原卡组创建新组。</span>
    </div>`}`;
  const select = $(".saved-deck-select", panel);
  select.value = p.activeSavedDeckId || "";
  const applyDeckSelect = () => {
    if (select.value === RANDOM_STRONG_DECK_VALUE) {
      generateRandomStrongDeck(playerIndex);
      markManualDeckChanged(p);
      p.editingDeckId = "";
      renderPlayerSetups();
    } else if (select.value && loadSavedDeck(p, select.value)) {
      renderPlayerSetups();
    } else {
      p.activeSavedDeckId = "";
      p.editingDeckId = "";
      rememberPlayerSelection(p, "");
    }
  };
  select.addEventListener("change", applyDeckSelect);
  $(".edit-saved-deck", panel).addEventListener("click", () => {
    if (editingDeck) {
      p.editingDeckId = "";
      renderPlayerSetups();
      return;
    }
    if (!select.value || select.value === RANDOM_STRONG_DECK_VALUE) {
      // 没有选中已保存卡组，但当前可能有手动卡牌，允许直接编辑当前卡组
      if (!p.activeSavedDeckId || p.activeSavedDeckId === RANDOM_STRONG_DECK_VALUE || !decks.some(d => d.id === p.activeSavedDeckId)) {
        $("#setupStatus").textContent = "请先在下拉框选择或在下方保存一个卡组后再编辑。";
        $("#setupStatus").classList.remove("ready");
        return;
      }
      p.editingDeckId = p.activeSavedDeckId;
    } else {
      if (!loadSavedDeck(p, select.value)) return;
      p.editingDeckId = select.value;
    }
    renderPlayerSetups();
  });
  $(".delete-saved-deck", panel).addEventListener("click", () => {
    if (!select.value || select.value === RANDOM_STRONG_DECK_VALUE) return;
    deleteSavedDeck(p, select.value);
    renderPlayerSetups();
  });
  if (editingDeck) {
    $(".update-deck", panel).addEventListener("click", () => {
      const result = updateSavedDeck(p, p.editingDeckId, $(".edit-name-input", panel).value);
      $("#setupStatus").textContent = result.message;
      $("#setupStatus").classList.toggle("ready", result.ok);
      if (result.ok) renderPlayerSetups();
    });
    $(".cancel-edit", panel).addEventListener("click", () => {
      p.editingDeckId = "";
      renderPlayerSetups();
    });
    $(".save-as-new-deck", panel).addEventListener("click", () => {
      const result = saveDeckForPlayer(p, $(".edit-name-input", panel).value);
      $("#setupStatus").textContent = result.message;
      $("#setupStatus").classList.toggle("ready", result.ok);
      if (result.ok) renderPlayerSetups();
    });
  } else {
    $(".save-current-deck", panel).addEventListener("click", () => {
      const result = saveDeckForPlayer(p, $(".deck-name-input", panel).value);
      $("#setupStatus").textContent = result.message;
      $("#setupStatus").classList.toggle("ready", result.ok);
      if (result.ok) renderPlayerSetups();
    });
  }
  root.insertBefore(panel, $(".deck-builder", root));
}

function renderCollapsedDeckBuilder(root, playerIndex, status) {
  const p = setup.players[playerIndex];
  const deckBuilder = $(".deck-builder", root);
  deckBuilder.className = "deck-builder collapsed-deck-builder";
  $(".deck-summary", root).textContent = `已选 ${p.deckIds.length} 张：单位 ${status.units}/22，特殊 ${status.specials}/10`;
  const strongest = status.selected.slice().sort((a, b) => cardSortValue(b) - cardSortValue(a)).slice(0, 5).map(cardName).join("、");
  deckBuilder.innerHTML = `
    <strong>已准备好推荐卡组</strong>
    <p class="hint">为保证配置页加载流畅，默认收起完整卡池。想手动换牌时再展开编辑。</p>
    <div class="collapsed-deck-meta">
      <span>单位 ${status.units}</span>
      <span>特殊 ${status.specials}</span>
      <span>强力牌：${escapeHtml(strongest || "暂无")}</span>
    </div>
    <button class="expand-deck-builder" type="button">展开编辑卡组</button>`;
  $(".expand-deck-builder", deckBuilder).addEventListener("click", () => {
    p.builderExpanded = true;
    renderPlayerSetupsKeepingScroll(playerIndex);
  });
}

function renderDeckBuilder(root, playerIndex) {
  const p = setup.players[playerIndex];
  const eligible = eligibleCards(p.faction).sort((a, b) => cardSortValue(b) - cardSortValue(a));
  const groups = groupCards(eligible).sort((a, b) => cardSortValue(b.card) - cardSortValue(a.card));
  const units = p.deckIds.map(cardById).filter(c => c && (c.category === "unit" || c.category === "hero")).length;
  const specials = p.deckIds.map(cardById).filter(c => c && (c.category === "special" || c.category === "weather")).length;
  $(".deck-summary", root).textContent = `已选 ${p.deckIds.length} 张：单位 ${units}/22，特殊 ${specials}/10`;
  const tools = document.createElement("div");
  tools.className = "deck-search-tools";
  tools.innerHTML = `
    <div class="deck-search-row">
      <label>检索卡牌 <input class="deck-card-search" placeholder="输入卡牌名 / 能力 / 阵营 / 类型" value="${escapeAttr(p.cardSearch || "")}" /></label>
      <button class="deck-search-submit" type="button">检索</button>
      <button class="deck-search-clear" type="button" title="清除检索">清除</button>
      <span class="deck-search-count"></span>
    </div>
    <div class="deck-quick-filters">${quickFilterChipsHTML(groups, p)}</div>
    <span class="deck-search-note">当前可选卡池包含 ${factionName(p.faction)} 和中立牌。点击下方标签可快速筛选。</span>`;
  $(".deck-builder", root).appendChild(tools);
  const list = document.createElement("div");
  list.className = "deck-list";
  groups.forEach(group => {
    const selectedIds = group.cards.filter(card => p.deckIds.includes(card.id)).map(card => card.id);
    const div = document.createElement("div");
    div.className = "pick-card grouped-card" + (selectedIds.length ? " selected" : "");
    div.dataset.search = groupSearchText(group);
    div.innerHTML = `${cardHTML(group.card, false, group.cards.length)}
      <div class="quantity-control" aria-label="选择数量">
        <button class="qty-btn minus" type="button" ${selectedIds.length ? "" : "disabled"}>－</button>
        <span class="selected-count">已选 ${selectedIds.length} / ${group.cards.length}</span>
        <button class="qty-btn plus" type="button" ${selectedIds.length >= group.cards.length ? "disabled" : ""}>＋</button>
      </div>`;
    div.addEventListener("click", event => {
      if (event.target.closest("button")) return;
      addCardFromGroup(p, group);
      markManualDeckChanged(p);
      renderPlayerSetupsKeepingScroll(playerIndex);
    });
    $(".plus", div).addEventListener("click", event => {
      event.stopPropagation();
      addCardFromGroup(p, group);
      markManualDeckChanged(p);
      renderPlayerSetupsKeepingScroll(playerIndex);
    });
    $(".minus", div).addEventListener("click", event => {
      event.stopPropagation();
      removeCardFromGroup(p, group);
      markManualDeckChanged(p);
      renderPlayerSetupsKeepingScroll(playerIndex);
    });
    list.appendChild(div);
  });
  $(".deck-builder", root).appendChild(list);
  const searchInput = $(".deck-card-search", root);
  const applyDeckSearch = () => {
    p.cardSearch = searchInput.value;
    filterDeckCardsInRoot(root, p.cardSearch);
    syncQuickFilterActive(root, p.cardSearch);
  };
  searchInput.addEventListener("input", applyDeckSearch);
  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyDeckSearch();
      $(".deck-list", root)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
  $(".deck-search-submit", root).addEventListener("click", () => {
    applyDeckSearch();
    $(".deck-list", root)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    searchInput.focus();
  });
  $(".deck-search-clear", root).addEventListener("click", () => {
    p.cardSearch = "";
    searchInput.value = "";
    filterDeckCardsInRoot(root, "");
    syncQuickFilterActive(root, "");
    searchInput.focus();
  });
  $$(".deck-quick-chip", root).forEach(chip => {
    chip.addEventListener("click", () => {
      const term = chip.dataset.term || "";
      const next = (p.cardSearch || "").trim().toLowerCase() === term.toLowerCase() ? "" : term;
      p.cardSearch = next;
      searchInput.value = next;
      filterDeckCardsInRoot(root, next);
      syncQuickFilterActive(root, next);
    });
  });
  filterDeckCardsInRoot(root, p.cardSearch || "");
  syncQuickFilterActive(root, p.cardSearch || "");
}

function quickFilterChipsHTML(groups, player) {
  const factionChips = [{ label: factionName(player.faction), term: factionName(player.faction) }, { label: "中立", term: "中立" }];
  const catOrder = ["unit", "hero", "weather", "special"];
  const cats = catOrder.filter(cat => groups.some(g => g.card.category === cat))
    .map(cat => ({ label: categoryName(cat), term: categoryName(cat) }));
  const abilitySet = [];
  groups.forEach(g => (g.card.abilities || []).forEach(a => {
    const name = abilityName(a);
    if (name && name !== "英雄" && !abilitySet.some(x => x.term === name)) abilitySet.push({ label: name, term: name });
  }));
  const sections = [
    { title: "阵营", chips: factionChips },
    { title: "类型", chips: cats },
    { title: "能力", chips: abilitySet }
  ];
  return sections.filter(s => s.chips.length).map(s => `
    <div class="quick-filter-section">
      <span class="quick-filter-label">${s.title}</span>
      ${s.chips.map(c => `<button class="deck-quick-chip" type="button" data-term="${escapeAttr(c.term)}">${escapeHtml(c.label)}</button>`).join("")}
    </div>`).join("");
}

function syncQuickFilterActive(root, query) {
  const normalized = String(query || "").trim().toLowerCase();
  $$(".deck-quick-chip", root).forEach(chip => {
    chip.classList.toggle("active", normalized && (chip.dataset.term || "").toLowerCase() === normalized);
  });
}

function filterDeckCardsInRoot(root, query) {
  const normalized = String(query || "").trim().toLowerCase();
  const cards = $$(".deck-list .pick-card", root);
  let visible = 0;
  cards.forEach(cardEl => {
    const matched = !normalized || (cardEl.dataset.search || "").includes(normalized);
    cardEl.classList.toggle("hidden-by-search", !matched);
    if (matched) visible++;
  });
  const countEl = $(".deck-search-count", root);
  if (countEl) countEl.textContent = `显示 ${visible} / ${cards.length} 组`;
}

function renderBrowser() {
  const factionSel = $("#browserFaction");
  if (!factionSel.options.length) {
    factionSel.innerHTML = [`<option value="all">全部阵营</option>`].concat([...FACTIONS, "Neutral"].map(f => `<option value="${escapeAttr(f)}">${factionName(f)}</option>`)).join("");
  }
  const faction = factionSel.value || "all";
  const q = ($("#browserSearch").value || "").toLowerCase();
  if (!browserState.open) {
    $("#browserStats").innerHTML = `
      <span class="stat current-stat">卡牌库共 ${DB.summary.uniqueBaseCards} 种 / ${DB.summary.totalCardCopies} 张</span>
      <button id="openBrowserBtn" class="assist-button" type="button">展开卡牌资料</button>
      <span class="browser-limit-note">默认收起资料卡，减少首屏加载压力；搜索或筛选会自动展开。</span>`;
    $("#browserCards").innerHTML = "";
    $("#openBrowserBtn").addEventListener("click", () => { browserState.open = true; renderBrowser(); });
    return;
  }
  let cards = DB.cards;
  if (faction !== "all") cards = cards.filter(c => c.faction === faction);
  if (browserState.expansion !== "all") cards = cards.filter(c => c.expansion === browserState.expansion);
  if (q) cards = cards.filter(c => [cardName(c, true), c.name, c.baseName, cardAbilityText(c), c.abilityText, c.acquisitionDetails, c.territory, expansionName(c.expansion)].join(" ").toLowerCase().includes(q));
  const stat = DB.summary;
  const groups = groupCards(cards).sort((a, b) => cardSortValue(b.card) - cardSortValue(a.card));
  const active = value => browserState.expansion === value ? " active" : "";
  const viewActive = value => browserState.view === value ? " active" : "";
  const totalItems = browserState.view === "grouped" ? groups.length : cards.length;
  const visibleItems = Math.min(totalItems, BROWSER_CARD_LIMIT);
  $("#browserStats").innerHTML = `
    <div class="stat-group"><span class="stat-label">展示方式</span>
      <button class="stat stat-filter mode-stat${viewActive("copies")}" data-view="copies" type="button">总副本 ${stat.totalCardCopies}</button>
      <button class="stat stat-filter mode-stat${viewActive("grouped")}" data-view="grouped" type="button">唯一牌名 ${stat.uniqueBaseCards}</button>
    </div>
    <div class="stat-group"><span class="stat-label">扩展筛选</span>
      <button class="stat stat-filter expansion-stat${active("all")}" data-expansion="all" type="button">全部 ${DB.cards.length}</button>
      <button class="stat stat-filter expansion-stat${active("Base game")}" data-expansion="Base game" type="button">本体 ${stat.byExpansion["Base game"]}</button>
      <button class="stat stat-filter expansion-stat${active("Hearts of Stone")}" data-expansion="Hearts of Stone" type="button">石之心 ${stat.byExpansion["Hearts of Stone"]}</button>
      <button class="stat stat-filter expansion-stat${active("Blood and Wine")}" data-expansion="Blood and Wine" type="button">血与酒 ${stat.byExpansion["Blood and Wine"]}</button>
    </div>
    <span class="stat current-stat">当前 ${browserState.view === "grouped" ? `${groups.length} 组 / ${cards.length} 张` : `${cards.length} 张`}</span>
    <span class="browser-limit-note">已渲染 ${visibleItems} / ${totalItems}，精确找牌可用搜索或筛选</span>`;
  const browserCardsEl = $("#browserCards");
  if (browserState.view === "grouped") {
    browserCardsEl.innerHTML = groups.slice(0, BROWSER_CARD_LIMIT).map(g => `<div class="pick-card browser-grouped-card">${cardHTML(g.card, false, g.cards.length)}</div>`).join("");
  } else {
    browserCardsEl.innerHTML = cards.slice(0, BROWSER_CARD_LIMIT).map(c => `<div class="pick-card browser-grouped-card">${cardHTML(c, true, 1)}</div>`).join("");
  }
  observeLazyImages(browserCardsEl);
}

function eligibleCards(faction) {
  return DB.cards.filter(c => c.category !== "leader" && (c.faction === faction || c.faction === "Neutral"));
}

function leadersFor(faction) {
  return DB.cards.filter(c => c.category === "leader" && c.faction === faction);
}

function cardById(id) {
  return DB.cards.find(c => c.id === id);
}

function groupCardKey(card) {
  return [card.baseName, card.faction, card.category, card.strength ?? "", (card.row || []).join("/"), (card.abilities || []).join("/")].join("|");
}

function groupCards(cards) {
  const map = new Map();
  cards.forEach(card => {
    const key = groupCardKey(card);
    if (!map.has(key)) map.set(key, { key, card, cards: [] });
    map.get(key).cards.push(card);
  });
  return [...map.values()].map(group => ({ ...group, cards: group.cards.sort((a, b) => a.copyIndex - b.copyIndex) }));
}

function cardSearchText(card) {
  return [
    cardName(card, true), cardName(card), card.name, card.baseName,
    factionName(card.faction), card.faction,
    expansionName(card.expansion), card.expansion,
    categoryName(card.category), card.category,
    rowNameList(card), cardAbilityText(card), card.abilityText,
    ...(card.abilities || []).map(abilityName), ...(card.abilities || [])
  ].join(" ").toLowerCase();
}

function groupSearchText(group) {
  return group.cards.map(cardSearchText).join(" ");
}

function addCardFromGroup(player, group) {
  const next = group.cards.find(card => !player.deckIds.includes(card.id));
  if (next) player.deckIds.push(next.id);
}

function removeCardFromGroup(player, group) {
  const selected = group.cards.filter(card => player.deckIds.includes(card.id));
  const last = selected[selected.length - 1];
  if (last) player.deckIds = player.deckIds.filter(id => id !== last.id);
}

function cardName(card, withCopy = false) {
  const rawName = card.baseName || card.name || "";
  const base = /[\u4e00-\u9fa5]/.test(rawName) ? rawName : (CARD_CN[rawName] || `未译卡牌${card.id ? card.id.replace("card-", "") : ""}`);
  if (!withCopy || !card.copyLabel) return base;
  const n = String(card.copyLabel).match(/\d+/)?.[0] || card.copyIndex || "";
  return n ? `${base}（第${n}张）` : base;
}

function factionName(faction) {
  return FACTION_CN[faction] || faction || "未知阵营";
}

function expansionName(expansion) {
  return EXPANSION_CN[expansion] || expansion || "未知版本";
}

function categoryName(category) {
  return CATEGORY_CN[category] || category || "卡牌";
}

function abilityName(ability) {
  return ABILITY_CN[ability] || ability || "特殊能力";
}

function rowNameList(card) {
  return card.row && card.row.length ? card.row.map(r => ROW_LABELS[r]).join(" / ") : "无固定战场行";
}

function cardAbilityText(card) {
  if (card.leaderAbility) return leaderAbilityText(card);
  const abilities = (card.abilities || []).filter(Boolean).map(abilityName);
  if (abilities.length) return abilities.join("、");
  const specialText = SPECIAL_CARD_CN[card.baseName];
  if (specialText) return specialText;
  if (card.category === "weather") return "天气牌：影响对应战场行。";
  if (card.category === "special") return "特殊牌：打出后立即结算。";
  return "普通单位牌。";
}

const SPECIAL_CARD_CN = {
  "Biting Frost": "刺骨冰霜：双方近战行所有非英雄单位战力变为 1。",
  "Impenetrable Fog": "蔽日浓雾：双方远程行所有非英雄单位战力变为 1。",
  "Torrential Rain": "倾盆大雨：双方攻城行所有非英雄单位战力变为 1。",
  "Skellige Storm": "史凯利杰风暴：双方远程和攻城行所有非英雄单位战力变为 1。",
  "Clear Weather": "天晴：移除场上所有天气效果。",
  "Commander's Horn": "指挥号角：选择己方一行，该行所有单位战力翻倍。",
  "Scorch": "灼烧：摧毁战场上战力最高的非英雄卡牌（双方均可能被影响）。",
  "Decoy": "诱饵：将己方战场上一张非英雄单位收回手牌。",
  "Mardroeme": "蘑菇酒：触发同一行所有狂战士（Berserker）变身。"
};

function leaderAbilityText(card) {
  const name = card.baseName || "";
  const text = (card.leaderAbility || card.abilityText || "").toLowerCase();
  if (name.includes("King Bran")) return "恶劣天气只会让单位损失一半战力。";
  if (name.includes("Crach an Craite")) return "将双方弃牌堆洗回各自牌库。";
  if (text.includes("clear")) return "清除场上所有天气效果。";
  if (text.includes("impenetrable fog")) return "从牌库打出或触发一张蔽日浓雾。";
  if (text.includes("biting frost")) return "从牌库打出或触发一张刺骨冰霜。";
  if (text.includes("torrential rain")) return "从牌库打出或触发一张倾盆大雨。";
  if (text.includes("siege") && text.includes("double")) return "己方攻城行战力翻倍。";
  if (text.includes("ranged") && text.includes("double")) return "己方远程行战力翻倍。";
  if (text.includes("melee") && text.includes("double")) return "己方近战行战力翻倍。";
  if (text.includes("spy")) return "间谍牌战力翻倍。";
  if (text.includes("draw")) return "抽取额外卡牌。";
  if (text.includes("strongest ranged")) return "若对方远程行总战力达到条件，摧毁其中最强单位。";
  if (text.includes("strongest siege")) return "若对方攻城行总战力达到条件，摧毁其中最强单位。";
  if (text.includes("agile")) return "调整敏捷单位位置，使其战力收益更高。";
  return "领袖能力：按当前对局自动结算或作为说明展示。";
}

function cardSortValue(c) {
  let v = c.strength || 0;
  if (c.hero) v += 8;
  if (has(c, "Spy")) v += 6;
  if (has(c, "Medic")) v += 4;
  if (has(c, "Muster") || has(c, "Tight Bond")) v += 3;
  if (has(c, "Scorch")) v += 4;
  if (has(c, "Commander's Horn")) v += 5;
  if (c.category === "weather") v -= 2;
  return v;
}

function getDeckStatus(player) {
  const selected = player.deckIds.map(cardById).filter(Boolean);
  const units = selected.filter(c => c.category === "unit" || c.category === "hero").length;
  const specials = selected.filter(c => c.category === "special" || c.category === "weather").length;
  const messages = [];
  if (!player.leaderId) messages.push("未选择领袖");
  if (units < 22) messages.push(`单位牌 ${units}/22`);
  if (specials > 10) messages.push(`特殊牌 ${specials}/10`);
  return { selected, units, specials, valid: messages.length === 0, message: messages.join("，") };
}

function validateSetup() {
  const problems = [];
  setup.players.forEach((player, index) => {
    if (setup.mode === "ai" && index === 1) {
      if (!player.leaderId) problems.push(`${player.name}：未选择领袖`);
      return;
    }
    const status = getDeckStatus(player);
    if (!status.valid) problems.push(`${player.name}：${status.message}`);
  });
  return { valid: problems.length === 0, problems };
}

function updateStartButton() {
  const button = $("#startGame");
  const statusEl = $("#setupStatus");
  if (!button || !statusEl || !DB) return;
  const result = validateSetup();
  button.disabled = !result.valid;
  button.title = result.valid ? "可以开始对战" : `还不能开始：${result.problems.join("；")}`;
  statusEl.textContent = result.valid ? (setup.mode === "ai" ? "已准备推荐卡组，可直接开始；系统会按难度自动组牌。" : "双方卡组已满足对战要求。") : `还不能开始：${result.problems[0] || "请先完成组牌"}`;
  statusEl.classList.toggle("ready", result.valid);
}

function autoDeck(playerIndex) {
  const p = setup.players[playerIndex];
  const pool = eligibleCards(p.faction);
  const unitPool = pool.filter(c => c.category === "unit" || c.category === "hero").sort((a, b) => cardSortValue(b) - cardSortValue(a));
  const specialPool = pool.filter(c => c.category === "special" || c.category === "weather").sort((a, b) => cardSortValue(b) - cardSortValue(a));
  const units = unitPool.slice(0, Math.min(26, unitPool.length));
  const specials = specialPool.filter(c => {
    if (p.faction !== "Skellige" && c.baseName === "Mardroeme") return false;
    return true;
  }).slice(0, 10);
  p.deckIds = units.concat(specials).map(c => c.id);
}

function systemDeckConfig(difficulty) {
  return {
    easy: {
      unitTarget: 22,
      specialTarget: 3,
      topRatio: 0.9,
      randomPick: true,
      weakBias: 0.45,
      synergyMode: "loose",
      maxHeroes: 3,
      maxSpyCards: 1,
      description: "简单：系统组牌偏随机、强卡少；出牌较随意、常有失误，很少战略弃局，适合新手练手。"
    },
    normal: {
      unitTarget: 25,
      specialTarget: 6,
      topRatio: 0.5,
      randomPick: true,
      weakBias: 0.12,
      synergyMode: "normal",
      maxHeroes: 6,
      maxSpyCards: 2,
      description: "普通：系统偏向中高分卡牌与联动组合；会算分差和卡差，见好就收、必要时战略弃局保存手牌。"
    },
    hard: {
      unitTarget: 28,
      specialTarget: 8,
      topRatio: 0.25,
      randomPick: false,
      weakBias: 0,
      synergyMode: "full",
      maxHeroes: 99,
      maxSpyCards: 99,
      description: "困难：系统用最强卡组，几乎不失误；精算获胜概率与卡差，合理弃局与用领袖，很难对付。"
    }
  }[difficulty || "normal"];
}

function groupHasSynergy(group) {
  const c = group.card;
  return group.cards.length > 1 && (has(c, "Tight Bond") || has(c, "Muster") || has(c, "Berserker"));
}

function systemGroupScore(group) {
  const c = group.card;
  let score = cardSortValue(c);
  if (c.hero) score += 6;
  if (has(c, "Spy")) score += 8;
  if (has(c, "Medic")) score += 5;
  if (has(c, "Tight Bond")) score += 8 + group.cards.length * 3;
  if (has(c, "Muster")) score += 9 + group.cards.length * 3;
  if (has(c, "Morale Boost")) score += 4;
  if (has(c, "Commander's Horn")) score += 7;
  if (has(c, "Scorch")) score += 6;
  return score;
}

function pickSystemGroup(groups, usedKeys, config) {
  const available = groups.filter(group => !usedKeys.has(group.key));
  if (!available.length) return null;
  if (config.weakBias && Math.random() < config.weakBias) {
    const start = Math.floor(available.length * 0.55);
    const weakPool = available.slice(start);
    if (weakPool.length) return weakPool[Math.floor(Math.random() * weakPool.length)];
  }
  const poolSize = Math.max(1, Math.ceil(available.length * config.topRatio));
  const pool = available.slice(0, poolSize);
  if (!config.randomPick) return pool[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

function addSystemGroup(deckIds, group, options = {}) {
  const wholeGroup = options.wholeGroup || groupHasSynergy(group);
  const remaining = options.limit == null ? Infinity : Math.max(0, options.limit - deckIds.length);
  const cards = wholeGroup ? group.cards : group.cards.slice(0, 1);
  cards.slice(0, remaining).forEach(card => {
    if (!deckIds.includes(card.id)) deckIds.push(card.id);
  });
}

function generateSystemDeck(playerIndex = 1, overrideConfig = null) {
  const p = setup.players[playerIndex];
  const config = overrideConfig || systemDeckConfig(p.difficulty);
  const pool = eligibleCards(p.faction);
  const unitGroups = groupCards(pool.filter(c => c.category === "unit" || c.category === "hero")).sort((a, b) => systemGroupScore(b) - systemGroupScore(a));
  const specialGroups = groupCards(pool.filter(c => c.category === "special" || c.category === "weather")).sort((a, b) => systemGroupScore(b) - systemGroupScore(a));
  const deckIds = [];
  const usedUnitKeys = new Set();
  let unitCount = 0;
  let heroCount = 0;
  let spyCount = 0;
  while (unitCount < config.unitTarget && usedUnitKeys.size < unitGroups.length) {
    const group = pickSystemGroup(unitGroups, usedUnitKeys, config);
    if (!group) break;
    usedUnitKeys.add(group.key);
    const card = group.card;
    if (card.hero && heroCount >= config.maxHeroes) continue;
    if (has(card, "Spy") && spyCount >= config.maxSpyCards) continue;
    const before = deckIds.length;
    const wholeGroup = config.synergyMode === "full" || (config.synergyMode === "normal" && groupHasSynergy(group)) || config.wholeStrongGroups;
    addSystemGroup(deckIds, group, { wholeGroup });
    const added = deckIds.length - before;
    unitCount += added;
    if (card.hero) heroCount += added;
    if (has(card, "Spy")) spyCount += added;
  }
  for (const group of unitGroups) {
    if (unitCount >= 22) break;
    if (usedUnitKeys.has(group.key)) continue;
    usedUnitKeys.add(group.key);
    const before = deckIds.length;
    addSystemGroup(deckIds, group, { wholeGroup: groupHasSynergy(group) });
    unitCount += deckIds.length - before;
  }
  const selectedSpecials = [];
  const usedSpecialKeys = new Set();
  while (selectedSpecials.length < config.specialTarget && usedSpecialKeys.size < specialGroups.length) {
    const group = pickSystemGroup(specialGroups, usedSpecialKeys, config);
    if (!group) break;
    usedSpecialKeys.add(group.key);
    const maxTake = Math.min(group.cards.length, config.specialTarget - selectedSpecials.length, (config.synergyMode === "full" || config.wholeStrongGroups) && group.card.baseName === "Commander's Horn" ? 2 : 1);
    group.cards.slice(0, maxTake).forEach(card => selectedSpecials.push(card.id));
  }
  p.deckIds = deckIds.concat(selectedSpecials).slice(0, 40);
  return p.deckIds;
}

function generateRandomStrongDeck(playerIndex) {
  return generateSystemDeck(playerIndex, {
    unitTarget: 28,
    specialTarget: 8,
    topRatio: 0.38,
    randomPick: true,
    weakBias: 0,
    synergyMode: "full",
    maxHeroes: 99,
    maxSpyCards: 99,
    wholeStrongGroups: true
  });
}

function returnToSetup() {
  game = null;
  pendingPlacement = null;
  mulligan = null;
  aiTurnPending = false;
  if (aiStuckTimer) { clearTimeout(aiStuckTimer); aiStuckTimer = null; }
  $("#placementBanner")?.classList.add("hidden");
  $("#mulliganBanner")?.classList.add("hidden");
  $("#reviveBanner")?.classList.add("hidden");
  $("#game").classList.add("hidden");
  $("#setup").classList.remove("hidden");
  renderPlayerSetups();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function surrender() {
  if (!game || game.over) return;
  const pi = game.current;
  const scores = game.players.map((_, i) => totalScore(i));
  game.over = true;
  game.finalWinner = 1 - pi;
  game.finalScores = scores;
  game.endReason = "surrender";
  game.surrenderBy = pi;
  log(`${game.players[pi].name} 认输，${game.players[1 - pi].name} 获胜。`);
  recordCurrentMatchHistory(1 - pi, scores);
  renderMatchHistory();
  game.historyRecorded = true;
  renderGame();
  // 短暂展示结果后返回配置
  window.setTimeout(() => returnToSetup(), 1600);
}

function startGame() {
  const status = $("#setupStatus");
  const validation = validateSetup();
  if (!validation.valid) {
    updateStartButton();
    status.textContent = `还不能开始：${validation.problems.join("；")}`;
    return;
  }
  if (setup.mode === "ai") generateSystemDeck(1);
  status.textContent = "";
  pendingPlacement = null;
  mulligan = null;
  $("#placementBanner")?.classList.add("hidden");
  $("#mulliganBanner")?.classList.add("hidden");
  game = {
    mode: setup.mode,
    round: 1,
    current: 0,
    weather: new Set(),
    rowHorn: [{ melee: false, ranged: false, siege: false }, { melee: false, ranged: false, siege: false }],
    players: setup.players.map((p, idx) => makeGamePlayer(p, idx)),
    over: false,
    finalWinner: null,
    finalScores: [0, 0],
    roundResults: [],
    historyRecorded: false
  };
  game.players.forEach(p => draw(p, 10));
  if (game.players[0].faction === "Scoia'tael" && game.players[1].faction !== "Scoia'tael") game.current = 0;
  if (game.players[1].faction === "Scoia'tael" && game.players[0].faction !== "Scoia'tael") game.current = 1;
  $("#setup").classList.add("hidden");
  $("#game").classList.remove("hidden");
  $("#game").scrollIntoView({ behavior: "smooth", block: "start" });
  log(`对战开始：${game.players[0].name}（${factionName(game.players[0].faction)}） 对 ${game.players[1].name}（${factionName(game.players[1].faction)}）。`);
  // 系统先做自动换牌
  game.players.forEach((p, idx) => { if (idx === 1 && game.mode === "ai") aiMulligan(idx); });
  startMulliganOrGame();
}

// 进入人类玩家开局换牌阶段；若无人类需要换牌则直接开打
function startMulliganOrGame() {
  const humanIndices = game.players.map((_, i) => i).filter(i => !(game.mode === "ai" && i === 1));
  mulligan = { queue: humanIndices, pos: 0, used: [0, 0] };
  advanceMulligan();
}

function advanceMulligan() {
  if (!mulligan || mulligan.pos >= mulligan.queue.length) {
    finishMulligan();
    return;
  }
  game.current = mulligan.queue[mulligan.pos];
  renderGame();
}

function finishMulligan() {
  mulligan = null;
  $("#mulliganBanner")?.classList.add("hidden");
  // 恢复正常先手：松鼠党先手已在 startGame 设置，这里按队列首位人类或既定先手
  if (game.players[0].faction === "Scoia'tael" && game.players[1].faction !== "Scoia'tael") game.current = 0;
  else if (game.players[1].faction === "Scoia'tael" && game.players[0].faction !== "Scoia'tael") game.current = 1;
  else game.current = 0;
  log("换牌阶段结束，对战正式开始。");
  renderGame();
  maybeAI();
}

// 用牌库里随机一张替换被换掉的牌，被换的牌放回牌库后重洗（巫师3规则：换掉的牌洗回牌库）
function mulliganSwap(pi, uid) {
  const p = game.players[pi];
  const idx = p.hand.findIndex(c => c.uid === uid);
  if (idx < 0) return false;
  if (!p.deck.length) return false;
  const old = p.hand[idx];
  const drawIdx = Math.floor(Math.random() * p.deck.length);
  const fresh = p.deck.splice(drawIdx, 1)[0];
  p.hand[idx] = fresh;
  p.deck.push(old);
  p.deck = shuffle(p.deck);
  return true;
}

function aiMulligan(pi) {
  const p = game.players[pi];
  const cfg = AI_DIFFICULTY[p.difficulty || "normal"] || AI_DIFFICULTY.normal;
  // 简单难度换牌更保守（可能留下弱牌），困难难度更果断换掉低质量牌
  const weakThreshold = p.difficulty === "hard" ? 6 : (p.difficulty === "easy" ? 4 : 5);
  const score = c => (c.hero ? 999 : 0) + (c.strength || 0) + (c.category === "weather" ? -5 : 0)
    + (has(c, "Spy") ? 20 : 0) + (has(c, "Medic") ? 8 : 0) + (has(c, "Muster") || has(c, "Tight Bond") ? 6 : 0);
  for (let n = 0; n < MULLIGAN_MAX; n++) {
    if (!p.deck.length) break;
    // 简单难度有概率放弃一次换牌，模拟不熟练
    if (p.difficulty === "easy" && Math.random() < 0.4) break;
    let worstIdx = -1, worst = Infinity;
    p.hand.forEach((c, i) => { const s = score(c); if (s < worst) { worst = s; worstIdx = i; } });
    if (worstIdx < 0) break;
    const c = p.hand[worstIdx];
    if (c.hero || score(c) >= weakThreshold) break;
    mulliganSwap(pi, c.uid);
  }
}

function makeGamePlayer(p, idx) {
  const deckCards = shuffle(p.deckIds.map(cardById).filter(Boolean).map(c => makeInstance(c, idx)));
  return {
    name: p.name,
    faction: p.faction,
    difficulty: p.difficulty || "normal",
    leader: clone(cardById(p.leaderId)),
    leaderUsed: false,
    deck: deckCards,
    hand: [],
    board: { melee: [], ranged: [], siege: [] },
    discard: [],
    passed: false,
    roundsWon: 0,
    retained: []
  };
}

function makeInstance(card, owner) {
  const inst = clone(card);
  inst.uid = card.id + "-" + Math.random().toString(16).slice(2);
  inst.owner = owner;
  inst.playedBy = owner;
  inst.effective = inst.strength || 0;
  inst.transformed = false;
  return inst;
}

function renderGame() {
  if (!game) return;
  $("#roundNo").textContent = game.round;
  const current = game.players[game.current];
  const inMulligan = !!mulligan;
  $("#turnTitle").textContent = game.over ? "对战结束" : (inMulligan ? `${current.name} 开局换牌` : `${current.name} 的回合`);
  $("#weatherLine").textContent = game.weather.size ? `天气：${[...game.weather].map(r => ROW_LABELS[r]).join("、")}` : "当前无天气效果";
  renderScores();
  renderMatchStatus();
  renderBoard();
  renderMulliganBanner();
  renderReviveBanner();
  renderActionGuide();
  renderHand();
  const leaderBtn = $("#leaderBtn");
  const passBtn = $("#passBtn");
  const quickRestartBtn = $("#quickRestartBtn");
  const restartBtn = $("#restartBtn");
  const autoPlayBtn = $("#autoPlayBtn");
  leaderBtn.classList.toggle("hidden", game.over || inMulligan);
  passBtn.classList.toggle("hidden", game.over || inMulligan);
  quickRestartBtn.classList.toggle("hidden", !game.over);
  restartBtn.classList.toggle("hidden", inMulligan || !!pendingPlacement);
  restartBtn.classList.toggle("danger", !game.over);
  restartBtn.textContent = game.over ? "返回配置" : "认输";
  restartBtn.title = game.over ? "返回配置页面" : "认输，本局判负";
  const canAutoPlay = !game.over && !inMulligan && !isAITurn() && !current.passed && !pendingPlacement && current.hand.length > 0;
  autoPlayBtn.classList.toggle("hidden", game.over || inMulligan || isAITurn() || !!pendingPlacement);
  autoPlayBtn.disabled = !canAutoPlay;
  autoPlayBtn.title = canAutoPlay ? "自动选择当前手牌中收益较高的一张并打出" : "当前不能自动出牌";
  leaderBtn.disabled = game.over || current.leaderUsed || current.passed || isAITurn() || !!pendingPlacement || inMulligan;
  passBtn.disabled = game.over || current.passed || isAITurn() || !!pendingPlacement || inMulligan;
  observeLazyImages($("#game"));
  reconcileArtFrames($("#game"));
}

function renderActionGuide() {
  const guide = $("#actionGuide");
  if (!guide || !game) return;
  const state = actionGuideState();
  guide.classList.toggle("hidden", !state);
  if (!state) return;
  guide.innerHTML = `
    <div><strong>${escapeHtml(state.title)}</strong><br><span>${escapeHtml(state.tip)}</span></div>
    <div class="shortcut-list">${state.shortcuts.map(s => `<span class="shortcut-key">${escapeHtml(s)}</span>`).join("")}</div>`;
}

function actionGuideState() {
  if (!game) return null;
  if (game.over) return { title: "对战结束", tip: "查看结果后可以再来一局，或返回配置调整阵营。", shortcuts: ["Enter 再来一局"] };
  const current = game.players[game.current];
  if (mulligan) return { title: `${current.name}：开局换牌`, tip: "点手牌可换掉最多 2 张；不想换时按 Space 直接开始。", shortcuts: ["Space 完成换牌", "Esc 关闭弹窗"] };
  if (pendingPlacement?.kind === "revive") return { title: "选择复活目标", tip: "医生已触发，从上方候选牌中选一张，或选择不复活。", shortcuts: ["Esc 跳过/取消"] };
  if (pendingPlacement?.kind === "decoy") return { title: "选择诱饵目标", tip: "选择要收回手牌的己方非英雄单位，或选择不替换。", shortcuts: ["Esc 跳过/取消"] };
  if (pendingPlacement) return { title: "选择放置行", tip: `将「${pendingPlacement.label}」放到高亮战场行。`, shortcuts: ["Esc 取消"] };
  if (isAITurn()) return { title: "系统回合", tip: "系统正在思考，出牌后会自动回到你的回合。", shortcuts: [] };
  if (current.passed) return { title: `${current.name} 已放弃`, tip: "等待对手行动或回合结算。", shortcuts: [] };
  return { title: `${current.name} 的行动`, tip: "出一张牌、使用领袖，或在领先时放弃本回合保存手牌。", shortcuts: ["Space 自动出牌", "L 领袖", "P 放弃"] };
}

function renderMulliganBanner() {
  const banner = $("#mulliganBanner");
  if (!banner) return;
  if (!mulligan) { banner.classList.add("hidden"); return; }
  const pi = game.current;
  const used = mulligan.used[pi] || 0;
  const left = MULLIGAN_MAX - used;
  banner.classList.remove("hidden");
  banner.innerHTML = `
    <span><strong>${escapeHtml(game.players[pi].name)}</strong> 开局可更换最多 ${MULLIGAN_MAX} 张牌，剩余 <strong>${left}</strong> 次。点手牌中的卡牌进行更换。</span>
    <button id="mulliganDone" type="button">${used === 0 ? "不换牌，开始" : "完成换牌"}</button>`;
  $("#mulliganDone", banner).addEventListener("click", () => {
    mulligan.pos++;
    advanceMulligan();
  });
}

function renderMatchStatus() {
  const el = $("#matchStatus");
  if (!el || !game) return;
  el.classList.remove("hidden");
  const meScore = totalScore(0), oppScore = totalScore(1);
  const diff = meScore - oppScore;
  const total = meScore + oppScore;
  const myPct = total > 0 ? Math.round((meScore / total) * 100) : 50;
  let state = "even", label = "势均力敌";
  if (diff >= 8) { state = "lead"; label = `你领先 ${diff}`; }
  else if (diff > 0) { state = "lead-slim"; label = `你小幅领先 ${diff}`; }
  else if (diff <= -8) { state = "behind"; label = `你落后 ${-diff}`; }
  else if (diff < 0) { state = "behind-slim"; label = `你小幅落后 ${-diff}`; }
  const diffLabel = game.mode === "ai" ? `系统难度：${DIFFICULTY_CN[game.players[1].difficulty] || "普通"}` : "本地双人对战";
  el.dataset.state = state;
  el.innerHTML = `
    <div class="lead-line">
      <span class="lead-tag ${state}">${escapeHtml(label)}</span>
      <span class="lead-nums">你 ${meScore} · 对方 ${oppScore}</span>
    </div>
    <div class="lead-bar"><span style="width:${myPct}%"></span></div>
    <div class="match-meta">
      <span>本局小局比分 ${game.players[0].roundsWon} : ${game.players[1].roundsWon}（两胜制）</span>
      <span>${escapeHtml(diffLabel)}</span>
    </div>`;
}

function renderScores() {
  const scores = game.players.map((_, i) => totalScore(i));
  const active = game.current;
  const strip = $("#scoreStrip");

  [1, 0].forEach(i => {
    const p = game.players[i];
    let card = $(`.score-card[data-player-index="${i}"]`, strip);
    const canUseLeader = !game.over && i === active && !p.leaderUsed && !p.passed && !(game.mode === "ai" && i === 1);
    const leaderTitle = p.leaderUsed ? "领袖技能已使用" : (canUseLeader ? "点击头像使用领袖技能" : "等待该玩家回合使用领袖技能");

    if (!card) {
      card = document.createElement("div");
      card.className = "score-card";
      card.dataset.playerIndex = String(i);
      card.innerHTML = `
        <button class="leader-avatar" data-player-index="${i}" type="button" title="${leaderTitle}">
          ${cardImageHTML(p.leader, "leader-avatar-art", true)}
        </button>
        <div class="score-main">
          <strong></strong><br />
          <span class="hint hint-line1"></span>
          <div class="score"></div>
          <div class="gems"></div>
          <div class="hint hint-line2"></div>
        </div>`;
      strip.appendChild(card);
    }

    card.className = `score-card ${i === active && !game.over ? "active" : ""}`;

    // 仅更新领袖头像图片（如阵营/领袖未变则不重建）
    // 用稳定 key（领袖 imageUrl，相对路径）比较，避免用 img.src（浏览器解析后的绝对 URL）
    // 与相对路径永远不等，导致每帧都重建 img、触发 loading-art 重解码闪烁。
    const avatar = $(".leader-avatar", card);
    const newKey = `${p.leader?.imageUrl || ""}|${cardName(p.leader)}`;
    if (avatar.dataset.leaderKey !== newKey) {
      avatar.dataset.leaderKey = newKey;
      avatar.innerHTML = cardImageHTML(p.leader, "leader-avatar-art", true);
    }
    avatar.className = `leader-avatar${canUseLeader ? " usable" : ""}${p.leaderUsed ? " used" : ""}`;
    avatar.title = leaderTitle;
    avatar.onclick = () => {
      if (i !== active || game.over || p.leaderUsed || isAITurn()) return;
      useLeader();
    };

    $("strong", card).textContent = p.name;
    $(".hint-line1", card).textContent = `${factionName(p.faction)}｜手牌 ${p.hand.length}｜牌库 ${p.deck.length}`;
    const scoreEl = $(".score", card);
    const nextScore = String(scores[i]);
    if (scoreEl.textContent && scoreEl.textContent !== nextScore) {
      scoreEl.textContent = nextScore;
      scoreEl.classList.remove("score-pop");
      void scoreEl.offsetWidth;
      scoreEl.classList.add("score-pop");
    } else {
      scoreEl.textContent = nextScore;
    }
    $(".gems", card).innerHTML = `${"◆".repeat(p.roundsWon)}${"◇".repeat(Math.max(0, 2 - p.roundsWon))}`;
    $(".hint-line2", card).textContent = `${p.passed ? "已放弃" : "未放弃"}｜领袖：${cardName(p.leader)}｜${p.leaderUsed ? "已用" : "可用"}`;
  });

  // 确保顺序：系统在上，玩家在下（仅在顺序变化时调整）
  const desiredCards = [1, 0].map(i => $(`.score-card[data-player-index="${i}"]`, strip)).filter(Boolean);
  reconcileChildren(strip, desiredCards);
}

function renderBoard() {
  const board = $("#board");
  const pending = pendingPlacement;
  const order = [1, 0];
  const existingBoxes = new Map($$(".player-board[data-player-index]", board).map(el => [el.dataset.playerIndex, el]));

  order.forEach(pi => {
    const p = game.players[pi];
    const rowOrder = pi === 1 ? ["siege", "ranged", "melee"] : ["melee", "ranged", "siege"];
    let box = existingBoxes.get(String(pi));
    if (!box) {
      box = document.createElement("div");
      box.className = "player-board";
      box.dataset.playerIndex = String(pi);
      box.innerHTML = `<h3><span class="board-title"></span><span class="board-summary"></span></h3>`;
      rowOrder.forEach(row => {
        const rowEl = document.createElement("div");
        rowEl.className = "row";
        rowEl.dataset.row = row;
        rowEl.innerHTML = `
          <div class="row-label"><span class="row-name"></span><br><span class="row-score"></span><br><small class="row-horn"></small></div>
          <div class="row-cards"></div>`;
        box.appendChild(rowEl);
      });
      board.appendChild(box);
    }

    box.classList.toggle("active-board", pi === game.current && !game.over && !mulligan);
    $(".board-title", box).textContent = `${p.name} 的战场`;
    $(".board-summary", box).textContent = `总战力 ${totalScore(pi)}${game.mode === "ai" && pi === 1 ? `｜手牌 ${p.hand.length}｜牌库 ${p.deck.length}` : ""}`;

    rowOrder.forEach(row => {
      const rowEl = $(`.row[data-row="${row}"]`, box);
      $(".row-name", rowEl).textContent = ROW_LABELS[row];
      $(".row-score", rowEl).textContent = rowScore(pi, row);
      $(".row-horn", rowEl).textContent = game.rowHorn[pi][row] ? "号角" : "";

      const cards = $(".row-cards", rowEl);
      const wasPlaceable = cards.classList.contains("placeable");
      const placeable = pending && pending.kind !== "revive" && pi === game.current && pending.rows.includes(row);
      cards.classList.toggle("placeable", !!placeable);
      if (!wasPlaceable && !placeable && cards.onclick) cards.onclick = null;
      else if (placeable) cards.onclick = () => resolvePlacement(row);

      const currentEls = new Map($$(".mini-card[data-card-uid]", cards).map(el => [el.dataset.cardUid, el]));
      const desired = [];
      [...p.board[row]].sort(handCardSort).forEach(c => {
        const key = String(c.uid);
        let cardEl = currentEls.get(key);
        if (cardEl) refreshMiniCardElement(cardEl, c, false);
        else cardEl = renderMiniCard(c, false);

        const isDecoyTarget = pending && pending.kind === "decoy" && pi === game.current && !c.hero;
        cardEl.classList.toggle("decoyable", !!isDecoyTarget);
        cardEl.onclick = isDecoyTarget ? () => resolveDecoy(c.uid) : () => showCardDetails(c);
        cardEl.classList.remove("opponent-played", "just-played");
        if (c._isNewlyPlayed) {
          const animClass = game.mode === "ai" && pi === 1 ? "opponent-played" : "just-played";
          cardEl.classList.add(animClass);
          window.setTimeout(() => cardEl.classList.remove(animClass), 360);
          c._isNewlyPlayed = false;
        }
        desired.push(cardEl);
      });
      // 仅当顺序/内容变化时才操作 DOM，已有卡牌节点保持不动，杜绝重绘闪烁
      reconcileChildren(cards, desired);
    });

    let handRow = $(".opponent-hand-row", box);
    if (game.mode === "ai" && pi === 1 && p.hand.length > 0) {
      if (!handRow) {
        handRow = document.createElement("div");
        handRow.className = "opponent-hand-row";
        handRow.innerHTML = `<span class="opponent-hand-label"></span><div class="opponent-hand-chips"></div>`;
        box.appendChild(handRow);
      }
      $(".opponent-hand-label", handRow).textContent = `手牌 ${p.hand.length}`;
      const chips = $(".opponent-hand-chips", handRow);
      while (chips.children.length < p.hand.length) {
        const chip = document.createElement("div");
        chip.className = "opponent-chip";
        chip.innerHTML = `<div class="opponent-chip-art"><span>?</span></div>`;
        chips.appendChild(chip);
      }
      while (chips.children.length > p.hand.length) chips.lastElementChild.remove();
    } else if (handRow) {
      handRow.remove();
    }
  });

  // 仅在顺序变化时调整战场容器顺序，否则不动 DOM
  const desiredBoxes = order.map(pi => $(`.player-board[data-player-index="${pi}"]`, board)).filter(Boolean);
  reconcileChildren(board, desiredBoxes);
}

function renderHand() {
  const hand = $("#hand");
  // 对战结束：展示结果面板
  if (game.over) {
    hand.classList.remove("ai-thinking");
    $("#handTitle").textContent = "对战结果";
    $("#handHint").textContent = "对战已结束，可以查看胜负结果或重新开始。";
    hand.replaceChildren();
    renderResultPanel(hand);
    return;
  }

  // 关键简化：手牌区【始终只展示人类玩家的手牌，节点始终原位不动】。
  // AI 模式下人类恒为 players[0]；本地双人模式则跟随 game.current。
  // 轮到 AI 时不再用遮罩盖住/清空手牌（那正是每回合“闪一下”的根源），
  // 而是给手牌加 .ai-thinking 让其整体变暗+不可点，并显示一个不占布局的小提示浮标。
  const aiThinking = game.mode === "ai" && game.current === 1 && !mulligan;
  const shownIndex = game.mode === "ai" ? 0 : game.current;
  const p = game.players[shownIndex];
  const interactive = !aiThinking; // 是否可交互（换牌/出牌/选择）

  $("#handTitle").textContent = mulligan ? `${p.name} 的手牌（开局换牌）`
    : (aiThinking ? `${p.name} 的手牌`
    : (pendingPlacement?.kind === "revive" ? `${p.name} 的手牌（医生复活）`
    : (pendingPlacement?.kind === "decoy" ? `${p.name} 的手牌（诱饵替换）`
    : `${p.name} 的手牌`)));
  $("#handHint").textContent = mulligan
    ? `点击想要更换的卡牌，将随机替换为牌库中的另一张（剩余 ${MULLIGAN_MAX - (mulligan.used[game.current] || 0)} 次）。`
    : (aiThinking ? "系统正在思考，请稍候…"
    : (pendingPlacement?.kind === "revive" ? "在上方选择要复活的卡牌，或点「不复活」。"
    : (pendingPlacement?.kind === "decoy" ? "在战场或上方选择要收回手牌的己方单位，或点「不替换」。"
    : (pendingPlacement ? `请在上方战场点击要放置「${pendingPlacement.label}」的行，或点取消。`
    : "点击卡牌打出；也可以用「自动出一张」快速推进。"))));

  hand.classList.toggle("ai-thinking", aiThinking);

  const existingHandCards = new Map($$(".mini-card[data-card-uid]", hand).map(el => [el.dataset.cardUid, el]));
  const canMulligan = interactive && mulligan && (mulligan.used[game.current] || 0) < MULLIGAN_MAX && p.deck.length > 0;
  const sorted = [...p.hand].sort(handCardSort);
  const recommendedUid = interactive && !mulligan && !pendingPlacement ? chooseAutoPlayCard(shownIndex)?.uid : null;
  const desired = [];
  sorted.forEach(c => {
    let el = existingHandCards.get(String(c.uid));
    if (el) refreshMiniCardElement(el, c, true);
    else el = renderMiniCard(c, true);
    el.classList.toggle("mulligan-pickable", !!(canMulligan));
    el.classList.toggle("selecting", !!(interactive && pendingPlacement && pendingPlacement.uid === c.uid));
    el.classList.toggle("recommended-card", !!(recommendedUid && c.uid === recommendedUid));
    if (recommendedUid && c.uid === recommendedUid) el.title = "推荐出牌：当前局面下收益较高";
    else if (el.dataset.inHand === "1") el.removeAttribute("title");

    if (!interactive) {
      // AI 思考态：卡牌原位保留，仅置灰不可点（视觉稳定，无遮罩、无重排）
      el.onclick = null;
      desired.push(el);
      return;
    }
    if (mulligan) {
      el.onclick = () => {
        if (!canMulligan) return;
        if (mulliganSwap(game.current, c.uid)) {
          mulligan.used[game.current] = (mulligan.used[game.current] || 0) + 1;
          log(`${p.name} 更换了一张开局手牌。`);
          if ((mulligan.used[game.current] || 0) >= MULLIGAN_MAX) {
            mulligan.pos++;
            advanceMulligan();
          } else {
            renderGame();
          }
        }
      };
      desired.push(el);
      return;
    }
    el.onclick = () => {
      if (pendingPlacement && (pendingPlacement.kind === "revive" || pendingPlacement.kind === "decoy")) return;
      if (pendingPlacement) { cancelPlacement(); return; }
      playCard(c.uid);
    };
    desired.push(el);
  });
  // 仅在顺序/内容变化时操作 DOM，未变化的手牌节点完全不动，杜绝闪烁
  reconcileChildren(hand, desired);
}

function renderResultPanel(container) {
  const finalWinner = game.finalWinner;
  const finalScores = game.finalScores || game.players.map((_, i) => totalScore(i));
  const roundText = `${game.players[0].roundsWon} : ${game.players[1].roundsWon}`;
  const title = finalWinner == null ? "平局" : `${game.players[finalWinner].name} 获胜`;
  const subtitle = finalWinner == null ? "双方打成平手。" : `${game.players[finalWinner].name} 赢下了这盘昆特牌。`;
  container.innerHTML = `
    <div class="result-panel">
      <div class="result-hero ${finalWinner == null ? "draw" : "win"}">
        <p class="eyebrow">最终结果</p>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(subtitle)}</p>
      </div>
      <div class="result-grid">
        ${game.players.map((player, index) => `
          <div class="result-player ${index === finalWinner ? "winner" : ""}">
            <strong>${escapeHtml(player.name)}</strong>
            <span>${factionName(player.faction)}</span>
            <div class="result-score">小局 ${player.roundsWon}｜最终战力 ${finalScores[index] || 0}</div>
          </div>`).join("")}
      </div>
      <div class="result-summary">小局比分：${roundText}</div>
      <div class="result-actions">
        <button id="resultRestart" type="button">再来一局</button>
        <button id="resultBackSetup" type="button">返回配置</button>
      </div>
    </div>`;
  $("#resultRestart", container).addEventListener("click", () => startGame());
  $("#resultBackSetup", container).addEventListener("click", returnToSetup);
}

function refreshMiniCardElement(el, card, inHand) {
  // 只在值真正变化时才写 DOM 属性，避免无谓的 style 重算/重绘闪烁。
  // 图片加载态由 eager <img> 的内联 onload/onerror + 每帧末尾的 reconcileArtFrames 统一处理，这里不重复。
  const cls = `mini-card ${card.hero ? "hero" : ""} ${card.category === "weather" ? "weather" : ""} ${card.category === "special" ? "special" : ""}`;
  if (el.className !== cls) el.className = cls;
  const uid = String(card.uid);
  if (el.dataset.cardUid !== uid) el.dataset.cardUid = uid;
  const inHandVal = inHand ? "1" : "0";
  if (el.dataset.inHand !== inHandVal) el.dataset.inHand = inHandVal;
  const title = inHand ? "" : `${cardName(card)}（${factionName(card.faction)}）`;
  if (inHand) { if (el.hasAttribute("title")) el.removeAttribute("title"); }
  else if (el.getAttribute("title") !== title) el.title = title;
  const effective = $(".effective", el);
  if (effective) {
    const val = card.strength == null ? "" : String(inHand ? card.strength : card.effective);
    if (effective.textContent !== val) effective.textContent = val;
  }
}

function renderMiniCard(card, inHand) {
  const div = document.createElement("div");
  refreshMiniCardElement(div, card, inHand);
  div.dataset.cardUid = String(card.uid);
  div.dataset.inHand = inHand ? "1" : "0";
  // 战场/手牌卡图使用即时加载（本地图片瞬时完成），避免懒加载占位与节点复用/reconcile 移动
  // 竞争导致的“黑块（loading 态被清除但位图未绘制）”问题。
  div.innerHTML = `
    ${cardImageHTML(card, "mini-art", true)}
    <div class="card-copy">
      <strong>${escapeHtml(cardName(card))}</strong>
      <span class="hint">${factionName(card.faction)}</span>
      <div class="tags">${tagsHTML(card)}</div>
      <p class="card-brief">${shortCardText(card)}</p>
    </div>
    <button class="card-info-btn" type="button">说明</button>
    ${card.strength == null ? "" : `<span class="effective">${inHand ? card.strength : card.effective}</span>`}`;
  $(".card-info-btn", div).onclick = event => {
    event.preventDefault();
    event.stopPropagation();
    showCardDetails(card);
  };
  if (!inHand) {
    div.onclick = () => showCardDetails(card);
  }
  return div;
}

function cardHTML(card, showCopy = false, groupCount = 1) {
  return `
    ${cardImageHTML(card, "pick-art")}
    <div class="card-copy">
      <strong>${escapeHtml(cardName(card, showCopy))}</strong>
      <span class="hint">${factionName(card.faction)}｜${expansionName(card.expansion)}</span>
      ${card.strength == null ? "" : `<span class="power-badge">${card.strength}</span>`}
      ${groupCount > 1 ? `<span class="quantity-badge">共 ${groupCount} 张</span>` : ""}
      <div class="tags">${tagsHTML(card)}</div>
      <p class="hint">${rowNameList(card)}｜${cardAbilityText(card)}</p>
      <p class="card-brief">${shortCardText(card)}</p>
      <button class="card-detail-btn" data-card-id="${escapeAttr(card.id)}" type="button">查看说明</button>
    </div>`;
}

function cardImageHTML(card, artClass = "", eager = false) {
  const name = escapeHtml(cardName(card));
  const fallback = name.slice(0, 4);
  const typeClass = `art-${card.category || "card"}`;
  const frameClass = `art-frame ${artClass} ${typeClass}`;
  if (!card.imageUrl) return `<div class="${frameClass} no-art"><span>${fallback}</span></div>`;
  // 卡图内容不可变，直接用原始相对路径。不追加 ?v= 缓存串：
  // 某些静态服务器/预览环境会把 "foo.webp?v=x" 当成字面文件名而 404，导致所有卡图整体加载失败。
  const imageUrl = escapeAttr(card.imageUrl);
  if (eager) {
    return `<div class="${frameClass} loading-art"><img src="${imageUrl}" alt="${name}" loading="eager" decoding="async" fetchpriority="high" referrerpolicy="no-referrer" onload="this.parentElement.classList.remove('loading-art','no-art')" onerror="this.parentElement.classList.remove('loading-art');this.parentElement.classList.add('no-art');this.remove();"><span>${fallback}</span></div>`;
  }
  const placeholder = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  return `<div class="${frameClass} loading-art"><img src="${placeholder}" data-src="${imageUrl}" alt="${name}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span>${fallback}</span></div>`;
}

function shortCardText(card) {
  const custom = CARD_DESC_CN[card.baseName];
  if (custom) return escapeHtml(custom);
  return escapeHtml(cardAbilityText(card));
}

const CARD_DESC_CN = {
  "Cow": "打出后回合结束时离场，并在己方近战行召唤牛魔防卫军（8战力）。",
  "Kambi": "打出后回合结束时离场，召唤海姆达尔（11战力英雄）。",
  "Bovine Defense Force": "由奶牛离场时召唤的近战单位，8战力。",
  "Hemdall": "由坎比离场时召唤的近战英雄，11战力。",
};

function showCardDetails(card) {
  const modal = $("#cardModal");
  const content = $("#modalContent");
  const rowText = rowNameList(card);
  const abilityList = abilityExplainList(card);
  content.innerHTML = `
    <div class="detail-layout">
      <div class="detail-art">${cardImageHTML(card, "large-art", true)}</div>
      <div class="detail-copy">
        <p class="eyebrow">${factionName(card.faction)} · ${expansionName(card.expansion)}</p>
        <h2 id="modalTitle">${escapeHtml(cardName(card, true))}</h2>
        <div class="detail-stats">
          <span>类型：${categoryName(card.category)}</span>
          <span>战力：${card.strength == null ? "-" : card.strength}</span>
          <span>行：${rowText}</span>
        </div>
        <div class="tags detail-tags">${tagsHTML(card)}</div>
        <h3>卡牌说明</h3>
        <p>${shortCardText(card)}</p>
        ${abilityList ? `<ul class="ability-list">${abilityList}</ul>` : ""}
      </div>
    </div>`;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  observeLazyImages(modal);
}

function closeCardDetails() {
  const modal = $("#cardModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function abilityExplainList(card) {
  const map = {
    "Hero": "不受天气、特殊牌和多数能力影响。",
    "Spy": "打到对方战场并计入对方分数，自己抽两张牌。",
    "Medic": "从己方弃牌堆复活一张非英雄单位牌。",
    "Tight Bond": "同名同能力单位在同一行时按数量倍增。",
    "Morale Boost": "同一行其它非英雄单位战力加一。",
    "Muster": "打出同名或关联卡牌。",
    "Agile": "可选择近战或远程行。",
    "Scorch": "摧毁满足条件的最高战力非英雄牌。",
    "Commander's Horn": "指定己方一行战力翻倍。",
    "Summon Shield Maidens": "从手牌或牌库召唤盾女。",
    "Summon Avenger": "离场时召唤强力复仇者。",
    "Summon Bovine Defense Force": "回合结束后召唤牛魔防卫军。",
    "Berserker": "遇到蘑菇酒会变身为熊。",
    "Mardroeme": "触发同一行狂战士变身。"
  };
  return (card.abilities || []).map(a => `<li><strong>${escapeHtml(abilityName(a))}</strong>：${escapeHtml(map[a] || "特殊能力。")}</li>`).join("");
}

function tagsHTML(card) {
  const tags = [];
  tags.push(`<span class="tag ${card.category}">${categoryName(card.category)}</span>`);
  (card.abilities || []).forEach(a => tags.push(`<span class="tag ${a === "Hero" ? "hero" : ""}">${escapeHtml(abilityName(a))}</span>`));
  return tags.join("");
}

function playCard(uid, aiChoiceRow = null, isAICall = false) {
  if (!game || game.over) return;
  // 防止人类玩家在AI回合点击出牌
  if (isAITurn() && !isAICall) return;
  const pi = game.current;
  const p = game.players[pi];
  if (p.passed) return;
  const idx = p.hand.findIndex(c => c.uid === uid);
  if (idx < 0) return;
  const card = p.hand[idx];
  const isAI = isAICall;

  if (card.category === "weather" || card.category === "special") {
    // 号角 / 蘑菇酒 需要选择作用行；玩家通过点击战场行选择
    if (!isAI && (card.baseName === "Commander's Horn" || card.baseName === "Mardroeme")) {
      const rows = card.baseName === "Mardroeme" ? ["melee", "ranged"] : ROWS;
      beginPlacement({ uid, kind: "special", rows, label: card.baseName === "Mardroeme" ? "蘑菇酒" : "指挥号角" });
      return;
    }
    p.hand.splice(idx, 1);
    resolveSpecial(pi, card, aiChoiceRow);
    p.discard.push(card);
    if (pendingPlacement?.kind === "decoy") return;
    afterPlay(`${p.name} 打出特殊牌 ${cardName(card)}。`);
    return;
  }

  // 多行单位（敏捷等）需要玩家选行
  if (!isAI && card.row && card.row.length > 1) {
    beginPlacement({ uid, kind: "unit", rows: card.row.slice(), label: cardName(card) });
    return;
  }

  let row = aiChoiceRow || (card.row && card.row.length ? card.row[0] : null);
  finalizeUnitPlay(uid, row);
}

function finalizeUnitPlay(uid, row) {
  const pi = game.current;
  const p = game.players[pi];
  const idx = p.hand.findIndex(c => c.uid === uid);
  if (idx < 0) return;
  const card = p.hand[idx];
  if (!row) return;
  p.hand.splice(idx, 1);
  const target = has(card, "Spy") ? 1 - pi : pi;
  card.playedBy = pi;
  card.owner = target;
  // 标记新出的牌用于落牌动画
  card._isNewlyPlayed = true;
  game.players[target].board[row].push(card);
  log(`${p.name} 打出 ${cardName(card)}${target !== pi ? " 到对方战场" : ""}。`);
  resolveUnitAbility(pi, target, row, card);
  if (pendingPlacement?.kind === "revive") return;
  afterPlay();
}

function beginPlacement(req) {
  pendingPlacement = req;
  renderGame();
  const banner = $("#placementBanner");
  if (banner) {
    const rowText = req.rows.map(r => ROW_LABELS[r]).join(" / ");
    banner.innerHTML = `请点击要放置「${escapeHtml(req.label)}」的战场行（${rowText}）　<button id="cancelPlacement" type="button">取消</button>`;
    banner.classList.remove("hidden");
    banner.scrollIntoView({ behavior: "smooth", block: "nearest" });
    $("#cancelPlacement", banner).addEventListener("click", cancelPlacement);
  }
}

function cancelPlacement() {
  pendingPlacement = null;
  const banner = $("#placementBanner");
  if (banner) banner.classList.add("hidden");
  renderGame();
}

function resolvePlacement(row) {
  if (!pendingPlacement) return;
  if (!pendingPlacement.rows.includes(row)) return;
  const req = pendingPlacement;
  pendingPlacement = null;
  const banner = $("#placementBanner");
  if (banner) banner.classList.add("hidden");
  const pi = game.current;
  const p = game.players[pi];
  const idx = p.hand.findIndex(c => c.uid === req.uid);
  if (idx < 0) { renderGame(); return; }
  const card = p.hand[idx];
  if (req.kind === "special") {
    p.hand.splice(idx, 1);
    resolveSpecial(pi, card, row);
    p.discard.push(card);
    afterPlay(`${p.name} 打出特殊牌 ${cardName(card)}。`);
  } else {
    finalizeUnitPlay(req.uid, row);
  }
}

function autoPlayForHuman() {
  if (!game || game.over || mulligan || pendingPlacement || isAITurn()) return;
  const pi = game.current;
  const p = game.players[pi];
  if (!p || p.passed) return;
  const card = chooseAutoPlayCard(pi);
  if (!card) {
    passRound();
    return;
  }
  const row = autoRowForCard(pi, card);
  playCard(card.uid, row, false);
  if (pendingPlacement && pendingPlacement.kind === "unit") resolvePlacement(row || pendingPlacement.rows[0]);
  else if (pendingPlacement && pendingPlacement.kind === "special") resolvePlacement(row || pendingPlacement.rows[0]);
  finishAutoPendingChoice();
}

function chooseAutoPlayCard(pi) {
  return game.players[pi].hand.slice().sort((a, b) => autoPlayValue(pi, b) - autoPlayValue(pi, a))[0] || null;
}

function autoPlayValue(pi, card) {
  let value = cardSortValue(card);
  if (card.category === "weather") {
    const rows = weatherRowsFor(card);
    if (card.baseName === "Clear Weather") return game.weather.size ? 8 : -4;
    const ownScore = rows.reduce((sum, row) => sum + rowScore(pi, row), 0);
    const oppScore = rows.reduce((sum, row) => sum + rowScore(1 - pi, row), 0);
    return oppScore > ownScore + 4 ? 8 + (oppScore - ownScore) / 2 : -3;
  }
  if (card.baseName === "Commander's Horn") value += rowScore(pi, bestOwnRow(pi)) / 3;
  if (card.baseName === "Mardroeme") value += bestBerserkerRow(pi) ? 7 : -2;
  if (card.baseName === "Decoy") value += bestDecoyTarget(pi) ? 4 : -3;
  return value;
}

function weatherRowsFor(card) {
  if (card.baseName === "Biting Frost") return ["melee"];
  if (card.baseName === "Impenetrable Fog") return ["ranged"];
  if (card.baseName === "Torrential Rain") return ["siege"];
  if (card.baseName === "Skellige Storm") return ["ranged", "siege"];
  return [];
}

function autoRowForCard(pi, card) {
  if (card.baseName === "Mardroeme") return bestBerserkerRow(pi) || "melee";
  if (card.baseName === "Commander's Horn") return bestOwnRow(pi) || "melee";
  if (card.row && card.row.length) return bestRowForCard(pi, card);
  return null;
}

function bestBerserkerRow(pi) {
  const rows = ["melee", "ranged"].sort((a, b) => countBerserkers(pi, b) - countBerserkers(pi, a));
  return countBerserkers(pi, rows[0]) > 0 ? rows[0] : null;
}

function countBerserkers(pi, row) {
  return game.players[pi].board[row].filter(c => has(c, "Berserker") && !c.transformed).length;
}

function bestDecoyTarget(pi) {
  const own = [];
  ROWS.forEach(row => game.players[pi].board[row].forEach(card => { if (!card.hero) own.push({ row, card }); }));
  return own.sort((a, b) => (b.card.strength || 0) - (a.card.strength || 0))[0] || null;
}

function finishAutoPendingChoice() {
  if (!pendingPlacement) return;
  if (pendingPlacement.kind === "revive") {
    const best = pendingPlacement.candidates[0];
    if (best) resolveRevive(best.uid);
    else cancelRevive();
  } else if (pendingPlacement.kind === "decoy") {
    const best = bestDecoyTarget(game.current);
    if (best) resolveDecoy(best.card.uid);
    else cancelDecoy();
  }
}

function resolveSpecial(pi, card, aiRow) {
  const name = card.baseName;
  if (name === "Biting Frost") addWeather("melee");
  else if (name === "Impenetrable Fog") addWeather("ranged");
  else if (name === "Torrential Rain") addWeather("siege");
  else if (name === "Skellige Storm") { addWeather("ranged"); addWeather("siege"); }
  else if (name === "Clear Weather") { game.weather.clear(); log("天气被清除。"); }
  else if (name === "Commander's Horn") {
    const row = aiRow || bestOwnRow(pi) || "melee";
    if (row) { game.rowHorn[pi][row] = true; log(`${game.players[pi].name} 在${ROW_LABELS[row]}行吹响号角。`); }
  }
  else if (name === "Scorch") doScorch(pi, null);
  else if (name === "Decoy") {
    if (!isAITurn()) beginDecoySelection(pi);
    else doDecoy(pi);
  }
  else if (name === "Mardroeme") {
    const row = aiRow || "melee";
    if (row) transformBerserkers(pi, row);
  }
}

function addWeather(row) {
  game.weather.add(row);
  log(`${ROW_LABELS[row]}行受到天气影响。`);
}

function resolveUnitAbility(playedBy, target, row, card) {
  if (has(card, "Spy")) {
    draw(game.players[playedBy], 2);
    log(`${game.players[playedBy].name} 的间谍生效，抽 2 张牌。`);
  }
  if (has(card, "Medic")) {
    if (!isAITurn()) {
      beginReviveSelection(playedBy);
    } else {
      reviveBest(playedBy);
    }
    return;
  }
  if (has(card, "Muster")) doMuster(playedBy, target, row, card);
  if (has(card, "Summon Shield Maidens")) summonByName(playedBy, target, row, "Clan Drummond Shield Maiden");
  if (has(card, "Scorch") && card.category !== "special") doScorch(playedBy, row, true);
}

function doMuster(playedBy, target, row, card) {
  const p = game.players[playedBy];
  const names = [card.baseName];
  if (card.baseName === "Gaunter O'Dimm") names.push("Gaunter O'Dimm: Darkness");
  if (card.baseName === "Gaunter O'Dimm: Darkness") names.push("Gaunter O'Dimm");
  let moved = 0;
  [p.hand, p.deck].forEach(pile => {
    for (let i = pile.length - 1; i >= 0; i--) {
      const c = pile[i];
      if (c.uid !== card.uid && names.includes(c.baseName)) {
        pile.splice(i, 1);
        const r = c.row.includes(row) ? row : (c.row[0] || row);
        game.players[target].board[r].push(c);
        moved++;
      }
    }
  });
  if (moved) log(`${p.name} 的集结生效，额外打出 ${moved} 张关联牌。`);
}

function summonByName(playedBy, target, row, baseName) {
  const p = game.players[playedBy];
  let moved = 0;
  [p.hand, p.deck].forEach(pile => {
    for (let i = pile.length - 1; i >= 0; i--) {
      const c = pile[i];
      if (c.baseName === baseName) {
        pile.splice(i, 1);
        game.players[target].board[row].push(c);
        moved++;
      }
    }
  });
  if (moved) log(`${p.name} 召唤了 ${moved} 张 ${CARD_CN[baseName] || "关联卡牌"}。`);
}

function reviveBest(pi) {
  const p = game.players[pi];
  const candidates = p.discard.filter(c => (c.category === "unit" || c.category === "hero") && !c.hero);
  if (!candidates.length) return;
  candidates.sort((a, b) => (b.strength || 0) - (a.strength || 0));
  reviveCard(pi, candidates[0]);
}

function reviveCard(pi, card) {
  const p = game.players[pi];
  p.discard = p.discard.filter(c => c.uid !== card.uid);
  const row = card.row[0] || "melee";
  p.board[row].push(card);
  log(`${p.name} 的医生复活了 ${cardName(card)}。`);
}

function beginReviveSelection(pi) {
  const p = game.players[pi];
  const candidates = p.discard.filter(c => (c.category === "unit" || c.category === "hero") && !c.hero);
  if (!candidates.length) { afterPlay(); return; }
  candidates.sort((a, b) => (b.strength || 0) - (a.strength || 0));
  pendingPlacement = { uid: null, kind: "revive", rows: [], label: "医生复活", candidates };
  renderGame();
  renderReviveBanner();
}

function renderReviveBanner() {
  const banner = $("#reviveBanner");
  if (!banner || !pendingPlacement || pendingPlacement.kind !== "revive") { banner?.classList.add("hidden"); return; }
  banner.classList.remove("hidden");
  const cardsHTML = pendingPlacement.candidates.map(c => `<div class="revive-card" data-uid="${c.uid}">${renderMiniCard(c, false).outerHTML}</div>`).join("");
  banner.innerHTML = `<span>选择要复活的卡牌：</span><div class="revive-cards">${cardsHTML}</div><button id="reviveSkip" type="button">不复活</button>`;
  $$(".revive-card", banner).forEach(el => {
    el.addEventListener("click", () => resolveRevive(el.dataset.uid));
  });
  $("#reviveSkip", banner).addEventListener("click", cancelRevive);
}

function resolveRevive(uid) {
  const cards = pendingPlacement?.candidates || [];
  const card = cards.find(c => c.uid === uid);
  if (!card) return;
  reviveCard(game.current, card);
  pendingPlacement = null;
  $("#reviveBanner")?.classList.add("hidden");
  afterPlay();
}

function cancelRevive() {
  pendingPlacement = null;
  $("#reviveBanner")?.classList.add("hidden");
  afterPlay();
}

function beginDecoySelection(pi) {
  const p = game.players[pi];
  const own = [];
  ROWS.forEach(r => p.board[r].forEach(c => { if (!c.hero) own.push({ row: r, card: c }); }));
  if (!own.length) { log("诱饵没有可替换的己方非英雄单位。"); return; }
  pendingPlacement = { uid: null, kind: "decoy", rows: [], label: "诱饵替换", candidates: own };
  renderGame();
  renderDecoyBanner();
}

function renderDecoyBanner() {
  const banner = $("#reviveBanner");
  if (!banner || !pendingPlacement || pendingPlacement.kind !== "decoy") { banner?.classList.add("hidden"); return; }
  banner.classList.remove("hidden");
  const cardsHTML = pendingPlacement.candidates.map(c => `<div class="revive-card" data-uid="${c.card.uid}">${renderMiniCard(c.card, false).outerHTML}</div>`).join("");
  banner.innerHTML = `<span>选择要用诱饵换回手牌的己方单位：</span><div class="revive-cards">${cardsHTML}</div><button id="reviveSkip" type="button">不替换</button>`;
  $$(".revive-card", banner).forEach(el => {
    el.addEventListener("click", () => resolveDecoy(el.dataset.uid));
  });
  $("#reviveSkip", banner).addEventListener("click", cancelDecoy);
}

function resolveDecoy(uid) {
  const pi = game.current;
  const p = game.players[pi];
  const candidates = pendingPlacement?.candidates || [];
  const entry = candidates.find(e => e.card.uid === uid);
  if (!entry) return;
  p.board[entry.row] = p.board[entry.row].filter(c => c.uid !== entry.card.uid);
  p.hand.push(entry.card);
  log(`${p.name} 用诱饵收回了 ${cardName(entry.card)}。`);
  pendingPlacement = null;
  $("#reviveBanner")?.classList.add("hidden");
  afterPlay();
}

function cancelDecoy() {
  pendingPlacement = null;
  $("#reviveBanner")?.classList.add("hidden");
  afterPlay();
}

function doScorch(pi, row = null, opponentOnly = false) {
  recalcScores();
  const targets = [];
  const players = opponentOnly ? [1 - pi] : [0, 1];
  players.forEach(pidx => {
    ROWS.forEach(r => {
      if (row && r !== row) return;
      game.players[pidx].board[r].forEach(c => {
        if (!c.hero && (c.effective || 0) >= 10) targets.push({ pidx, row: r, card: c });
      });
    });
  });
  if (!targets.length) { log("灼烧没有找到可烧毁的目标。"); return; }
  const max = Math.max(...targets.map(t => t.card.effective || 0));
  const burned = targets.filter(t => (t.card.effective || 0) === max);
  burned.forEach(t => removeFromBoardToDiscard(t.pidx, t.row, t.card.uid));
  log(`灼烧烧毁 ${burned.length} 张战力 ${max} 的非英雄牌。`);
}

function doDecoy(pi) {
  const p = game.players[pi];
  const own = [];
  ROWS.forEach(r => p.board[r].forEach(c => { if (!c.hero) own.push({ row: r, card: c }); }));
  if (!own.length) { log("诱饵没有可替换的己方非英雄单位。"); return; }
  own.sort((a, b) => (b.card.strength || 0) - (a.card.strength || 0));
  const pick = own[0];
  p.board[pick.row] = p.board[pick.row].filter(c => c.uid !== pick.card.uid);
  p.hand.push(pick.card);
  log(`${p.name} 用诱饵收回了 ${cardName(pick.card)}。`);
}

function transformBerserkers(pi, row) {
  let n = 0;
  [0, 1].forEach(pidx => {
    game.players[pidx].board[row].forEach(c => {
      if (has(c, "Berserker") && !c.transformed) {
        c.baseName = c.baseName.includes("Young") ? "年轻狂战士熊形态" : "狂战士熊形态";
        c.strength = 8;
        c.abilities = c.abilities.filter(a => a !== "Berserker");
        c.transformed = true;
        n++;
      }
    });
  });
  log(`蘑菇酒让 ${n} 张狂战士变身。`);
}

function useLeader() {
  if (!game || game.over || isAITurn()) return;
  resolveLeader(game.current);
  afterPlay();
}

function resolveLeader(pi) {
  const p = game.players[pi];
  if (p.leaderUsed) return;
  p.leaderUsed = true;
  const text = (p.leader.leaderAbility || p.leader.abilityText || "").toLowerCase();
  log(`${p.name} 使用领袖：${cardName(p.leader)}。`);
  if (text.includes("clear") || text.includes("weather cards from play")) game.weather.clear();
  else if (text.includes("impenetrable fog")) addWeather("ranged");
  else if (text.includes("biting frost")) addWeather("melee");
  else if (text.includes("torrential rain")) addWeather("siege");
  else if (text.includes("siege") && text.includes("double")) game.rowHorn[pi].siege = true;
  else if (text.includes("ranged") && text.includes("double")) game.rowHorn[pi].ranged = true;
  else if (text.includes("melee") && text.includes("double")) game.rowHorn[pi].melee = true;
  else if (text.includes("strongest ranged")) doScorch(pi, "ranged", true);
  else if (text.includes("strongest siege")) doScorch(pi, "siege", true);
  else if (text.includes("close combat") || text.includes("melee")) doScorch(pi, "melee", true);
  else if (text.includes("shuffle")) {
    game.players.forEach(pl => { pl.deck = shuffle(pl.deck.concat(pl.discard)); pl.discard = []; });
    log("双方弃牌堆已洗回牌库。");
  }
  else if (text.includes("draw")) draw(p, 1);
  else log("该领袖能力在小程序中作为说明展示，不产生额外操作。");
}

function afterPlay(extraLog) {
  if (extraLog) log(extraLog);
  recalcScores();
  advanceTurn();
}

function passRound() {
  if (!game || game.over || isAITurn()) return;
  game.players[game.current].passed = true;
  log(`${game.players[game.current].name} 放弃本回合。`);
  advanceTurn();
}

function autoPassEmptyPlayers() {
  let changed = false;
  game.players.forEach(p => {
    if (p.hand.length === 0 && !p.passed) {
      p.passed = true;
      changed = true;
      log(`${p.name} 手牌已打完，自动放弃。`);
    }
  });
  return changed;
}

function advanceTurn() {
  autoPassEmptyPlayers();
  if (game.players.every(p => p.passed)) {
    endRound();
  } else {
    let guard = 0;
    do {
      game.current = 1 - game.current;
      guard++;
    } while (game.players[game.current].passed && guard < 10);
    // 如果循环后仍然是已放弃的玩家，说明所有人都放弃了
    if (game.players[game.current].passed) {
      endRound();
      renderGame();
      maybeAI();
      return;
    }
  }
  renderGame();
  maybeAI();
}

function endRound() {
  recalcScores();
  const scores = game.players.map((_, i) => totalScore(i));
  let winner = null;
  if (scores[0] > scores[1]) winner = 0;
  else if (scores[1] > scores[0]) winner = 1;
  else winner = tieWinner();
  if (winner == null) {
    game.players[0].roundsWon++;
    game.players[1].roundsWon++;
    log(`第 ${game.round} 回合平局，双方各得一小局。`);
  } else {
    game.players[winner].roundsWon++;
    log(`第 ${game.round} 回合结束：${scores[0]} : ${scores[1]}，${game.players[winner].name} 获胜。`);
    if (game.players[winner].faction === "Northern Realms") {
      draw(game.players[winner], 1);
      log("北方领域阵营被动：获胜后抽 1 张牌。 ");
    }
  }
  game.roundResults.push({ round: game.round, scores, winner });
  if (game.players.some(p => p.roundsWon >= 2) || game.round >= 3) {
    game.over = true;
    const finalWinner = game.players[0].roundsWon === game.players[1].roundsWon ? null : (game.players[0].roundsWon > game.players[1].roundsWon ? 0 : 1);
    game.finalWinner = finalWinner;
    game.finalScores = scores;
    recordCurrentMatchHistory(finalWinner, scores);
    renderMatchHistory();
    log(finalWinner == null ? "整局结束：平局。" : `整局结束：${game.players[finalWinner].name} 获胜。`);
    return;
  }
  cleanupRound();
  game.round++;
  game.weather.clear();
  game.rowHorn = [{ melee: false, ranged: false, siege: false }, { melee: false, ranged: false, siege: false }];
  game.players.forEach(p => p.passed = false);
  game.current = winner == null ? 0 : winner;
  if (game.round === 3) applySkelligePerk();
  autoPassEmptyPlayers();
  if (game.players.every(p => p.passed)) {
    endRound();
    return;
  }
  if (game.players[game.current].passed) game.current = 1 - game.current;
}

function tieWinner() {
  const n0 = game.players[0].faction === "Nilfgaardian Empire";
  const n1 = game.players[1].faction === "Nilfgaardian Empire";
  if (n0 && !n1) return 0;
  if (n1 && !n0) return 1;
  return null;
}

function cleanupRound() {
  game.players.forEach((p, pi) => {
    const keep = [];
    if (p.faction === "Monsters") {
      const candidates = ROWS.flatMap(r => p.board[r].filter(c => (c.category === "unit" || c.category === "hero") && !has(c, "Spy")).map(c => ({ row: r, card: c })));
      if (candidates.length) keep.push(candidates[Math.floor(Math.random() * candidates.length)]);
    }
    const keepIds = new Set(keep.map(k => k.card.uid));
    ROWS.forEach(r => {
      const next = [];
      p.board[r].forEach(c => {
        if (keepIds.has(c.uid)) next.push(c);
        else {
          if (has(c, "Summon Bovine Defense Force")) p.retained.push(tokenCard("Bovine Defense Force", pi));
          if (has(c, "Summon Avenger")) p.retained.push(tokenCard("Hemdall", pi));
          p.discard.push(c);
        }
      });
      p.board[r] = next;
    });
    p.retained.forEach(t => p.board[t.row[0]].push(t));
    if (p.retained.length) log(`${p.name} 的特殊召唤物进入新回合。`);
    p.retained = [];
    if (keep.length) log(`${p.name} 的怪物阵营被动保留了 ${cardName(keep[0].card)}。`);
  });
}

function tokenCard(name, owner) {
  const raw = DB.tokens.find(t => t.baseName === name);
  return makeInstance({
    id: "token-" + name,
    name,
    baseName: name,
    faction: raw.faction,
    category: raw.category,
    row: raw.row,
    strength: raw.strength,
    abilities: raw.abilities,
    abilityText: raw.abilities.join(", "),
    imageUrl: raw.imageUrl,
    hero: raw.category === "hero"
  }, owner);
}

function applySkelligePerk() {
  game.players.forEach((p, pi) => {
    if (p.faction !== "Skellige") return;
    const picks = shuffle(p.discard.filter(c => !c.hero && (c.category === "unit" || c.category === "hero"))).slice(0, 2);
    picks.forEach(c => {
      p.discard = p.discard.filter(x => x.uid !== c.uid);
      const row = c.row[0] || "melee";
      p.board[row].push(c);
    });
    if (picks.length) log(`${p.name} 的史凯利杰被动在第三回合复活了 ${picks.length} 张牌。`);
  });
}

function draw(p, n) {
  for (let i = 0; i < n; i++) {
    if (!p.deck.length) return;
    p.hand.push(p.deck.shift());
  }
}

function removeFromBoardToDiscard(pi, row, uid) {
  const p = game.players[pi];
  const idx = p.board[row].findIndex(c => c.uid === uid);
  if (idx >= 0) p.discard.push(p.board[row].splice(idx, 1)[0]);
}

function totalScore(pi) {
  recalcScores();
  return ROWS.reduce((sum, r) => sum + rowScore(pi, r), 0);
}

function rowScore(pi, row) {
  recalcScores();
  return game.players[pi].board[row].reduce((sum, c) => sum + (c.effective || 0), 0);
}

function handCardSort(a, b) {
  const group = c => c.hero ? 0 : (c.category === "unit" ? 1 : (c.category === "special" ? 2 : 3));
  const ga = group(a), gb = group(b);
  if (ga !== gb) return ga - gb;
  if (a.strength !== b.strength) return (b.strength || 0) - (a.strength || 0);
  return (a.baseName || "").localeCompare(b.baseName || "");
}

function recalcScores() {
  if (!game || game._scoring) return;
  game._scoring = true;
  game.players.forEach((p, pi) => {
    ROWS.forEach(row => {
      const cards = p.board[row];
      const bondCounts = {};
      cards.forEach(c => { if (has(c, "Tight Bond")) bondCounts[c.baseName] = (bondCounts[c.baseName] || 0) + 1; });
      const moraleCards = cards.filter(c => has(c, "Morale Boost"));
      const rowHorn = game.rowHorn[pi][row] || cards.some(c => has(c, "Commander's Horn"));
      cards.forEach(c => {
        let value = c.strength || 0;
        if (!c.hero && game.weather.has(row)) {
          value = p.leader && p.leader.baseName === "King Bran" ? Math.ceil(value / 2) : Math.min(value, 1);
        }
        if (!c.hero && has(c, "Tight Bond") && bondCounts[c.baseName] > 1) value *= bondCounts[c.baseName];
        if (!c.hero) {
          value += moraleCards.filter(m => m.uid !== c.uid).length;
          if (rowHorn) value *= 2;
        }
        c.effective = value;
      });
    });
  });
  game._scoring = false;
}

function maybeAI() {
  if (!game || game.over || !isAITurn() || aiTurnPending) return;
  aiTurnPending = true;
  if (aiStuckTimer) { clearTimeout(aiStuckTimer); aiStuckTimer = null; }
  // 正常节奏触发
  window.setTimeout(() => { aiTurnPending = false; runAiTurnSafely("AI回合异常"); }, AI_TURN_DELAY);
  // 安全兜底：若超时后仍卡在 AI 回合，强制恢复
  aiStuckTimer = window.setTimeout(() => {
    if (game && !game.over && isAITurn() && aiTurnPending) {
      console.warn("AI卡住检测触发，强制恢复");
      aiTurnPending = false;
      runAiTurnSafely("AI恢复异常");
    }
  }, AI_STUCK_TIMEOUT);
}

// 执行一次 AI 回合，出错时自动放弃本回合以避免卡死
function runAiTurnSafely(errLabel) {
  try {
    aiTurn();
  } catch (e) {
    console.error(errLabel + ":", e);
    if (game && !game.over && isAITurn()) {
      game.players[1].passed = true;
      log("系统遇到异常，自动放弃本回合。");
      advanceTurn();
    }
  }
}

function isAITurn() {
  return game && game.mode === "ai" && game.current === 1;
}

// ============ 系统 AI 决策核心 ============
// 目标：像真人一样管理手牌与小局节奏，而不是第一回合一次性出光。
// 关键思路：
// 1. 一局三小局两胜制，手牌是跨回合的稀缺资源；卡差（手牌数差）非常关键。
// 2. AI 会评估"本回合该不该继续投入"——领先够多就见好就收，保存手牌；
//    落后但追不回来就战略性弃局，把牌留到后面小局。
// 3. 通过若干次轻量蒙特卡洛式估算 + 规则启发，得到本回合获胜概率，据此决定出牌/放弃。
// 4. 难度只调节：搜索深度、失误概率、是否愿意战略弃局、领袖使用时机。

const AI_DIFFICULTY = {
  easy:   { blunder: 0.5,  sampleN: 0,  concede: false, horizon: 1, valueNoise: 8, leaderSmart: false, minLeadToStop: 99 },
  normal: { blunder: 0.1,  sampleN: 6,  concede: true,  horizon: 2, valueNoise: 2, leaderSmart: true,  minLeadToStop: 4 },
  hard:   { blunder: 0.0,  sampleN: 14, concede: true,  horizon: 3, valueNoise: 0, leaderSmart: true,  minLeadToStop: 0 }
};

function aiConfig() {
  return AI_DIFFICULTY[(game.players[1] && game.players[1].difficulty) || "normal"] || AI_DIFFICULTY.normal;
}

function aiTurn() {
  if (!game || game.over || !isAITurn()) return;
  const ai = game.players[1];
  const cfg = aiConfig();

  if (ai.hand.length === 0) {
    ai.passed = true;
    log(`${ai.name} 手牌已打完，自动放弃。`);
    advanceTurn();
    return;
  }

  const decision = aiDecideTurn(cfg);

  // 战略性放弃：见好就收保存手牌，或本小局已无力回天时弃局留牌
  if (decision.action === "pass") {
    ai.passed = true;
    log(`${ai.name} 放弃本回合，保存手牌。`);
    advanceTurn();
    return;
  }

  if (decision.action === "leader") {
    resolveLeader(1);
    afterPlay();
    return;
  }

  const card = decision.card;
  let row = decision.row;
  if (!row) {
    if (card.category === "special" && ["Commander's Horn", "Mardroeme"].includes(card.baseName)) row = bestOwnRow(1);
    else if (card.row && card.row.length) row = bestRowForCard(1, card);
  }
  playCard(card.uid, row, true);
}

// 估算：如果 AI 现在停手（放弃），本小局能否赢下
function aiRoundOutlook() {
  const me = totalScore(1), opp = totalScore(0);
  const oppPassed = game.players[0].passed;
  return { me, opp, diff: me - opp, oppPassed };
}

// 计算一张牌大致能给 AI 带来的净收益（含天气/号角/灼烧/间谍/医生/集结等）
function aiPlayGain(card) {
  // 特殊牌单独估收益
  if (card.category === "weather") {
    return aiWeatherGain(card);
  }
  if (card.baseName === "Clear Weather") {
    return game.weather.size ? aiClearWeatherGain() : -3;
  }
  if (card.baseName === "Commander's Horn") {
    const row = bestOwnRow(1);
    return Math.max(4, rowScore(1, row));
  }
  if (card.baseName === "Scorch") {
    return aiScorchGain();
  }
  if (card.baseName === "Decoy") {
    return bestDecoyTarget(1) ? 5 : -3;
  }
  if (card.baseName === "Mardroeme") {
    return bestBerserkerRow(1) ? 6 : -2;
  }
  // 普通单位：估算落场后的有效战力
  let gain = estimateUnitEffective(card, 1);
  if (has(card, "Spy")) {
    // 间谍：送分给对方，但换 2 张牌（卡差价值高），净值以卡差为主
    gain = -(card.strength || 0) + 14;
  }
  if (has(card, "Medic")) gain += 6;
  if (has(card, "Muster")) gain += 6;
  if (has(card, "Tight Bond")) gain += 4;
  return gain;
}

function estimateUnitEffective(card, pi) {
  let value = card.strength || 0;
  const row = (card.row && card.row[0]) || "melee";
  if (!card.hero && game.weather.has(row)) value = Math.min(value, 1);
  if (!card.hero && game.rowHorn[pi][row]) value *= 2;
  if (card.hero) value += 1; // 英雄不吃天气，额外稳定性加成
  return value;
}

function aiWeatherGain(card) {
  const rows = weatherRowsFor(card);
  const oppLoss = rows.reduce((s, r) => s + weatherDamage(0, r), 0);
  const selfLoss = rows.reduce((s, r) => s + weatherDamage(1, r), 0);
  return oppLoss - selfLoss;
}

function weatherDamage(pi, row) {
  if (game.weather.has(row)) return 0;
  return game.players[pi].board[row].reduce((s, c) => s + (c.hero ? 0 : Math.max(0, (c.strength || 0) - 1)), 0);
}

function aiClearWeatherGain() {
  let self = 0;
  ROWS.forEach(r => { if (game.weather.has(r)) self += weatherDamage(1, r); });
  let opp = 0;
  ROWS.forEach(r => { if (game.weather.has(r)) opp += weatherDamage(0, r); });
  return self - opp;
}

function aiScorchGain() {
  recalcScores();
  // 灼烧摧毁全场最高战力非英雄牌，估算对对方的杀伤
  let maxVal = -1, target = null, targetOwner = -1;
  [0, 1].forEach(pi => ROWS.forEach(r => game.players[pi].board[r].forEach(c => {
    if (!c.hero && (c.effective || 0) > maxVal) { maxVal = c.effective || 0; target = c; targetOwner = pi; }
  })));
  if (!target) return -2;
  return targetOwner === 0 ? maxVal + 2 : -maxVal; // 烧到对方是收益，烧到自己是损失
}

// 本回合决策：返回 { action: 'play'|'pass'|'leader', card?, row? }
function aiDecideTurn(cfg) {
  const ai = game.players[1];
  const { me, opp, diff, oppPassed } = aiRoundOutlook();
  const myCards = ai.hand.length;
  const oppCards = game.players[0].hand.length;
  const roundsLeftAfterThis = 3 - game.round;
  const aiRounds = ai.roundsWon, humanRounds = game.players[0].roundsWon;
  // 生死局：对手已拿下 1 小局，本局再输 = 直接输掉整场 → 必须死拼，不许战略弃局/见好就收
  // （擂台验证：valueGatedV2 靠这条守则综合胜率最高）
  const mustContest = humanRounds >= 1;

  // 对手已放弃：只要能反超/保持领先就补最小的分，然后停手，保存手牌
  if (oppPassed) {
    if (diff > 0) {
      return { action: "pass" };
    }
    // 落后：用尽量少的牌反超（挑刚好能翻盘的高收益牌）
    const need = -diff + 1;
    const best = aiBestCards(cfg)[0];
    if (best && aiPlayGain(best.card) >= need - 2) return { action: "play", card: best.card, row: best.row };
    // 补不上又是决胜局才硬拼，否则弃局保牌
    if (aiRounds < 1 && roundsLeftAfterThis === 0) return best ? { action: "play", card: best.card, row: best.row } : { action: "pass" };
    // 生死局：只要还有牌就继续拼，别轻易认输
    if (best && mustContest) return { action: "play", card: best.card, row: best.row };
    if (best && (diff > -12 || !cfg.concede)) return { action: "play", card: best.card, row: best.row };
    return { action: "pass" };
  }

  // 领袖：智能难度在落后、且领袖能力确实有用时才翻盘使用（擂台验证：门控后不再浪费无效领袖）
  if (cfg.leaderSmart && !ai.leaderUsed && diff < -6 && myCards <= oppCards + 1) {
    if (aiLeaderIsUseful()) return { action: "leader" };
  }

  const candidates = aiBestCards(cfg);
  const best = candidates[0];

  // 战略弃局：本小局明显落后、且继续投入不划算时，保存手牌到后面小局
  // 生死局(mustContest)时禁用：弃局 = 直接输掉整场
  if (cfg.concede && !mustContest && aiRounds < 2 && roundsLeftAfterThis >= 1) {
    const bestGain = best ? aiPlayGain(best.card) : 0;
    const deficit = -diff; // 对方领先我的分
    // 落后很多、手里也没有高性价比的翻盘手段：认这一局，留牌
    if (deficit > 18 && bestGain < deficit - 8 && myCards <= oppCards) {
      return { action: "pass" };
    }
    // 卡差吃亏（我剩得比对方多才有资本追），但差距不大又快没牌了则不硬填
    if (deficit > 30 && bestGain < 12) {
      return { action: "pass" };
    }
  }

  // 见好就收：已经领先，且继续出牌只是浪费卡差，则停手（保存手牌给下一小局）
  // 生死局时禁用：需要尽量拉开分差确保拿下本局
  if (!mustContest && diff >= cfg.minLeadToStop && diff > 0) {
    const bestGain = best ? aiPlayGain(best.card) : 0;
    // 领先幅度足够安全，且手里牌不多，继续打意义不大 -> 停手
    const safeLead = diff >= 10 || (diff >= 5 && oppCards <= myCards);
    if (safeLead && bestGain < 8 && game.round < 3) {
      return { action: "pass" };
    }
  }

  if (!best) return { action: "pass" };
  return { action: "play", card: best.card, row: best.row };
}

// 返回按收益排序的候选出牌（含失误扰动），每项 { card, row, gain }
function aiBestCards(cfg) {
  const ai = game.players[1];
  const scored = ai.hand.map(card => {
    let gain = aiPlayGain(card);
    // 难度失误：低难度加入随机噪声，偶尔选到次优牌
    if (cfg.valueNoise) gain += (Math.random() * 2 - 1) * cfg.valueNoise;
    let row = null;
    if (card.category === "special" && ["Commander's Horn", "Mardroeme"].includes(card.baseName)) row = bestOwnRow(1);
    else if (card.row && card.row.length) row = bestRowForCard(1, card);
    return { card, row, gain };
  }).sort((a, b) => b.gain - a.gain);

  // 低难度：一定概率整体打乱（模拟不理性玩家）
  if (cfg.blunder && Math.random() < cfg.blunder && scored.length > 1) {
    const i = 1 + Math.floor(Math.random() * (scored.length - 1));
    [scored[0], scored[i]] = [scored[i], scored[0]];
  }
  return scored;
}

function aiLeaderIsUseful() {
  const ai = game.players[1];
  const text = (ai.leader.leaderAbility || ai.leader.abilityText || "").toLowerCase();
  if (!text) return false;
  if (text.includes("clear") && game.weather.size) return true;
  if (text.includes("scorch") || text.includes("strongest")) return true;
  if (text.includes("double") || text.includes("horn")) return true;
  if (text.includes("frost") || text.includes("fog") || text.includes("rain")) return weatherDamage(0, "melee") + weatherDamage(0, "ranged") + weatherDamage(0, "siege") > 6;
  if (text.includes("draw")) return true;
  return false;
}

function bestRowForCard(pi, card) {
  if (!card.row || !card.row.length) return null;
  if (card.row.length === 1) return card.row[0];
  let best = card.row[0], bestScore = -1;
  card.row.forEach(r => {
    const s = game.players[pi].board[r].length;
    if (s > bestScore) { bestScore = s; best = r; }
  });
  return best;
}

function bestOwnRow(pi) {
  return ROWS.slice().sort((a, b) => rowScore(pi, b) - rowScore(pi, a))[0];
}

function has(card, ability) {
  return (card.abilities || []).includes(ability);
}

function log(message) {
  const li = document.createElement("li");
  li.textContent = message;
  $("#log").prepend(li);
  showToast(message);
}

function showToast(message) {
  const toast = $("#feedbackToast");
  if (!toast || !message || $("#game")?.classList.contains("hidden")) return;
  toast.textContent = message;
  toast.classList.remove("hidden");
  requestAnimationFrame(() => toast.classList.add("show"));
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
    window.setTimeout(() => toast.classList.add("hidden"), 220);
  }, 1800);
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
}
function escapeAttr(str) { return escapeHtml(str).replace(/'/g, "&#39;"); }
