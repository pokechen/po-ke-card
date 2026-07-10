// 校验 Hero(传世)/Muster(集结)/Tight Bond(同盟) 三类依赖具体数据结构的能力
const DATA = require("../po-ke-card-wechat-game/js/data/zhangyu_cards.js");
const cards = DATA.cards || [];
const tokens = DATA.tokens || [];
const all = [...cards, ...tokens];

// ---- Hero 校验 ----
// 引擎 cloneCard: hero = !!card.hero （不看 abilities/category!）
// recalcScores/doScorch 全部用布尔 card.hero
console.log("=== Hero(传世) 字段一致性 ===");
console.log("规则：凡 abilities 含 Hero，或 category==='hero'，都应设置 hero:true，否则克隆后丢失传世属性\n");
let heroProblems = 0;
all.forEach(c => {
  const declaredHero = (c.abilities || []).includes("Hero") || c.category === "hero";
  const boolHero = !!c.hero;
  if (declaredHero && !boolHero) {
    heroProblems++;
    console.log(`  !! [${c.baseName}] abilities=${JSON.stringify(c.abilities)} category=${c.category} hero=${c.hero} —— 传世属性会丢失`);
  }
});
if (!heroProblems) console.log("  OK：所有传世卡都正确设置了 hero:true");
console.log(`  传世问题卡数: ${heroProblems}`);

// 反向：设了 hero:true 但没声明 Hero 能力（提示性）
console.log("\n=== 设了 hero:true 的卡 ===");
console.log("  " + all.filter(c => c.hero).map(c => c.baseName).join(", ") || "  (无)");

// ---- Muster 校验 ----
// doMuster 按相同 baseName 从手牌+牌库额外打出。需要牌池中存在同名多份，否则无效。
console.log("\n=== Muster(集结/集贤) 校验：同名是否有多份 ===");
const nameCount = {};
cards.forEach(c => { nameCount[c.baseName] = (nameCount[c.baseName] || 0) + 1; });
const musterCards = cards.filter(c => (c.abilities || []).includes("Muster"));
const musterByName = {};
musterCards.forEach(c => { musterByName[c.baseName] = (musterByName[c.baseName] || 0) + 1; });
Object.keys(musterByName).forEach(name => {
  const total = nameCount[name];
  const flag = total > 1 ? `有 ${total} 份，可集结` : "!! 仅 1 份，集结无效果";
  console.log(`  [${name}] 牌池中 ${total} 份 -> ${flag}`);
});

// ---- Tight Bond 校验 ----
// recalcScores 按同名同线多份倍乘。需要同名多份才有意义。
console.log("\n=== Tight Bond(同盟) 校验：同名是否有多份 ===");
const bondCards = cards.filter(c => (c.abilities || []).includes("Tight Bond"));
const bondByName = {};
bondCards.forEach(c => { bondByName[c.baseName] = (bondByName[c.baseName] || 0) + 1; });
Object.keys(bondByName).forEach(name => {
  const total = nameCount[name];
  const flag = total > 1 ? `有 ${total} 份，同盟可倍乘` : "!! 仅 1 份，同盟无加成";
  console.log(`  [${name}] 牌池中 ${total} 份 -> ${flag}`);
});

// ---- Berserker/Mardroeme 配套 ----
console.log("\n=== Berserker/Mardroeme 配套 ===");
const berserkers = cards.filter(c => (c.abilities || []).includes("Berserker"));
const mardroeme = cards.filter(c => (c.abilities || []).includes("Mardroeme"));
console.log(`  Berserker 卡: ${berserkers.map(c=>c.baseName).join(", ") || "(无)"}`);
console.log(`  Mardroeme(破釜) 卡: ${mardroeme.map(c=>c.baseName).join(", ") || "(无)"}`);
console.log(`  Transformed Bear token: ${tokens.some(t=>t.baseName==="Transformed Bear") ? "存在" : "!! 缺失"}`);
if (berserkers.length && !mardroeme.length) console.log("  !! 有 Berserker 但无 Mardroeme，狂战士永远无法变身");
if (mardroeme.length && !berserkers.length) console.log("  !! 有 Mardroeme 但无 Berserker，破釜无目标");
