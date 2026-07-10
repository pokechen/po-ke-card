// 分析微信小游戏卡牌效果实现是否正确
// 用法: node scripts/analyze-abilities.js
const DATA = require("../po-ke-card-wechat-game/js/data/zhangyu_cards.js");

const cards = DATA.cards || [];
const tokens = DATA.tokens || [];
const all = [...cards, ...tokens];

// 引擎 battle.js / cards.js 已识别并会实际执行的技能英文名
const ENGINE_ABILITIES = new Set([
  "Hero", "Spy", "Medic", "Tight Bond", "Morale Boost", "Muster", "Agile",
  "Scorch", "Commander's Horn", "Summon Shield Maidens", "Summon Avenger",
  "Summon Bovine Defense Force", "Berserker", "Mardroeme"
]);

// 引擎里被硬编码引用的 token/关联牌 baseName
const REFERENCED_TOKEN_NAMES = [
  "Clan Drummond Shield Maiden", "Hemdall", "Bovine Defense Force", "Transformed Bear"
];

const tokenNames = new Set(tokens.map(t => t.baseName));

console.log("=== 概况 ===");
console.log("cards:", cards.length, " tokens:", tokens.length, " 合计:", all.length);

// 1) 收集所有出现过的 abilities，找出引擎不认识的
const usedAbilities = {};
all.forEach(c => (c.abilities || []).forEach(a => { usedAbilities[a] = (usedAbilities[a] || 0) + 1; }));
console.log("\n=== 数据中出现的所有 abilities（次数）===");
Object.keys(usedAbilities).sort().forEach(a => {
  console.log(`  ${a}: ${usedAbilities[a]}  ${ENGINE_ABILITIES.has(a) ? "OK" : "!! 引擎未识别"}`);
});

// 2) token 引用名是否存在
console.log("\n=== 引擎硬编码引用的 token 是否存在 ===");
REFERENCED_TOKEN_NAMES.forEach(n => console.log(`  ${n}: ${tokenNames.has(n) ? "存在" : "!! 缺失"}`));
console.log("  实际 tokens:", tokens.map(t => t.baseName).join(", "));

// 3) 时局牌解析检查
console.log("\n=== 时局牌(weather) 检查 ===");
const KNOWN_WEATHER_EN = new Set(["Biting Frost", "Impenetrable Fog", "Torrential Rain", "Skellige Storm"]);
all.filter(c => c.category === "weather").forEach(c => {
  const isClear = /拨云见日|Clear Weather/i.test(c.baseName || "");
  const byEn = KNOWN_WEATHER_EN.has(c.baseName);
  const rows = c.row || [];
  let status;
  if (isClear) status = "晴天(清除)";
  else if (byEn) status = "英文名硬编码识别 OK";
  else if (rows.length) status = "回退 card.row=" + JSON.stringify(rows);
  else status = "!! 无法确定作用线(既非英文名，也无 row)";
  console.log(`  [${c.baseName}] display=${c.displayName} row=${JSON.stringify(rows)} -> ${status}`);
});

// 4) 描述提到效果但 abilities 未含对应技能
console.log("\n=== 描述提到效果但 abilities 缺对应技能（疑似漏配）===");
const KW = [
  { re: /出使|间谍|打到对方|潜伏/, ability: "Spy" },
  { re: /济世|复归|复活|从弃牌堆.*(单位|人物)|举荐/, ability: "Medic" },
  { re: /集贤|集结|额外打出.*同名|招募/, ability: "Muster" },
  { re: /同盟|同名.*倍|并列/, ability: "Tight Bond" },
  { re: /振势|士气|其他.*\+\s*1/, ability: "Morale Boost" },
  { re: /号令|翻倍|战力.*倍/, ability: "Commander's Horn" },
  { re: /奇策|摧毁.*最(强|高)|烧灼/, ability: "Scorch" },
  { re: /通才|机动|任一阵线|任意.*战线/, ability: "Agile" }
];
all.forEach(c => {
  if (c.category === "leader") return;
  const text = `${c.abilityText || ""} ${c.pohuDesignNote || ""}`;
  const has = new Set(c.abilities || []);
  KW.forEach(k => {
    if (k.re.test(text) && !has.has(k.ability)) {
      console.log(`  [${c.baseName}] 缺「${k.ability}」 abilities=${JSON.stringify(c.abilities || [])}`);
      console.log(`      text: ${text.trim().slice(0, 70)}`);
    }
  });
});

// 5) 有技能但描述为空
console.log("\n=== 有技能但 abilityText 为空的非主将卡 ===");
all.forEach(c => {
  if (c.category === "leader") return;
  if ((c.abilities || []).length && !(c.abilityText || "").trim()) {
    console.log(`  [${c.baseName}] abilities=${JSON.stringify(c.abilities)}`);
  }
});

// 6) 主将技能命中检查
console.log("\n=== 主将(leader) 技能文本正则命中检查 ===");
const leaderRes = [
  { name: "半损", re: /half (of )?(their )?strength|lose half|半损|一半战力/i },
  { name: "抽牌", re: /draw an extra card|draw 1|draw|抽/i },
  { name: "清时局", re: /clear any weather|clear.*weather|clear|清除|拨云/i },
  { name: "号令翻倍", re: /commanders horn|commander's horn|double|horn|翻倍|号令/i },
  { name: "摧毁", re: /destroy|strongest|scorch|摧毁|奇策/i },
  { name: "侦察", re: /look at 3 random|侦察|查看/i },
  { name: "封锁主将", re: /cancel your opponent|cancel.*leader|取消.*主将/i },
  { name: "取对手弃牌", re: /opponent'?s discard|对手.*弃牌/i },
  { name: "取己方弃牌", re: /restore a card from your discard|弃牌堆.*手牌/i },
  { name: "选时局", re: /pick any weather|pick a .*weather|biting frost|impenetrable fog|torrential rain|weather/i },
  { name: "洗回", re: /shuffle all cards/i },
  { name: "弃2抽1", re: /discard 2 cards/i },
  { name: "移动机动", re: /move agile/i }
];
all.filter(c => c.category === "leader").forEach(c => {
  const text = `${c.baseName || ""} ${c.leaderAbility || ""} ${c.abilityText || ""}`.toLowerCase();
  const hits = leaderRes.filter(r => r.re.test(text)).map(r => r.name);
  console.log(`  [${c.baseName}] la="${c.leaderAbility || ""}" | ab="${(c.abilityText||"").slice(0,40)}"`);
  console.log(`      命中: ${hits.join(", ") || "(无)"}${hits.length ? "" : "  !! 无效果/被动"}`);
});

console.log("\n=== 分析完成 ===");
