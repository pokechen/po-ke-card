const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'temp', 'card-icons', 'card-image-map.json');
const raw = fs.readFileSync(p, 'utf8');
const data = JSON.parse(raw);

// 以 gpt5.5-card.json / gpt5.5-card2.json 及项目权威文档为准的修正（仅涉及：战线 / 效果）
const edits = {
  // 战线修正
  "Cow": { gwentRow: "Ranged", rowDisplayName: "朝堂" },
  "Gaunter O'Dimm: Darkness": { gwentRow: "Ranged", rowDisplayName: "朝堂" },
  // 战线 + 效果修正
  "Dol Blathanna Scout": { gwentRow: "Agile", rowDisplayName: "疆场 / 朝堂", gwentAbility: "Agile", abilityText: "通才" },
  "Griffin": { gwentRow: "Close Combat", rowDisplayName: "疆场", gwentAbility: "None", abilityText: "普通人物：提供基础影响力。" },
  "Clan Heymaey Skald": { gwentRow: "Close Combat", rowDisplayName: "疆场", gwentAbility: "None", abilityText: "普通人物：提供基础影响力。" },
  "Clan Tordarroch Armorsmith": { gwentRow: "Close Combat", rowDisplayName: "疆场", gwentAbility: "None", abilityText: "普通人物：提供基础影响力。" },
  // 效果修正
  "Mahakaman Defender": { gwentAbility: "Muster", abilityText: "集贤" },
  "Blueboy Lugos": { gwentAbility: "None", abilityText: "普通人物：提供基础影响力。" },
  "Kayran": { gwentAbility: "Hero, Morale Boost, Agile", abilityText: "传世、通才、振势" },
  // 战力修正：官方 Witcher Wiki + card2 + 权威文档三方一致为 1（原误标 2）
  "Yarpen Zigrin": { strength: 1, gwentStrength: 1 },
};

// 已联网核实、确认当前 map 正确、无需改动的争议卡（仅记录，不修改）：
//  - Kambi/伏兵奇兆：官方 Wiki 为 Unit/近战/Summon Avenger，map 正确（card2 的 "Special" 有误）。
//  - Olgierd von Everec/荆轲：官方 Wiki 为 Unit（非英雄牌）/战力6/Agile+Morale Boost，
//    map 现为 "Agile, Morale Boost" 正确（项目文档 20260630 标注的 "hero" 有误）。

const log = [];
for (const rec of data) {
  const e = edits[rec.gwentCardName];
  if (!e) continue;
  for (const [k, v] of Object.entries(e)) {
    if (rec[k] !== v) {
      log.push(`${rec.baseName} (${rec.gwentCardName}) .${k}: ${JSON.stringify(rec[k])} -> ${JSON.stringify(v)}`);
      rec[k] = v;
    }
  }
}

fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('修改条目数:', log.length);
log.forEach(l => console.log('  ' + l));
