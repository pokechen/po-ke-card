#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const SCRIPT_DIR = __dirname;
const DEFAULT_MAP_PATH = path.resolve(SCRIPT_DIR, '../docs/card-image-map.json');
const DEFAULT_ICONS_DIR = path.resolve(SCRIPT_DIR, '../card-icons/compress-icons');
const DEFAULT_GAME_DATA_PATH = path.resolve(SCRIPT_DIR, '../../po-ke-card-wechat-game/shared/data/zhangyu_cards.js');
const DEFAULT_CATEGORIES = ['人物', '传世', '主将', '谋略', '时局'];
const MANUAL_SPECIAL_CARDS = [
  { baseName: '无当飞军', categoryDisplayName: '特殊卡牌', source: 'manual' },
  { baseName: '东吴水师', categoryDisplayName: '特殊卡牌', source: 'manual' },
];
const IMAGE_EXTENSIONS = new Set(['.webp', '.png', '.jpg', '.jpeg']);

function parseArgs(argv) {
  const args = {
    mapPath: DEFAULT_MAP_PATH,
    iconsDir: DEFAULT_ICONS_DIR,
    gameDataPath: DEFAULT_GAME_DATA_PATH,
    categories: DEFAULT_CATEGORIES,
    includeAll: false,
    includeGameTokens: true,
    includeSummonedFromText: true,
    format: 'text',
    outPath: '',
  };

  for (const rawArg of argv) {
    const [key, ...valueParts] = rawArg.split('=');
    const value = valueParts.join('=');

    if (key === '--map' || key === '--json') {
      args.mapPath = path.resolve(value);
    } else if (key === '--icons' || key === '--images') {
      args.iconsDir = path.resolve(value);
    } else if (key === '--game-data') {
      args.gameDataPath = path.resolve(value);
    } else if (key === '--categories') {
      args.categories = value.split(',').map((item) => item.trim()).filter(Boolean);
    } else if (key === '--all') {
      args.includeAll = true;
    } else if (key === '--no-game-tokens') {
      args.includeGameTokens = false;
    } else if (key === '--no-summon-text') {
      args.includeSummonedFromText = false;
    } else if (key === '--format') {
      args.format = value === 'json' ? 'json' : 'text';
    } else if (key === '--out') {
      args.outPath = path.resolve(value);
    } else if (key === '--help' || key === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`未知参数：${rawArg}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`用法：node check-missing-card-images.js [options]\n\n参数：\n  --map=<path>             卡牌映射 JSON，默认 ../docs/card-image-map.json\n  --icons=<dir>            图片目录，默认 ../card-icons/compress-icons\n  --game-data=<path>       游戏卡牌数据 JS，默认 ../../po-ke-card-wechat-game/shared/data/zhangyu_cards.js\n  --categories=a,b,c       要检查的分类，默认 人物,传世,主将,谋略,时局\n  --all                    检查 JSON 里的全部分类\n  --no-game-tokens         不从游戏数据 tokens 中追加特殊卡牌\n  --no-summon-text         不从 abilityText 的“召唤...”描述中追加召唤卡牌\n  --format=text|json       输出格式，默认 text\n  --out=<path>             将缺图数据写入 JSON 文件\n  -h, --help               显示帮助\n\n说明：默认会检查卡牌映射里的常规卡、谋略牌、时局牌、主将，并额外确认召唤/转化等特殊卡牌。`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizeName(name) {
  return String(name || '').trim().normalize('NFC');
}

function listImageNames(iconsDir) {
  return new Set(
    fs.readdirSync(iconsDir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
      .map((fileName) => normalizeName(path.basename(fileName, path.extname(fileName))))
  );
}

function uniqueByBaseName(cards) {
  const seen = new Set();
  const result = [];

  for (const card of cards) {
    const baseName = normalizeName(card.baseName);
    if (!baseName || seen.has(baseName)) continue;
    seen.add(baseName);
    result.push({ ...card, baseName });
  }

  return result;
}

function groupByCategory(cards) {
  return cards.reduce((groups, card) => {
    const category = card.categoryDisplayName || '未分类';
    if (!groups[category]) groups[category] = [];
    groups[category].push(card.baseName);
    return groups;
  }, {});
}

function extractSummonedCards(cards) {
  const result = [];
  const summonPattern = /召唤(?:一张\s*\d+\s*点(?:传世)?「([^」]+)」|([\u4e00-\u9fa5A-Za-z0-9_·-]+))/g;

  for (const card of cards) {
    const abilityText = String(card.abilityText || '');
    for (const match of abilityText.matchAll(summonPattern)) {
      const baseName = normalizeName(match[1] || match[2]);
      if (!baseName) continue;
      result.push({
        baseName,
        categoryDisplayName: '特殊卡牌',
        source: `abilityText:${card.baseName || ''}`,
      });
    }
  }

  return result;
}

function loadGameTokens(gameDataPath) {
  if (!gameDataPath || !fs.existsSync(gameDataPath)) return [];

  const resolvedPath = require.resolve(gameDataPath);
  delete require.cache[resolvedPath];
  const gameData = require(resolvedPath);
  const tokens = Array.isArray(gameData.tokens) ? gameData.tokens : [];

  return tokens.map((token) => ({
    baseName: token.displayName || token.name || token.baseName,
    categoryDisplayName: '特殊卡牌',
    source: `gameToken:${token.id || ''}`,
    gameBaseName: token.baseName || '',
    imageUrl: token.imageUrl || '',
  }));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const cards = readJson(args.mapPath);
  const generatedImages = listImageNames(args.iconsDir);
  const categorySet = new Set(args.categories);
  const mapCards = cards.filter((card) => args.includeAll || categorySet.has(card.categoryDisplayName));
  const summonedCards = args.includeSummonedFromText ? extractSummonedCards(cards) : [];
  const gameTokens = args.includeGameTokens ? loadGameTokens(args.gameDataPath) : [];

  const cardsToCheck = uniqueByBaseName([
    ...mapCards,
    ...summonedCards,
    ...gameTokens,
    ...MANUAL_SPECIAL_CARDS,
  ]);

  const missing = cardsToCheck.filter((card) => !generatedImages.has(normalizeName(card.baseName)));
  const generated = cardsToCheck.length - missing.length;
  const result = {
    mapPath: args.mapPath,
    iconsDir: args.iconsDir,
    gameDataPath: args.includeGameTokens ? args.gameDataPath : '',
    categories: args.includeAll ? 'ALL' : args.categories,
    specialCards: uniqueByBaseName([...summonedCards, ...gameTokens, ...MANUAL_SPECIAL_CARDS]).map((card) => ({
      baseName: card.baseName,
      source: card.source,
      imageUrl: card.imageUrl || '',
      gameBaseName: card.gameBaseName || '',
    })),
    totalChecked: cardsToCheck.length,
    generated,
    missingCount: missing.length,
    missingNames: missing.map((card) => card.baseName),
    missingByCategory: groupByCategory(missing),
    missing,
  };

  if (args.outPath) {
    fs.mkdirSync(path.dirname(args.outPath), { recursive: true });
    fs.writeFileSync(args.outPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  }

  if (args.format === 'json') {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const specialNames = result.specialCards.map((card) => card.baseName).join('、') || '无';
  console.log(`检查范围：${args.includeAll ? '全部分类' : args.categories.join('、')}；特殊卡牌：${specialNames}`);
  console.log(`已检查：${result.totalChecked}，已有图片：${generated}，缺图：${missing.length}`);
  console.log('');
  console.log('缺图列表：');

  const groups = groupByCategory(missing);
  for (const [category, names] of Object.entries(groups)) {
    console.log(`\n[${category}] ${names.length}`);
    for (const name of names) {
      console.log(`- ${name}`);
    }
  }

  if (args.outPath) {
    console.log(`\n已写入：${args.outPath}`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
}
