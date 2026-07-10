const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'temp', 'card-icons');
const mapArr = JSON.parse(fs.readFileSync(path.join(dir, 'card-image-map.json'), 'utf8'));
const c2 = JSON.parse(fs.readFileSync(path.join(dir, 'gpt5.5-card2.json'), 'utf8'));

// ---- faction normalize ----
function normFaction(f) {
  if (!f) return f;
  if (f === 'Nilfgaardian Empire') return 'Nilfgaard';
  return f;
}

// ---- build authoritative index from card2.cards (base_name + faction) ----
const byKey = {};       // base_name|faction -> { count, cards:[] }
for (const c of c2.cards) {
  const key = c.base_name + '|' + normFaction(c.faction);
  if (!byKey[key]) byKey[key] = { count: 0, cards: [] };
  byKey[key].count++;
  byKey[key].cards.push(c);
}

// ---- row derive from card2 ----
function rowFromCard2(c) {
  const t = c.card_type;
  if (t === 'Leader') return 'Leader';
  if (t === 'Weather') return 'Weather';
  if (t === 'Special') return 'Special';
  let r = c.combat_row;
  if (r == null || r === 'null') return null;
  const rl = String(r).toLowerCase();
  if (rl.includes(',') || rl.includes(' or ')) return 'Agile';
  if (rl === 'close combat') return 'Close Combat';
  if (rl === 'ranged combat') return 'Ranged';
  if (rl === 'siege') return 'Siege';
  return r;
}

// ---- ability tag normalize (only for taggable short abilities) ----
function normTag(t) {
  const s = t.trim().toLowerCase();
  const m = {
    'hero': 'Hero',
    'medic': 'Medic',
    'muster': 'Muster',
    'spy': 'Spy',
    'agile': 'Agile',
    'decoy': 'Decoy',
    'berserker': 'Berserker',
    'mardroeme': 'Mardroeme',
    "commander's horn": "Commander's Horn",
    'morale boost': 'Morale Boost',
    'tight bond': 'Tight Bond',
    'summon avenger': 'Summon Avenger',
    'summon shield maidens': 'Summon Shield Maidens',
    'weather': 'Weather',
    'clear weather': 'Clear Weather',
  };
  if (m[s]) return m[s];
  if (s.startsWith('scorch')) return 'Scorch';
  return null; // long sentence / unknown -> not taggable
}

function tagsFromMap(gwentAbility) {
  if (!gwentAbility || gwentAbility === 'None') return { tags: new Set(), taggable: true };
  const parts = gwentAbility.split(',').map(x => x.trim());
  const tags = new Set();
  let taggable = true;
  for (const p of parts) {
    const t = normTag(p);
    if (t) tags.add(t);
    else taggable = false; // contains a long/leader-style description
  }
  return { tags, taggable };
}

function tagsFromCard2(c) {
  const tags = new Set();
  let taggable = true;
  if (c.card_type === 'Hero') tags.add('Hero');
  if (c.card_type === 'Weather') tags.add('Weather');
  // card2 用 combat_row 表达敏捷（"Close combat or Ranged combat"），而 map 用能力标签表达，
  // 归一化时把敏捷战线也视为 Agile 标签，避免同义表述被误报。
  const rl = String(c.combat_row || '').toLowerCase();
  if (rl.includes(',') || rl.includes(' or ')) tags.add('Agile');
  for (const a of (c.abilities || [])) {
    const t = normTag(a);
    if (t) tags.add(t);
    else taggable = false;
  }
  return { tags, taggable };
}

// 已联网核实（官方 Witcher Wiki）确认 map 正确、card2 自身数据有误的例外，跳过误报：
//  - Kambi：card2 误标 card_type=Special，实际为 Unit/近战。
const CARD2_ERROR_EXCEPTIONS = new Set(['Kambi']);

function setEq(a, b) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

// ---- iterate map records ----
const issues = { faction: [], row: [], count: [], strength: [], ability: [], notFound: [], nameMismatch: [] };

for (const m of mapArr) {
  const isLeader = m.gwentRow === 'Leader' || m.gwentFaction === '领袖牌';
  if (isLeader) continue; // leaders handled separately below

  const nm = m.gwentCardName;
  const fac = normFaction(m.gwentFactionKey);
  const key = nm + '|' + fac;
  let ref = byKey[key];

  // try name-only fallback
  if (!ref) {
    const cands = c2.cards.filter(c => c.base_name === nm);
    if (cands.length) {
      issues.nameMismatch.push({ baseName: m.baseName, gwentCardName: nm, mapFaction: fac, refFactions: [...new Set(cands.map(c => normFaction(c.faction)))] });
      // still compare against first candidate's faction group
      ref = { count: cands.length, cards: cands };
    } else {
      issues.notFound.push({ baseName: m.baseName, gwentCardName: nm, faction: fac });
      continue;
    }
  }

  const rep = ref.cards[0];

  // faction
  if (normFaction(rep.faction) !== fac) {
    issues.faction.push({ baseName: m.baseName, gwentCardName: nm, map: fac, ref: normFaction(rep.faction) });
  }
  // row
  const refRow = rowFromCard2(rep);
  if (refRow !== m.gwentRow && !CARD2_ERROR_EXCEPTIONS.has(nm)) {
    issues.row.push({ baseName: m.baseName, gwentCardName: nm, map: m.gwentRow, ref: refRow, combat_row: rep.combat_row, card_type: rep.card_type });
  }
  // strength
  const refStr = rep.strength == null ? 0 : rep.strength;
  const mapStr = m.gwentStrength == null ? 0 : m.gwentStrength;
  if (refStr !== mapStr) {
    issues.strength.push({ baseName: m.baseName, gwentCardName: nm, map: m.gwentStrength, ref: rep.strength });
  }
  // count
  if (ref.count !== m.cardCount) {
    issues.count.push({ baseName: m.baseName, gwentCardName: nm, map: m.cardCount, ref: ref.count });
  }
  // ability (only when both taggable)
  const mt = tagsFromMap(m.gwentAbility);
  const rt = tagsFromCard2(rep);
  if (mt.taggable && rt.taggable) {
    if (!setEq(mt.tags, rt.tags)) {
      issues.ability.push({ baseName: m.baseName, gwentCardName: nm, map: m.gwentAbility, mapTags: [...mt.tags], refTags: [...rt.tags], refAbilities: rep.abilities, card_type: rep.card_type });
    }
  }
}

function dump(title, arr) {
  console.log('\n### ' + title + ' (' + arr.length + ')');
  arr.forEach(x => console.log('  ' + JSON.stringify(x)));
}
dump('阵营不一致', issues.faction);
dump('战线不一致', issues.row);
dump('数量不一致', issues.count);
dump('战力不一致', issues.strength);
dump('效果不一致(可标签化对比)', issues.ability);
dump('英文名/阵营匹配偏差', issues.nameMismatch);
dump('参考文件中未找到', issues.notFound);
