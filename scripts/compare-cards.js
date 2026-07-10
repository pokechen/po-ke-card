const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'temp', 'card-icons');
const mapArr = JSON.parse(fs.readFileSync(path.join(dir, 'card-image-map.json'), 'utf8'));
const gpt = JSON.parse(fs.readFileSync(path.join(dir, 'gpt5.5-card.json'), 'utf8'));

// ---------- card-image-map.json ----------
console.log('===== card-image-map.json =====');
console.log('数组条目数(unique baseName+faction 记录):', mapArr.length);
let totalCopies = 0;
const byCategory = {};
const byFaction = {};
const catCopies = {};
for (const c of mapArr) {
  const n = c.cardCount || 0;
  totalCopies += n;
  byCategory[c.categoryDisplayName] = (byCategory[c.categoryDisplayName] || 0) + 1;
  catCopies[c.categoryDisplayName] = (catCopies[c.categoryDisplayName] || 0) + n;
  byFaction[c.faction] = (byFaction[c.faction] || 0) + 1;
}
console.log('合计张数(含重复copy, sum cardCount):', totalCopies);
console.log('按 categoryDisplayName 分类(记录数 / 总张数):');
for (const k of Object.keys(byCategory)) console.log('  ', k, ':', byCategory[k], '记录 /', catCopies[k], '张');
console.log('按 faction 分类(记录数):');
for (const k of Object.keys(byFaction)) console.log('  ', k, ':', byFaction[k]);

// ---------- gpt5.5-card.json ----------
console.log('\n===== gpt5.5-card.json =====');
console.log('stats.total_card_entries:', gpt.stats.total_card_entries);
console.log('stats.unique_cards_by_name_and_deck:', gpt.stats.unique_cards_by_name_and_deck);
console.log('stats.leader_cards:', gpt.stats.leader_cards);
console.log('card_entries.length:', gpt.card_entries.length);
const leaders = gpt.card_entries.filter(c => c.is_leader).length;
const nonLeaders = gpt.card_entries.length - leaders;
console.log('  其中 is_leader=true:', leaders, ' 非领袖:', nonLeaders);
console.log('entries_by_deck:', JSON.stringify(gpt.stats.entries_by_deck));
console.log('unique_by_deck:', JSON.stringify(gpt.stats.unique_by_deck));

// unique canonical per deck in entries
const uniq = new Set();
for (const c of gpt.card_entries) uniq.add(c.canonical_name + '|' + c.deck);
console.log('实际 unique(canonical_name|deck):', uniq.size);
